import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProductStore, type Product, type ProductVariant } from '@/store/useProductStore';
import { Plus, Search, Edit, Trash2, X, Package, ImagePlus } from 'lucide-react';

export function ProductsManager() {
    const { products, addProduct, updateProduct, deleteProduct, addVariant, updateVariant, deleteVariant } = useProductStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenCreate = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        deleteProduct(id);
        setDeleteConfirm(null);
    };

    const getTotalStock = (product: Product) =>
        product.variants.reduce((sum, v) => sum + v.stock, 0);

    const getLowestPrice = (product: Product) =>
        product.variants.length > 0 ? Math.min(...product.variants.map((v) => v.price)) : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Products</h1>
                    <p className="text-muted-foreground">Manage your product inventory</p>
                </div>
                <Button className="gap-2" onClick={handleOpenCreate}>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add Product
                </Button>
            </div>

            {/* Search */}
            <Card className="border-border/50">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                        <Input
                            type="search"
                            placeholder="Search products…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                            autoComplete="off"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Products Table */}
            <Card className="border-border/50">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Product</th>
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Category</th>
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Price</th>
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Variants</th>
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Stock</th>
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Status</th>
                                    <th className="px-6 py-4 text-right font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                                            {searchQuery ? 'No products found' : 'No products yet. Add your first product!'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                                        <Package className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">{product.name}</span>
                                                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="capitalize text-muted-foreground">{product.category}</span>
                                            </td>
                                            <td className="px-6 py-4" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                ${getLowestPrice(product)}
                                                {product.variants.length > 1 && '+'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-muted-foreground">{product.variants.length}</span>
                                            </td>
                                            <td className="px-6 py-4" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                <span className={getTotalStock(product) < 10 ? 'text-orange-600 font-medium' : ''}>
                                                    {getTotalStock(product)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${product.status === 'active'
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            : product.status === 'draft'
                                                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                                : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                                                        }`}
                                                >
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => handleOpenEdit(product)}
                                                        aria-label={`Edit ${product.name}`}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                                        onClick={() => setDeleteConfirm(product.id)}
                                                        aria-label={`Delete ${product.name}`}
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

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {filteredProducts.length} of {products.length} products
                </p>
            </div>

            {/* Product Modal */}
            {isModalOpen && (
                <ProductModal
                    product={editingProduct}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(data) => {
                        if (editingProduct) {
                            updateProduct(editingProduct.id, data);
                        } else {
                            addProduct(data as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
                        }
                        setIsModalOpen(false);
                    }}
                    onAddVariant={(variant) => {
                        if (editingProduct) {
                            addVariant(editingProduct.id, variant);
                        }
                    }}
                    onUpdateVariant={(variantId, updates) => {
                        if (editingProduct) {
                            updateVariant(editingProduct.id, variantId, updates);
                        }
                    }}
                    onDeleteVariant={(variantId) => {
                        if (editingProduct) {
                            deleteVariant(editingProduct.id, variantId);
                        }
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
                            <h3 className="text-lg font-bold">Delete Product</h3>
                            <p className="mt-2 text-muted-foreground">
                                Are you sure you want to delete this product? This action cannot be undone.
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

// Product Modal Component
interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
    onSave: (data: Partial<Product>) => void;
    onAddVariant: (variant: Omit<ProductVariant, 'id'>) => void;
    onUpdateVariant: (variantId: string, updates: Partial<ProductVariant>) => void;
    onDeleteVariant: (variantId: string) => void;
}

function ProductModal({ product, onClose, onSave, onAddVariant, onUpdateVariant, onDeleteVariant }: ProductModalProps) {
    const [activeTab, setActiveTab] = useState<'basic' | 'variants'>('basic');
    const [form, setForm] = useState({
        name: product?.name || '',
        description: product?.description || '',
        category: product?.category || 'keyboards',
        brand: product?.brand || '',
        status: product?.status || 'draft' as Product['status'],
    });

    const [newVariant, setNewVariant] = useState({
        name: '',
        sku: '',
        price: 0,
        stock: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...form,
            variants: product?.variants || [],
        });
    };

    const handleAddVariant = () => {
        if (newVariant.name && newVariant.sku) {
            onAddVariant({ ...newVariant, images: [] });
            setNewVariant({ name: '', sku: '', price: 0, stock: 0 });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto py-8">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <Card className="relative z-10 w-full max-w-2xl mx-4">
                <CardContent className="p-0">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border p-4">
                        <h2 className="text-xl font-bold">
                            {product ? 'Edit Product' : 'Add Product'}
                        </h2>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-border">
                        <button
                            onClick={() => setActiveTab('basic')}
                            className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'basic'
                                    ? 'border-b-2 border-primary text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Basic Info
                        </button>
                        <button
                            onClick={() => setActiveTab('variants')}
                            className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'variants'
                                    ? 'border-b-2 border-primary text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                            disabled={!product}
                        >
                            Variants ({product?.variants.length || 0})
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {activeTab === 'basic' ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        id="name"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        rows={3}
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="category">Category</Label>
                                        <select
                                            id="category"
                                            value={form.category}
                                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                                            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        >
                                            <option value="keyboards">Keyboards</option>
                                            <option value="switches">Switches</option>
                                            <option value="keycaps">Keycaps</option>
                                            <option value="accessories">Accessories</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="brand">Brand</Label>
                                        <Input
                                            id="brand"
                                            value={form.brand}
                                            onChange={(e) => setForm({ ...form, brand: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value as Product['status'] })}
                                        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="active">Active</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1">
                                        {product ? 'Save Changes' : 'Create Product'}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                {/* Add Variant Form */}
                                <div className="rounded-lg border border-dashed border-border p-4">
                                    <h4 className="text-sm font-medium mb-3">Add New Variant</h4>
                                    <div className="grid gap-3 sm:grid-cols-4">
                                        <Input
                                            placeholder="Name (e.g., Black)"
                                            value={newVariant.name}
                                            onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                                        />
                                        <Input
                                            placeholder="SKU"
                                            value={newVariant.sku}
                                            onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Price"
                                            value={newVariant.price || ''}
                                            onChange={(e) => setNewVariant({ ...newVariant, price: Number(e.target.value) })}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Stock"
                                            value={newVariant.stock || ''}
                                            onChange={(e) => setNewVariant({ ...newVariant, stock: Number(e.target.value) })}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="mt-3 gap-2"
                                        onClick={handleAddVariant}
                                        disabled={!newVariant.name || !newVariant.sku}
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Variant
                                    </Button>
                                </div>

                                {/* Existing Variants */}
                                {product?.variants.map((variant) => (
                                    <div key={variant.id} className="rounded-lg border border-border p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 grid gap-3 sm:grid-cols-4">
                                                <div>
                                                    <Label className="text-xs text-muted-foreground">Name</Label>
                                                    <Input
                                                        value={variant.name}
                                                        onChange={(e) => onUpdateVariant(variant.id, { name: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-muted-foreground">SKU</Label>
                                                    <Input
                                                        value={variant.sku}
                                                        onChange={(e) => onUpdateVariant(variant.id, { sku: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-muted-foreground">Price</Label>
                                                    <Input
                                                        type="number"
                                                        value={variant.price}
                                                        onChange={(e) => onUpdateVariant(variant.id, { price: Number(e.target.value) })}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-muted-foreground">Stock</Label>
                                                    <Input
                                                        type="number"
                                                        value={variant.stock}
                                                        onChange={(e) => onUpdateVariant(variant.id, { stock: Number(e.target.value) })}
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="ml-2 text-destructive hover:text-destructive shrink-0"
                                                onClick={() => onDeleteVariant(variant.id)}
                                                aria-label="Delete variant"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        {/* Image placeholder */}
                                        <div className="mt-3 flex gap-2">
                                            <div className="h-16 w-16 rounded-lg border border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors">
                                                <ImagePlus className="h-5 w-5" />
                                            </div>
                                            {variant.images.map((img) => (
                                                <div key={img.id} className="h-16 w-16 rounded-lg bg-muted" />
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {product?.variants.length === 0 && (
                                    <p className="text-center text-muted-foreground py-8">
                                        No variants yet. Add your first variant above.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
