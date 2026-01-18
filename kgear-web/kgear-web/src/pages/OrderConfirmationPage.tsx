import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useOrderStore } from '@/store/useOrderStore';
import { CheckCircle, Package, ArrowRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function OrderConfirmationPage() {
    const { orderId } = useParams();
    const { getOrderById } = useOrderStore();
    const [copied, setCopied] = useState(false);

    const order = orderId ? getOrderById(orderId) : undefined;

    const handleCopyOrderId = () => {
        if (order) {
            navigator.clipboard.writeText(order.id);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!order) {
        return (
            <div className="bg-background min-h-screen">
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold">Order not found</h1>
                    <p className="mt-2 text-muted-foreground">This order doesn't exist or has been removed.</p>
                    <Link to="/shop">
                        <Button className="mt-6">Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen">
            {/* Success Banner */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 py-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                        <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
                        Order Confirmed!
                    </h1>
                    <p className="mt-2 text-green-100">
                        Thank you for your order. We've sent a confirmation to {order.shipping.email}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="mx-auto max-w-3xl">
                    {/* Order ID */}
                    <Card className="border-border/50 mb-6">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Order Number</p>
                                <p className="text-xl font-bold font-mono">{order.id}</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleCopyOrderId} className="gap-2">
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Shipping Info */}
                        <Card className="border-border/50">
                            <CardContent className="p-6">
                                <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
                                <address className="not-italic text-muted-foreground leading-relaxed">
                                    {order.shipping.firstName} {order.shipping.lastName}<br />
                                    {order.shipping.address}<br />
                                    {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}<br />
                                    {order.shipping.country}
                                </address>
                            </CardContent>
                        </Card>

                        {/* Order Status */}
                        <Card className="border-border/50">
                            <CardContent className="p-6">
                                <h2 className="text-lg font-bold mb-4">Order Status</h2>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <Package className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium capitalize">{order.status}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Estimated delivery in 5-7 business days
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Items */}
                    <Card className="border-border/50 mt-6">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-bold mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                                        <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                            <span className="text-2xl opacity-30">⌨️</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="mt-6 pt-4 border-t border-border space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>${order.subtotal.toFixed(2)}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Discount</span>
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
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/my-orders">
                            <Button variant="outline" className="w-full sm:w-auto">
                                View All Orders
                            </Button>
                        </Link>
                        <Link to="/shop">
                            <Button className="w-full sm:w-auto gap-2">
                                Continue Shopping
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
