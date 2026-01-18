import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/store/useCartStore';
import { ArrowRight, Zap, Shield, Truck, Sparkles, ChevronRight } from 'lucide-react';

// Mock featured products
const featuredProducts = [
    { id: '1', name: 'Phantom 75 Wireless', price: 299, category: 'Keyboards' },
    { id: '2', name: 'Cherry MX Blue (90)', price: 45, category: 'Switches' },
    { id: '3', name: 'GMK Laser Keycaps', price: 129, category: 'Keycaps' },
    { id: '4', name: 'Custom Coiled Cable', price: 65, category: 'Accessories' },
];

const features = [
    { icon: Zap, title: 'Fast Shipping', description: 'Free delivery on orders over $100' },
    { icon: Shield, title: '2-Year Warranty', description: 'Full coverage on all products' },
    { icon: Truck, title: 'Easy Returns', description: '30-day hassle-free returns' },
    { icon: Sparkles, title: 'Premium Quality', description: 'Handpicked gear for enthusiasts' },
];

export function HomePage() {
    const { addItem } = useCartStore();

    return (
        <div className="flex flex-col">
            {/* Hero Section - Premium Design */}
            <section className="bg-background py-6 md:py-10">
                <div className="container mx-auto px-4">
                    <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
                        {/* Main Hero Card */}
                        <div className="relative lg:col-span-2 overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 min-h-[400px] md:min-h-[480px]">
                            {/* Background texture overlay */}
                            <div
                                className="absolute inset-0 opacity-30"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                                }}
                                aria-hidden="true"
                            />

                            {/* Content */}
                            <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-10">
                                {/* Badge */}
                                <div className="mb-4 flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" aria-hidden="true" />
                                        New Series Drop
                                    </span>
                                </div>

                                {/* Headline */}
                                <h1 className="max-w-xl">
                                    <span className="block text-4xl font-black uppercase tracking-tight text-white md:text-5xl lg:text-6xl">
                                        Precision
                                    </span>
                                    <span className="block text-4xl font-black uppercase tracking-tight text-primary md:text-5xl lg:text-6xl">
                                        Performance.
                                    </span>
                                </h1>

                                {/* Description */}
                                <p className="mt-4 max-w-md text-sm text-neutral-300 md:text-base">
                                    Experience the pinnacle of tactile engineering with our custom gasket-mount keyboards.
                                    Crafted for enthusiasts, by enthusiasts.
                                </p>

                                {/* CTA Buttons */}
                                <div className="mt-8 flex flex-wrap gap-3">
                                    <Link to="/shop">
                                        <Button size="lg" className="gap-2 rounded-lg font-semibold uppercase tracking-wide">
                                            Explore Series
                                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                        </Button>
                                    </Link>
                                    <Link to="/shop?category=keyboards">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="rounded-lg border-neutral-600 bg-transparent font-semibold uppercase tracking-wide text-white hover:bg-neutral-800 hover:text-white"
                                        >
                                            Custom Build
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Promo Cards */}
                        <div className="flex flex-col gap-4 lg:gap-6">
                            {/* Card 1: Artisan Keycap */}
                            <Card className="group relative flex-1 overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
                                <CardContent className="flex h-full flex-col p-5">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                        Limited Edition
                                    </span>
                                    <h3 className="mt-1 text-xl font-bold">
                                        Artisan Keycap<br />Vol. 4
                                    </h3>
                                    <Link
                                        to="/shop?category=keycaps"
                                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                                    >
                                        Shop Drop
                                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                                    </Link>
                                    {/* Decorative image placeholder */}
                                    <div className="mt-auto pt-4">
                                        <div className="h-24 w-full rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card 2: Switch Tester */}
                            <Card className="group relative overflow-hidden bg-primary text-primary-foreground border-0">
                                <CardContent className="flex items-center justify-between p-5">
                                    <div>
                                        <h3 className="text-lg font-bold uppercase tracking-tight">Switch Tester</h3>
                                        <p className="mt-1 text-sm text-primary-foreground/80">Find your perfect weight.</p>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                            <circle cx="12" cy="12" r="3" />
                                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                        </svg>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Hardware Section */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Featured Hardware</h2>
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            View Full Inventory
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                        {featuredProducts.map((product) => (
                            <Card
                                key={product.id}
                                className="group overflow-hidden border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                            >
                                <div className="aspect-[4/3] bg-gradient-to-br from-neutral-100 to-neutral-50 relative overflow-hidden">
                                    {/* Placeholder image with gradient */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-5xl opacity-20 transition-transform group-hover:scale-110">⌨️</span>
                                    </div>
                                    {/* Quick add overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                addItem({
                                                    id: product.id,
                                                    name: product.name,
                                                    price: product.price,
                                                    image: '/placeholder.jpg',
                                                })
                                            }
                                        >
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        {product.category}
                                    </p>
                                    <Link to={`/product/${product.id}`}>
                                        <h3 className="mt-1 font-semibold leading-tight hover:text-primary transition-colors line-clamp-1">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <p className="mt-2 text-lg font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                        ${product.price}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="border-y border-border bg-muted/30 py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div key={feature.title} className="flex flex-col items-center text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                                    </div>
                                    <h3 className="mt-4 font-semibold">{feature.title}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold" style={{ textWrap: 'balance' }}>
                            Join the KGear Community
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Get exclusive deals, early access to new products, and keyboard tips.
                        </p>
                        <form className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <input
                                type="email"
                                placeholder="Enter your email…"
                                className="h-12 rounded-lg border border-border bg-background px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:w-72"
                                autoComplete="email"
                                name="email"
                            />
                            <Button size="lg" className="font-semibold">
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
