import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/store/useCartStore';
import { Minus, Plus, ShoppingCart, Heart, Share2, Check, ChevronRight, Star } from 'lucide-react';

// Mock product data with variants
const mockProducts: Record<string, {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    brand: string;
    specs: { label: string; value: string }[];
    inStock: boolean;
    rating: number;
    reviews: number;
    variants: { id: string; name: string; price: number; inStock: boolean }[];
}> = {
    '1': {
        id: '1',
        name: 'Phantom 75 Wireless',
        price: 299,
        description: 'The Phantom 75 is our flagship wireless mechanical keyboard featuring a compact 75% layout, hot-swappable switches, and seamless Bluetooth 5.0 connectivity. Built with a premium aluminum case and PBT keycaps for an unmatched typing experience.',
        category: 'Keyboards',
        brand: 'KGear',
        rating: 4.8,
        reviews: 127,
        specs: [
            { label: 'Layout', value: '75% (84 keys)' },
            { label: 'Connectivity', value: 'Bluetooth 5.0 / USB-C' },
            { label: 'Switches', value: 'Hot-swappable (3-pin/5-pin)' },
            { label: 'Battery', value: '4000mAh (up to 200 hours)' },
            { label: 'Keycaps', value: 'Double-shot PBT' },
            { label: 'Case', value: 'CNC Aluminum' },
        ],
        inStock: true,
        variants: [
            { id: '1-black', name: 'Black', price: 299, inStock: true },
            { id: '1-white', name: 'White', price: 299, inStock: true },
            { id: '1-navy', name: 'Navy Blue', price: 319, inStock: false },
        ],
    },
    '2': {
        id: '2',
        name: 'Voyager 65 TKL',
        price: 249,
        description: 'A tenkeyless masterpiece for those who demand precision and style. The Voyager 65 features gasket-mounted construction for a premium typing feel.',
        category: 'Keyboards',
        brand: 'KGear',
        rating: 4.6,
        reviews: 89,
        specs: [
            { label: 'Layout', value: '65% (68 keys)' },
            { label: 'Connectivity', value: 'USB-C' },
            { label: 'Switches', value: 'Hot-swappable (5-pin)' },
            { label: 'Mount', value: 'Gasket mount' },
            { label: 'Keycaps', value: 'PBT Dye-sub' },
            { label: 'Case', value: 'Polycarbonate' },
        ],
        inStock: true,
        variants: [
            { id: '2-clear', name: 'Clear', price: 249, inStock: true },
            { id: '2-smoke', name: 'Smoke', price: 249, inStock: true },
        ],
    },
};

const defaultProduct = {
    id: 'unknown',
    name: 'Product Not Found',
    price: 0,
    description: 'This product could not be found.',
    category: 'Unknown',
    brand: 'Unknown',
    rating: 0,
    reviews: 0,
    specs: [],
    inStock: false,
    variants: [],
};

export function ProductDetailsPage() {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
    const { addItem } = useCartStore();

    const product = id ? mockProducts[id] || defaultProduct : defaultProduct;
    const activeVariant = product.variants.find(v => v.id === selectedVariant) || product.variants[0];

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem({
                id: activeVariant?.id || product.id,
                name: `${product.name}${activeVariant ? ` - ${activeVariant.name}` : ''}`,
                price: activeVariant?.price || product.price,
                image: '/placeholder.jpg',
            });
        }
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    if (product.id === 'unknown') {
        return (
            <div className="bg-background">
                <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 py-12">
                    <div className="container mx-auto px-4">
                        <h1 className="text-3xl font-black uppercase tracking-tight text-white">
                            Product <span className="text-primary">Not Found</span>
                        </h1>
                    </div>
                </div>
                <div className="container mx-auto px-4 py-16 text-center">
                    <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
                    <Link to="/shop">
                        <Button className="mt-6">Back to Shop</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background">
            {/* Breadcrumb */}
            <div className="border-b border-border">
                <div className="container mx-auto px-4 py-3">
                    <nav aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                            <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
                            <li><ChevronRight className="h-4 w-4" /></li>
                            <li><Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link></li>
                            <li><ChevronRight className="h-4 w-4" /></li>
                            <li><Link to={`/shop?category=${product.category.toLowerCase()}`} className="hover:text-foreground transition-colors">{product.category}</Link></li>
                            <li><ChevronRight className="h-4 w-4" /></li>
                            <li className="text-foreground font-medium truncate max-w-[200px]" aria-current="page">{product.name}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Product Images */}
                    <div>
                        <div className="aspect-square rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center overflow-hidden">
                            <span className="text-[150px] opacity-20">⌨️</span>
                        </div>
                        {/* Thumbnails */}
                        <div className="mt-4 grid grid-cols-4 gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <button
                                    key={i}
                                    className={`aspect-square rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center border-2 transition-colors ${i === 1 ? 'border-primary' : 'border-transparent hover:border-border'}`}
                                    aria-label={`View image ${i}`}
                                >
                                    <span className="text-2xl opacity-20">⌨️</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary">{product.brand}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{product.category}</span>
                        </div>

                        <h1 className="mt-2 text-3xl font-bold md:text-4xl">{product.name}</h1>

                        {/* Rating */}
                        <div className="mt-3 flex items-center gap-2">
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-4 w-4 ${star <= Math.round(product.rating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-medium">{product.rating}</span>
                            <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="mt-4 flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                ${activeVariant?.price || product.price}
                            </span>
                            {(activeVariant?.inStock ?? product.inStock) ? (
                                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">In Stock</span>
                            ) : (
                                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">Out of Stock</span>
                            )}
                        </div>

                        <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

                        {/* Variants */}
                        {product.variants.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-semibold mb-3">Color / Variant</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariant(variant.id)}
                                            disabled={!variant.inStock}
                                            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${(selectedVariant || product.variants[0]?.id) === variant.id
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : variant.inStock
                                                        ? 'border-border hover:border-primary/50'
                                                        : 'border-border bg-muted text-muted-foreground cursor-not-allowed'
                                                }`}
                                        >
                                            {variant.name}
                                            {!variant.inStock && ' (Sold Out)'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Add to Cart */}
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <div className="flex items-center rounded-lg border border-border">
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="flex h-12 w-12 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-l-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="flex h-12 w-12 items-center justify-center text-lg font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="flex h-12 w-12 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-r-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            <Button
                                size="lg"
                                className="flex-1 gap-2 font-semibold"
                                onClick={handleAddToCart}
                                disabled={!(activeVariant?.inStock ?? product.inStock)}
                            >
                                {addedToCart ? (
                                    <>
                                        <Check className="h-5 w-5" aria-hidden="true" />
                                        Added to Cart!
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                                        Add to Cart
                                    </>
                                )}
                            </Button>

                            <Button variant="outline" size="icon" className="h-12 w-12" aria-label="Add to wishlist">
                                <Heart className="h-5 w-5" />
                            </Button>

                            <Button variant="outline" size="icon" className="h-12 w-12" aria-label="Share product">
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Specifications */}
                        <Card className="mt-8 border-border/50">
                            <CardContent className="p-6">
                                <h2 className="text-lg font-bold">Specifications</h2>
                                <dl className="mt-4 grid grid-cols-2 gap-4">
                                    {product.specs.map((spec) => (
                                        <div key={spec.label}>
                                            <dt className="text-sm text-muted-foreground">{spec.label}</dt>
                                            <dd className="font-medium">{spec.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
