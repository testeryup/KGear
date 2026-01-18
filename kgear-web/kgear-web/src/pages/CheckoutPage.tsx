import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCartStore } from '@/store/useCartStore';
import { useOrderStore, type ShippingAddress } from '@/store/useOrderStore';
import { useAuthStore } from '@/store/useAuthStore';
import { orderService } from '@/services/orderService';
import { ArrowLeft, CreditCard, Lock, Check, Tag, AlertCircle } from 'lucide-react';

export function CheckoutPage() {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCartStore();
    const { setShipping, setPaymentMethod, setCoupon, placeOrder } = useOrderStore();
    const { isAuthenticated } = useAuthStore();

    const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [shippingForm, setShippingForm] = useState<ShippingAddress>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
    });

    const [paymentMethod, setPaymentMethodState] = useState<'card' | 'paypal'>('card');

    const shippingCost = totalPrice >= 100 ? 0 : 9.99;
    const discount = couponApplied ? totalPrice * 0.1 : 0;
    const tax = (totalPrice - discount) * 0.08;
    const finalTotal = totalPrice - discount + shippingCost + tax;

    const handleApplyCoupon = () => {
        if (couponCode.toLowerCase() === 'save10') {
            setCoupon(couponCode, totalPrice * 0.1);
            setCouponApplied(true);
        }
    };

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShipping(shippingForm);
        setStep('payment');
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        setError(null);
        setPaymentMethod(paymentMethod);

        try {
            // Try real API if authenticated
            if (isAuthenticated) {
                const apiResponse = await orderService.placeOrder({
                    address: shippingForm.address,
                    city: shippingForm.city,
                    state: shippingForm.state,
                    phone: shippingForm.phone,
                    zipCode: shippingForm.zipCode,
                    items: items.map(item => ({
                        variantId: parseInt(item.id) || 1,
                        quantity: item.quantity,
                    })),
                });

                if (apiResponse.success && apiResponse.orderId) {
                    clearCart();
                    navigate(`/order-confirmation/${apiResponse.orderId}`);
                    return;
                }
            }
        } catch (err) {
            console.log('API order failed, using local store:', err);
        }

        // Fallback to local order store
        const orderItems = items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
        }));

        const order = placeOrder(orderItems, totalPrice, shippingCost, tax);
        clearCart();
        navigate(`/order-confirmation/${order.id}`);
    };

    if (items.length === 0) {
        return (
            <div className="bg-background min-h-screen">
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold">Your cart is empty</h1>
                    <p className="mt-2 text-muted-foreground">Add some items before checking out.</p>
                    <Link to="/shop">
                        <Button className="mt-6">Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
                        Secure <span className="text-primary">Checkout</span>
                    </h1>
                    <div className="mt-4 flex items-center gap-4">
                        <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-primary' : 'text-neutral-400'}`}>
                            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${step === 'shipping' ? 'bg-primary text-white' : 'bg-neutral-600 text-neutral-300'}`}>1</span>
                            <span className="hidden sm:inline">Shipping</span>
                        </div>
                        <div className="h-px w-8 bg-neutral-600" />
                        <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-primary' : 'text-neutral-400'}`}>
                            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${step === 'payment' ? 'bg-primary text-white' : 'bg-neutral-600 text-neutral-300'}`}>2</span>
                            <span className="hidden sm:inline">Payment</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        {step === 'shipping' ? (
                            <Card className="border-border/50">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                                    <form onSubmit={handleShippingSubmit} className="space-y-4">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input
                                                    id="firstName"
                                                    value={shippingForm.firstName}
                                                    onChange={(e) => setShippingForm({ ...shippingForm, firstName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    value={shippingForm.lastName}
                                                    onChange={(e) => setShippingForm({ ...shippingForm, lastName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={shippingForm.email}
                                                    onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                                                    required
                                                    autoComplete="email"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="phone">Phone</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={shippingForm.phone}
                                                    onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                                                    required
                                                    autoComplete="tel"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="address">Address</Label>
                                            <Input
                                                id="address"
                                                value={shippingForm.address}
                                                onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                                                required
                                                autoComplete="street-address"
                                            />
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <div>
                                                <Label htmlFor="city">City</Label>
                                                <Input
                                                    id="city"
                                                    value={shippingForm.city}
                                                    onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="state">State</Label>
                                                <Input
                                                    id="state"
                                                    value={shippingForm.state}
                                                    onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="zipCode">ZIP Code</Label>
                                                <Input
                                                    id="zipCode"
                                                    value={shippingForm.zipCode}
                                                    onChange={(e) => setShippingForm({ ...shippingForm, zipCode: e.target.value })}
                                                    required
                                                    autoComplete="postal-code"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 flex gap-4">
                                            <Link to="/cart">
                                                <Button type="button" variant="outline" className="gap-2">
                                                    <ArrowLeft className="h-4 w-4" />
                                                    Back to Cart
                                                </Button>
                                            </Link>
                                            <Button type="submit" className="flex-1">
                                                Continue to Payment
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-border/50">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold mb-6">Payment Method</h2>

                                    <div className="space-y-4">
                                        <label className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                checked={paymentMethod === 'card'}
                                                onChange={() => setPaymentMethodState('card')}
                                                className="accent-primary"
                                            />
                                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">Credit / Debit Card</p>
                                                <p className="text-sm text-muted-foreground">Pay with Visa, Mastercard, or AMEX</p>
                                            </div>
                                        </label>

                                        <label className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                checked={paymentMethod === 'paypal'}
                                                onChange={() => setPaymentMethodState('paypal')}
                                                className="accent-primary"
                                            />
                                            <div className="h-5 w-5 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">P</div>
                                            <div>
                                                <p className="font-medium">PayPal</p>
                                                <p className="text-sm text-muted-foreground">Fast and secure payment</p>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-border">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Lock className="h-4 w-4" />
                                            <span>Your payment information is encrypted and secure</span>
                                        </div>
                                    </div>

                                    <div className="pt-6 flex gap-4">
                                        <Button variant="outline" onClick={() => setStep('shipping')} className="gap-2">
                                            <ArrowLeft className="h-4 w-4" />
                                            Back
                                        </Button>
                                        <Button
                                            className="flex-1 gap-2"
                                            onClick={handlePlaceOrder}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <>Processing…</>
                                            ) : (
                                                <>
                                                    <Lock className="h-4 w-4" />
                                                    Place Order · ${finalTotal.toFixed(2)}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div>
                        <Card className="sticky top-24 border-border/50">
                            <CardContent className="p-6">
                                <h2 className="text-lg font-bold">Order Summary</h2>

                                {/* Items */}
                                <div className="mt-4 space-y-3 max-h-48 overflow-auto">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                                <span className="text-xl opacity-30">⌨️</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Coupon */}
                                <div className="mt-4 pt-4 border-t border-border">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                placeholder="Coupon code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                className="pl-9"
                                                disabled={couponApplied}
                                            />
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleApplyCoupon}
                                            disabled={!couponCode || couponApplied}
                                        >
                                            {couponApplied ? <Check className="h-4 w-4" /> : 'Apply'}
                                        </Button>
                                    </div>
                                    {couponApplied && (
                                        <p className="mt-2 text-sm text-green-600">Coupon applied! -10%</p>
                                    )}
                                </div>

                                {/* Totals */}
                                <div className="mt-4 space-y-2 border-t border-border pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span style={{ fontVariantNumeric: 'tabular-nums' }}>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    {couponApplied && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Discount</span>
                                            <span style={{ fontVariantNumeric: 'tabular-nums' }}>-${discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Shipping</span>
                                        {shippingCost === 0 ? (
                                            <span className="text-green-600">Free</span>
                                        ) : (
                                            <span style={{ fontVariantNumeric: 'tabular-nums' }}>${shippingCost.toFixed(2)}</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Tax</span>
                                        <span style={{ fontVariantNumeric: 'tabular-nums' }}>${tax.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mt-4 border-t border-border pt-4">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                            ${finalTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
