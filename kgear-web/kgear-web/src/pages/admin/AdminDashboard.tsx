import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOrderStore } from '@/store/useOrderStore';
import { useProductStore } from '@/store/useProductStore';
import { useCouponStore } from '@/store/useCouponStore';
import {
    DollarSign,
    ShoppingBag,
    Package,
    Tag,
    TrendingUp,
    ArrowUpRight,
    Clock,
    Truck,
    CheckCircle,
    AlertTriangle,
    Eye,
    Plus
} from 'lucide-react';

const statusConfig = {
    pending: { icon: Clock, label: 'Pending', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    processing: { icon: Package, label: 'Processing', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    shipped: { icon: Truck, label: 'Shipped', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    delivered: { icon: CheckCircle, label: 'Delivered', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export function AdminDashboard() {
    const { orders } = useOrderStore();
    const { products } = useProductStore();
    const { coupons } = useCouponStore();

    // Calculate real metrics
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const draftProducts = products.filter(p => p.status === 'draft').length;

    // Low stock calculation (stock < 10)
    const lowStockVariants = products.flatMap(p =>
        p.variants.filter(v => v.stock < 10).map(v => ({ product: p.name, variant: v.name, stock: v.stock }))
    );

    const activeCoupons = coupons.filter(c => c.isActive).length;
    const totalCouponUsage = coupons.reduce((sum, c) => sum + c.usageCount, 0);

    // Average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Recent orders (last 5)
    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const stats = [
        {
            title: 'Total Revenue',
            value: formatCurrency(totalRevenue),
            subtitle: `${totalOrders} orders`,
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
        },
        {
            title: 'Pending Orders',
            value: pendingOrders.toString(),
            subtitle: `${shippedOrders} shipped`,
            icon: ShoppingBag,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        },
        {
            title: 'Products',
            value: activeProducts.toString(),
            subtitle: `${draftProducts} drafts`,
            icon: Package,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100 dark:bg-purple-900/30',
        },
        {
            title: 'Avg Order Value',
            value: formatCurrency(avgOrderValue),
            subtitle: `${activeCoupons} active coupons`,
            icon: TrendingUp,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back! Here's your store overview.</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/admin/products">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Product
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="border-border/50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${stat.bgColor}`}>
                                        <Icon className={`h-5 w-5 ${stat.color}`} aria-hidden="true" />
                                    </div>
                                </div>
                                <p className="mt-2 text-3xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                    {stat.value}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">{stat.subtitle}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Middle Row - Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Order Status Breakdown */}
                <Card className="border-border/50">
                    <CardContent className="p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Order Status</h3>
                        <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                    <span className="text-sm">Pending</span>
                                </div>
                                <span className="font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                    {orders.filter(o => o.status === 'pending').length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    <span className="text-sm">Processing</span>
                                </div>
                                <span className="font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                    {orders.filter(o => o.status === 'processing').length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                                    <span className="text-sm">Shipped</span>
                                </div>
                                <span className="font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>{shippedOrders}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <span className="text-sm">Delivered</span>
                                </div>
                                <span className="font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>{deliveredOrders}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Product Stats */}
                <Card className="border-border/50">
                    <CardContent className="p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Inventory</h3>
                        <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Total Products</span>
                                <span className="font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>{totalProducts}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Active</span>
                                <span className="font-medium text-green-600" style={{ fontVariantNumeric: 'tabular-nums' }}>{activeProducts}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Draft</span>
                                <span className="font-medium text-yellow-600" style={{ fontVariantNumeric: 'tabular-nums' }}>{draftProducts}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Low Stock Items</span>
                                <span className={`font-medium ${lowStockVariants.length > 0 ? 'text-orange-600' : ''}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                                    {lowStockVariants.length}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Coupon Stats */}
                <Card className="border-border/50">
                    <CardContent className="p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Promotions</h3>
                        <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Total Coupons</span>
                                <span className="font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>{coupons.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Active</span>
                                <span className="font-medium text-green-600" style={{ fontVariantNumeric: 'tabular-nums' }}>{activeCoupons}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Total Uses</span>
                                <span className="font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>{totalCouponUsage}</span>
                            </div>
                            <Link to="/admin/coupons" className="block">
                                <Button variant="outline" size="sm" className="w-full mt-2 gap-2">
                                    <Tag className="h-4 w-4" />
                                    Manage Coupons
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Recent Orders */}
                <Card className="lg:col-span-2 border-border/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Recent Orders</h2>
                            <Link to="/admin/orders">
                                <Button variant="ghost" size="sm" className="gap-1">
                                    View All
                                    <ArrowUpRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                        {recentOrders.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                <ShoppingBag className="mx-auto h-12 w-12 opacity-50" />
                                <p className="mt-2">No orders yet</p>
                                <p className="text-sm">Orders will appear here once customers make purchases.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="pb-3 text-left font-medium text-muted-foreground">Order</th>
                                            <th className="pb-3 text-left font-medium text-muted-foreground">Customer</th>
                                            <th className="pb-3 text-left font-medium text-muted-foreground">Date</th>
                                            <th className="pb-3 text-left font-medium text-muted-foreground">Total</th>
                                            <th className="pb-3 text-left font-medium text-muted-foreground">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} className="border-b border-border last:border-0">
                                                <td className="py-3 font-mono text-sm">{order.id}</td>
                                                <td className="py-3">
                                                    {order.shipping.firstName} {order.shipping.lastName}
                                                </td>
                                                <td className="py-3 text-muted-foreground">{formatDate(order.createdAt)}</td>
                                                <td className="py-3 font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                    {formatCurrency(order.total)}
                                                </td>
                                                <td className="py-3">
                                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusConfig[order.status].color}`}>
                                                        {statusConfig[order.status].label}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Low Stock Alert */}
                <Card className="border-border/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="h-5 w-5 text-orange-500" aria-hidden="true" />
                            <h2 className="text-lg font-semibold">Low Stock Alert</h2>
                        </div>
                        {lowStockVariants.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                <CheckCircle className="mx-auto h-12 w-12 text-green-500 opacity-50" />
                                <p className="mt-2 text-green-600">All stocked up!</p>
                                <p className="text-sm">No products are running low.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {lowStockVariants.slice(0, 5).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium truncate">{item.product}</p>
                                            <p className="text-xs text-muted-foreground">{item.variant}</p>
                                        </div>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${item.stock <= 3
                                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                }`}
                                            style={{ fontVariantNumeric: 'tabular-nums' }}
                                        >
                                            {item.stock} left
                                        </span>
                                    </div>
                                ))}
                                {lowStockVariants.length > 5 && (
                                    <p className="text-sm text-muted-foreground text-center">
                                        +{lowStockVariants.length - 5} more items
                                    </p>
                                )}
                                <Link to="/admin/products" className="block">
                                    <Button variant="outline" size="sm" className="w-full mt-2 gap-2">
                                        <Eye className="h-4 w-4" />
                                        View Products
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
