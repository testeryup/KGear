import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useOrderStore, type Order } from '@/store/useOrderStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ChevronLeft, ChevronRight, Package, Clock, Truck, CheckCircle, XCircle, ShoppingBag, ArrowRight, Eye } from 'lucide-react';

const ORDERS_PER_PAGE = 5;

const statusConfig = {
    pending: { icon: Clock, label: 'Pending', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    processing: { icon: Package, label: 'Processing', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    shipped: { icon: Truck, label: 'Shipped', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    delivered: { icon: CheckCircle, label: 'Delivered', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    cancelled: { icon: XCircle, label: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export function MyOrdersPage() {
    const { orders } = useOrderStore();
    const { isAuthenticated } = useAuthStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const sortedOrders = [...orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const totalPages = Math.ceil(sortedOrders.length / ORDERS_PER_PAGE);
    const paginatedOrders = sortedOrders.slice(
        (currentPage - 1) * ORDERS_PER_PAGE,
        currentPage * ORDERS_PER_PAGE
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="bg-background">
                <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 py-12">
                    <div className="container mx-auto px-4">
                        <h1 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
                            My <span className="text-primary">Orders</span>
                        </h1>
                    </div>
                </div>
                <div className="container mx-auto px-4 py-16 text-center">
                    <p className="text-muted-foreground">Please log in to view your orders.</p>
                    <Link to="/login">
                        <Button className="mt-4">Log In</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (sortedOrders.length === 0) {
        return (
            <div className="bg-background">
                <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 py-12">
                    <div className="container mx-auto px-4">
                        <h1 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
                            My <span className="text-primary">Orders</span>
                        </h1>
                    </div>
                </div>
                <div className="container mx-auto px-4 py-16">
                    <div className="mx-auto max-w-md text-center">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold">No orders yet</h2>
                        <p className="mt-2 text-muted-foreground">
                            Once you make a purchase, your orders will appear here.
                        </p>
                        <Link to="/shop">
                            <Button className="mt-6 gap-2">
                                Start Shopping
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background">
            {/* Header */}
            <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
                        My <span className="text-primary">Orders</span>
                    </h1>
                    <p className="mt-2 text-neutral-400">
                        {sortedOrders.length} {sortedOrders.length === 1 ? 'order' : 'orders'}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="space-y-4">
                    {paginatedOrders.map((order) => {
                        const StatusIcon = statusConfig[order.status].icon;
                        const isExpanded = expandedOrder === order.id;

                        return (
                            <Card key={order.id} className="border-border/50 overflow-hidden">
                                <CardContent className="p-0">
                                    {/* Order Header */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4 bg-muted/30">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Order placed</p>
                                                <p className="font-medium">{formatDate(order.createdAt)}</p>
                                            </div>
                                            <div className="hidden sm:block">
                                                <p className="text-sm text-muted-foreground">Total</p>
                                                <p className="font-bold text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                    ${order.total.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${statusConfig[order.status].color}`}>
                                                <StatusIcon className="h-3.5 w-3.5" />
                                                {statusConfig[order.status].label}
                                            </span>
                                            <span className="font-mono text-sm text-muted-foreground">{order.id}</span>
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex -space-x-2">
                                                {order.items.slice(0, 3).map((item, i) => (
                                                    <div
                                                        key={item.id}
                                                        className="h-14 w-14 rounded-lg border-2 border-background bg-muted flex items-center justify-center shrink-0"
                                                        style={{ zIndex: 3 - i }}
                                                    >
                                                        <Package className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="h-14 w-14 rounded-lg border-2 border-background bg-muted flex items-center justify-center text-sm font-medium">
                                                        +{order.items.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">
                                                    {order.items.map((item) => item.name).join(', ')}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-1 shrink-0"
                                                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                            >
                                                <Eye className="h-4 w-4" />
                                                {isExpanded ? 'Hide' : 'Details'}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="border-t border-border p-4 bg-muted/20">
                                            <div className="grid gap-6 md:grid-cols-2">
                                                {/* Items */}
                                                <div>
                                                    <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Items</h4>
                                                    <div className="space-y-2">
                                                        {order.items.map((item) => (
                                                            <div key={item.id} className="flex items-center justify-between text-sm">
                                                                <span>
                                                                    {item.name} <span className="text-muted-foreground">× {item.quantity}</span>
                                                                </span>
                                                                <span className="font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                                    ${(item.price * item.quantity).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Shipping */}
                                                <div>
                                                    <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Shipping Address</h4>
                                                    <address className="not-italic text-sm text-muted-foreground leading-relaxed">
                                                        {order.shipping.firstName} {order.shipping.lastName}<br />
                                                        {order.shipping.address}<br />
                                                        {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
                                                    </address>
                                                </div>
                                            </div>

                                            {/* Order Summary */}
                                            <div className="mt-4 pt-4 border-t border-border">
                                                <div className="flex flex-wrap gap-4 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">Subtotal:</span>{' '}
                                                        <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                                                    </div>
                                                    {order.discount > 0 && (
                                                        <div className="text-green-600">
                                                            <span>Discount:</span> <span>-${order.discount.toFixed(2)}</span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="text-muted-foreground">Shipping:</span>{' '}
                                                        <span className="font-medium">{order.shippingCost === 0 ? 'Free' : `$${order.shippingCost.toFixed(2)}`}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Tax:</span>{' '}
                                                        <span className="font-medium">${order.tax.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
