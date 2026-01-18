import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCouponStore, type Coupon } from '@/store/useCouponStore';
import { Plus, Search, Edit, Trash2, X, Tag, Percent, DollarSign, Copy, Check } from 'lucide-react';

export function CouponManager() {
    const { coupons, addCoupon, updateCoupon, deleteCoupon } = useCouponStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const filteredCoupons = coupons.filter((coupon) =>
        coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCopyCode = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleOpenCreate = () => {
        setEditingCoupon(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        deleteCoupon(id);
        setDeleteConfirm(null);
    };

    const calculateDiscount = (coupon: Coupon, sampleAmount = 100) => {
        if (coupon.discountType === 'percentage') {
            return `${coupon.discountValue}% off`;
        }
        return `$${coupon.discountValue} off`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Coupons</h1>
                    <p className="text-muted-foreground">Manage discount codes and promotions</p>
                </div>
                <Button className="gap-2" onClick={handleOpenCreate}>
                    <Plus className="h-4 w-4" />
                    Create Coupon
                </Button>
            </div>

            {/* Search */}
            <Card className="border-border/50">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search coupons…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                            autoComplete="off"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Coupons Table */}
            <Card className="border-border/50">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Code</th>
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Discount</th>
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Min. Order</th>
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Usage</th>
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Expires</th>
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Status</th>
                                    <th className="px-6 py-4 text-right font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCoupons.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                                            {searchQuery ? 'No coupons found' : 'No coupons yet. Create your first coupon!'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCoupons.map((coupon) => (
                                        <tr key={coupon.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Tag className="h-4 w-4 text-primary" />
                                                    <span className="font-mono font-bold">{coupon.code}</span>
                                                    <button
                                                        onClick={() => handleCopyCode(coupon.code, coupon.id)}
                                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                                        aria-label="Copy code"
                                                    >
                                                        {copiedId === coupon.id ? (
                                                            <Check className="h-4 w-4 text-green-600" />
                                                        ) : (
                                                            <Copy className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    {coupon.discountType === 'percentage' ? (
                                                        <Percent className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                    <span className="font-medium">{calculateDiscount(coupon)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                {coupon.minOrderValue > 0 ? `$${coupon.minOrderValue}` : '—'}
                                            </td>
                                            <td className="px-6 py-4" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                <span className={coupon.usageCount >= coupon.maxUsage ? 'text-red-600' : ''}>
                                                    {coupon.usageCount}
                                                </span>
                                                <span className="text-muted-foreground"> / {coupon.maxUsage}</span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                                {coupon.expiresAt
                                                    ? new Date(coupon.expiresAt).toLocaleDateString()
                                                    : 'Never'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${coupon.isActive
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                                                        }`}
                                                >
                                                    {coupon.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => handleOpenEdit(coupon)}
                                                        aria-label={`Edit ${coupon.code}`}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                                        onClick={() => setDeleteConfirm(coupon.id)}
                                                        aria-label={`Delete ${coupon.code}`}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Coupon Modal */}
            {isModalOpen && (
                <CouponModal
                    coupon={editingCoupon}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(data) => {
                        if (editingCoupon) {
                            updateCoupon(editingCoupon.id, data);
                        } else {
                            addCoupon(data as Omit<Coupon, 'id' | 'usageCount' | 'createdAt'>);
                        }
                        setIsModalOpen(false);
                    }}
                />
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteConfirm(null)} />
                    <Card className="relative z-10 w-full max-w-md mx-4">
                        <CardContent className="p-6 text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                                <Trash2 className="h-6 w-6 text-destructive" />
                            </div>
                            <h3 className="text-lg font-bold">Delete Coupon</h3>
                            <p className="mt-2 text-muted-foreground">
                                Are you sure you want to delete this coupon? This action cannot be undone.
                            </p>
                            <div className="mt-6 flex gap-3 justify-center">
                                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

// Coupon Modal Component
interface CouponModalProps {
    coupon: Coupon | null;
    onClose: () => void;
    onSave: (data: Partial<Coupon>) => void;
}

function CouponModal({ coupon, onClose, onSave }: CouponModalProps) {
    const [form, setForm] = useState({
        code: coupon?.code || '',
        discountType: coupon?.discountType || 'percentage' as Coupon['discountType'],
        discountValue: coupon?.discountValue || 10,
        minOrderValue: coupon?.minOrderValue || 0,
        maxUsage: coupon?.maxUsage || 100,
        expiresAt: coupon?.expiresAt ? coupon.expiresAt.split('T')[0] : '',
        isActive: coupon?.isActive ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...form,
            code: form.code.toUpperCase(),
            expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <Card className="relative z-10 w-full max-w-lg mx-4">
                <CardContent className="p-0">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border p-4">
                        <h2 className="text-xl font-bold">
                            {coupon ? 'Edit Coupon' : 'Create Coupon'}
                        </h2>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <Label htmlFor="code">Coupon Code</Label>
                            <Input
                                id="code"
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                placeholder="e.g., SUMMER20"
                                required
                                className="uppercase font-mono"
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="discountType">Discount Type</Label>
                                <select
                                    id="discountType"
                                    value={form.discountType}
                                    onChange={(e) => setForm({ ...form, discountType: e.target.value as Coupon['discountType'] })}
                                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount ($)</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="discountValue">
                                    {form.discountType === 'percentage' ? 'Percentage' : 'Amount'}
                                </Label>
                                <Input
                                    id="discountValue"
                                    type="number"
                                    value={form.discountValue}
                                    onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                                    min={0}
                                    max={form.discountType === 'percentage' ? 100 : undefined}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="minOrderValue">Minimum Order ($)</Label>
                                <Input
                                    id="minOrderValue"
                                    type="number"
                                    value={form.minOrderValue}
                                    onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })}
                                    min={0}
                                />
                            </div>
                            <div>
                                <Label htmlFor="maxUsage">Usage Limit</Label>
                                <Input
                                    id="maxUsage"
                                    type="number"
                                    value={form.maxUsage}
                                    onChange={(e) => setForm({ ...form, maxUsage: Number(e.target.value) })}
                                    min={1}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="expiresAt">Expiry Date (optional)</Label>
                            <Input
                                id="expiresAt"
                                type="date"
                                value={form.expiresAt}
                                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={form.isActive}
                                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                className="h-4 w-4 accent-primary"
                            />
                            <Label htmlFor="isActive" className="font-normal">Coupon is active</Label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1">
                                {coupon ? 'Save Changes' : 'Create Coupon'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
