import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/store/useCartStore';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight, Tag } from 'lucide-react';
import { useState } from 'react';

export function CartPage() {
    const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCartStore();
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

    const shipping = totalPrice >= 100 ? 0 : 9.99;
    const tax = totalPrice * 0.08;
    const discount = appliedCoupon ? totalPrice * 0.1 : 0;
    const finalTotal = totalPrice + shipping + tax - discount;

    const handleApplyCoupon = () => {
        if (couponCode.toLowerCase() === 'save10') {
            setAppliedCoupon(couponCode);
            setCouponCode('');
        }
    };

    if (items.length === 0) {
        return (
            <div className="bg-background">
                {/* Header */}
                <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 py-12">
                    <div className="container mx-auto px-4">
                        <h1 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
                            Shopping <span className="text-primary">Cart</span>
                        </h1>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-16">
                    <div className="mx-auto max-w-md text-center">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <h2 className="text-2xl font-bold">Your cart is empty</h2>
                        <p className="mt-2 text-muted-foreground">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <Link to="/shop">
                            <Button className="mt-6 gap-2">
                                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                                Continue Shopping
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
                        Shopping <span className="text-primary">Cart</span>
                    </h1>
                    <p className="mt-2 text-neutral-400">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <Card key={item.id} className="border-border/50">
                                <CardContent className="flex gap-4 p-4">
                                    {/* Image */}
                                    <div className="h-24 w-24 shrink-0 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center">
                                        <span className="text-3xl opacity-30">⌨️</span>
                                    </div>

                                    {/* Details */}
                                    <div className="flex flex-1 flex-col justify-between min-w-0">
                                        <div>
                                            <Link to={`/product/${item.id}`}>
                                                <h3 className="font-semibold hover:text-primary transition-colors truncate">
                                                    {item.name}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-muted-foreground">${item.price} each</p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center rounded-lg border border-border">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-l-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span
                                                    className="flex h-8 w-10 items-center justify-center text-sm font-medium"
                                                    style={{ fontVariantNumeric: 'tabular-nums' }}
                                                >
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-r-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="ml-auto flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-destructive transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="text-right shrink-0">
                                        <p className="text-lg font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Actions */}
                        <div className="flex justify-between pt-4">
                            <Link to="/shop">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Continue Shopping
                                </Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground hover:text-destructive">
                                Clear Cart
                            </Button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <Card className="sticky top-24 border-border/50">
                            <CardContent className="p-6">
                                <h2 className="text-lg font-bold">Order Summary</h2>

                                {/* Coupon Input */}
                                <div className="mt-4">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <input
                                                type="text"
                                                placeholder="Coupon code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                autoComplete="off"
                                                name="coupon"
                                            />
                                        </div>
                                        <Button variant="outline" size="sm" onClick={handleApplyCoupon} disabled={!couponCode}>
                                            Apply
                                        </Button>
                                    </div>
                                    {appliedCoupon && (
                                        <p className="mt-2 text-sm text-green-600">
                                            Coupon "{appliedCoupon}" applied! (-10%)
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-muted-foreground">Try "SAVE10" for 10% off</p>
                                </div>

                                <div className="mt-6 space-y-3 border-t border-border pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span style={{ fontVariantNumeric: 'tabular-nums' }}>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Discount (10%)</span>
                                            <span style={{ fontVariantNumeric: 'tabular-nums' }}>-${discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Shipping</span>
                                        {shipping === 0 ? (
                                            <span className="text-green-600">Free</span>
                                        ) : (
                                            <span style={{ fontVariantNumeric: 'tabular-nums' }}>${shipping.toFixed(2)}</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Tax (8%)</span>
                                        <span style={{ fontVariantNumeric: 'tabular-nums' }}>${tax.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mt-4 border-t border-border pt-4">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                                            ${finalTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <Link to="/checkout">
                                    <Button className="mt-6 w-full gap-2" size="lg">
                                        Proceed to Checkout
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>

                                {totalPrice < 100 && (
                                    <p className="mt-4 text-center text-xs text-muted-foreground">
                                        Add ${(100 - totalPrice).toFixed(2)} more for free shipping!
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
