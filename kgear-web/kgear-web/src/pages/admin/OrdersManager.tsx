import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useOrderStore, type Order } from '@/store/useOrderStore';
import { Search, Eye, ChevronLeft, ChevronRight, Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';

const ORDERS_PER_PAGE = 10;

// Mock additional orders for demo
const mockOrders: Order[] = [
    {
        id: 'ORD-M1X7K8',
        items: [{ id: '1', name: 'Phantom 75 Wireless', price: 299, quantity: 1, image: '' }],
        shipping: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '555-0100',
            address: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94102',
            country: 'United States',
        },
        paymentMethod: 'card',
        status: 'delivered',
        subtotal: 299,
        discount: 0,
        shippingCost: 0,
        tax: 23.92,
        total: 322.92,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'ORD-K9P2L5',
        items: [
            { id: '2', name: 'Cherry MX Blue (90)', price: 45, quantity: 2, image: '' },
            { id: '3', name: 'GMK Laser Keycaps', price: 129, quantity: 1, image: '' },
        ],
        shipping: {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            phone: '555-0101',
            address: '456 Oak Ave',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90001',
            country: 'United States',
        },
        paymentMethod: 'paypal',
        status: 'shipped',
        subtotal: 219,
        discount: 21.90,
        shippingCost: 0,
        tax: 15.77,
        total: 212.87,
        couponCode: 'SAVE10',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'ORD-N3Q8R2',
        items: [{ id: '4', name: 'Custom Coiled Cable', price: 65, quantity: 1, image: '' }],
        shipping: {
            firstName: 'Bob',
            lastName: 'Wilson',
            email: 'bob@example.com',
            phone: '555-0102',
            address: '789 Pine Rd',
            city: 'Seattle',
            state: 'WA',
            zipCode: '98101',
            country: 'United States',
        },
        paymentMethod: 'card',
        status: 'processing',
        subtotal: 65,
        discount: 0,
        shippingCost: 9.99,
        tax: 5.20,
        total: 80.19,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

const statusConfig = {
    pending: { icon: Clock, label: 'Pending', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    processing: { icon: Package, label: 'Processing', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    shipped: { icon: Truck, label: 'Shipped', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    delivered: { icon: CheckCircle, label: 'Delivered', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    cancelled: { icon: XCircle, label: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export function OrdersManager() {
    const { orders: storeOrders } = useOrderStore();
    const allOrders = [...storeOrders, ...mockOrders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const filteredOrders = allOrders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            `${order.shipping.firstName} ${order.shipping.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.shipping.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ORDERS_PER_PAGE,
        currentPage * ORDERS_PER_PAGE
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Orders</h1>
                <p className="text-muted-foreground">Manage customer orders</p>
            </div>

            {/* Filters */}
            <Card className="border-border/50">
                <CardContent className="p-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search orders…"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-10"
                                autoComplete="off"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card className="border-border/50">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Order</th>
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Customer</th>
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Items</th>
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Total</th>
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Status</th>
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Date</th>
                                    <th className="px-6 py-4 text-right font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                                            {searchQuery || statusFilter !== 'all' ? 'No orders found' : 'No orders yet'}
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedOrders.map((order) => {
                                        const StatusIcon = statusConfig[order.status].icon;
                                        return (
                                            <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="font-mono font-medium">{order.id}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <span className="font-medium">{order.shipping.firstName} {order.shipping.lastName}</span>
                                                        <p className="text-xs text-muted-foreground">{order.shipping.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                                                </td>
                                                <td className="px-6 py-4 font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                    ${order.total.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig[order.status].color}`}>
                                                        <StatusIcon className="h-3 w-3" />
                                                        {statusConfig[order.status].label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                                    {formatDate(order.createdAt)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="gap-1"
                                                            onClick={() => setSelectedOrder(order)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            View
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {(currentPage - 1) * ORDERS_PER_PAGE + 1} to{' '}
                        {Math.min(currentPage * ORDERS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
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
                            className="h-8 w-8"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Order Detail Modal */}
            {selectedOrder && (
                <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
        </div>
    );
}

// Order Detail Modal
function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
    const StatusIcon = statusConfig[order.status].icon;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto py-8">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <Card className="relative z-10 w-full max-w-2xl mx-4">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold font-mono">{order.id}</h2>
                            <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${statusConfig[order.status].color}`}>
                            <StatusIcon className="h-4 w-4" />
                            {statusConfig[order.status].label}
                        </span>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Customer Info */}
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">Customer</h3>
                            <p className="font-medium">{order.shipping.firstName} {order.shipping.lastName}</p>
                            <p className="text-sm text-muted-foreground">{order.shipping.email}</p>
                            <p className="text-sm text-muted-foreground">{order.shipping.phone}</p>
                        </div>

                        {/* Shipping Address */}
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">Shipping</h3>
                            <address className="not-italic text-sm text-muted-foreground">
                                {order.shipping.address}<br />
                                {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}<br />
                                {order.shipping.country}
                            </address>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mt-6 pt-6 border-t border-border">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">Items</h3>
                        <div className="space-y-3">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
                                            <Package className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="mt-6 pt-6 border-t border-border space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span style={{ fontVariantNumeric: 'tabular-nums' }}>${order.subtotal.toFixed(2)}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                                <span style={{ fontVariantNumeric: 'tabular-nums' }}>-${order.discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Shipping</span>
                            {order.shippingCost === 0 ? (
                                <span className="text-green-600">Free</span>
                            ) : (
                                <span style={{ fontVariantNumeric: 'tabular-nums' }}>${order.shippingCost.toFixed(2)}</span>
                            )}
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax</span>
                            <span style={{ fontVariantNumeric: 'tabular-nums' }}>${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                            <span>Total</span>
                            <span className="text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                ${order.total.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            Close
                        </Button>
                        <Button className="flex-1">Update Status</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
