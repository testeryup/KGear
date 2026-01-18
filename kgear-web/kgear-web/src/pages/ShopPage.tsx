import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/store/useCartStore';
import { productService } from '@/services/productService';
import type { ProductInfo } from '@/lib/api-types';
import { Filter, X, ChevronDown, Grid, List, SlidersHorizontal, Loader2 } from 'lucide-react';

// Fallback mock data when API is unavailable
const fallbackProducts = [
    { id: 1, name: 'Phantom 75 Wireless', brandName: 'KGear', thumbnailLink: '', description: 'Premium wireless keyboard' },
    { id: 2, name: 'Voyager 65 TKL', brandName: 'KGear', thumbnailLink: '', description: 'Compact 65% layout' },
    { id: 3, name: 'Stealth 60% Wired', brandName: 'KGear', thumbnailLink: '', description: 'Minimalist design' },
    { id: 4, name: 'Cherry MX Blue (90 pack)', brandName: 'Cherry', thumbnailLink: '', description: 'Tactile switches' },
    { id: 5, name: 'Gateron Yellow (70 pack)', brandName: 'Gateron', thumbnailLink: '', description: 'Linear switches' },
    { id: 6, name: 'GMK Laser Keycaps', brandName: 'GMK', thumbnailLink: '', description: 'Doubleshot ABS' },
];

const brandOptions = ['KGear', 'Cherry', 'Gateron', 'GMK'];

export function ShopPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { addItem } = useCartStore();

    // API state
    const [products, setProducts] = useState<ProductInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const selectedBrand = searchParams.get('brand') || '';

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await productService.getProducts({ pageSize: 12 });
                setProducts(response.items);
                setNextCursor(response.nextCursor);
                setHasMore(response.hasMore);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setError('Could not load products. Using sample data.');
                setProducts(fallbackProducts);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Load more products
    const loadMore = async () => {
        if (!hasMore || !nextCursor || isLoadingMore) return;
        setIsLoadingMore(true);
        try {
            const response = await productService.getProducts({ lastId: nextCursor, pageSize: 12 });
            setProducts((prev) => [...prev, ...response.items]);
            setNextCursor(response.nextCursor);
            setHasMore(response.hasMore);
        } catch (err) {
            console.error('Failed to load more products:', err);
        } finally {
            setIsLoadingMore(false);
        }
    };

    // Filter products client-side (for brand filter)
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            if (selectedBrand && product.brandName !== selectedBrand) return false;
            return true;
        });
    }, [products, selectedBrand]);

    const updateFilter = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchParams({});
    };

    const hasActiveFilters = selectedBrand;

    const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="border-b border-border pb-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground">
                {title}
                <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </h3>
            {children}
        </div>
    );

    const FilterSidebar = () => (
        <div className="space-y-4">
            <FilterSection title="Brand">
                <div className="space-y-2">
                    {brandOptions.map((brand) => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="brand"
                                checked={selectedBrand === brand}
                                onChange={() => updateFilter('brand', selectedBrand === brand ? '' : brand)}
                                className="h-4 w-4 accent-primary"
                            />
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                {brand}
                            </span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                    Clear All Filters
                </Button>
            )}
        </div>
    );

    return (
        <div className="bg-background">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
                        Shop All <span className="text-primary">Products</span>
                    </h1>
                    <p className="mt-2 text-neutral-400">
                        Premium mechanical keyboards, switches, keycaps, and accessories
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {error && (
                    <div className="mb-4 rounded-lg bg-yellow-100 p-3 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                        {error}
                    </div>
                )}

                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden w-56 shrink-0 lg:block">
                        <div className="sticky top-24">
                            <div className="mb-4 flex items-center gap-2">
                                <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden="true" />
                                <span className="text-sm font-semibold uppercase tracking-wide">Filters</span>
                            </div>
                            <FilterSidebar />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                {/* Mobile filter button */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsMobileFilterOpen(true)}
                                    className="lg:hidden"
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filters
                                    {hasActiveFilters && (
                                        <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                            !
                                        </span>
                                    )}
                                </Button>

                                {/* Results count */}
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">{filteredProducts.length}</span> products
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Active Filters Pills */}
                                {hasActiveFilters && (
                                    <div className="hidden md:flex items-center gap-2">
                                        {selectedBrand && (
                                            <span className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                                                {selectedBrand}
                                                <button onClick={() => updateFilter('brand', '')} aria-label="Remove filter">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* View Toggle */}
                                <div className="flex items-center rounded-lg border border-border p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`rounded p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                        aria-label="Grid view"
                                        aria-pressed={viewMode === 'grid'}
                                    >
                                        <Grid className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`rounded p-1.5 transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                        aria-label="List view"
                                        aria-pressed={viewMode === 'list'}
                                    >
                                        <List className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="mt-4 text-muted-foreground">Loading products...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
                                <p className="text-lg font-medium">No products found</p>
                                <p className="mt-2 text-muted-foreground">Try adjusting your filters</p>
                                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                                {filteredProducts.map((product) => (
                                    <Card
                                        key={product.id}
                                        className="group overflow-hidden border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                                    >
                                        <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-50 relative overflow-hidden">
                                            {product.thumbnailLink ? (
                                                <img
                                                    src={product.thumbnailLink}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-5xl opacity-20 transition-transform duration-300 group-hover:scale-110">⌨️</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        addItem({
                                                            id: product.id.toString(),
                                                            name: product.name,
                                                            price: 199, // Default price when not available
                                                            image: product.thumbnailLink || '/placeholder.jpg',
                                                        })
                                                    }
                                                >
                                                    Add to Cart
                                                </Button>
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <p className="text-xs font-medium uppercase tracking-wider text-primary">
                                                {product.brandName}
                                            </p>
                                            <Link to={`/product/${product.id}`}>
                                                <h3 className="mt-1 font-semibold leading-tight hover:text-primary transition-colors line-clamp-1">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                                                {product.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredProducts.map((product) => (
                                    <Card key={product.id} className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
                                        <div className="flex">
                                            <div className="h-28 w-28 shrink-0 bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center">
                                                {product.thumbnailLink ? (
                                                    <img src={product.thumbnailLink} alt={product.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-4xl opacity-20">⌨️</span>
                                                )}
                                            </div>
                                            <CardContent className="flex flex-1 items-center justify-between p-4">
                                                <div>
                                                    <p className="text-xs font-medium uppercase tracking-wider text-primary">
                                                        {product.brandName}
                                                    </p>
                                                    <Link to={`/product/${product.id}`}>
                                                        <h3 className="font-semibold hover:text-primary transition-colors">
                                                            {product.name}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            addItem({
                                                                id: product.id.toString(),
                                                                name: product.name,
                                                                price: 199,
                                                                image: product.thumbnailLink || '/placeholder.jpg',
                                                            })
                                                        }
                                                    >
                                                        Add to Cart
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Load More Button */}
                        {hasMore && !isLoading && (
                            <div className="mt-8 text-center">
                                <Button variant="outline" onClick={loadMore} disabled={isLoadingMore} className="gap-2">
                                    {isLoadingMore ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        'Load More Products'
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setIsMobileFilterOpen(false)} />
                    <div
                        className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-auto rounded-t-2xl bg-background p-6"
                        style={{ overscrollBehavior: 'contain' }}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold">Filters</h2>
                            <button onClick={() => setIsMobileFilterOpen(false)} aria-label="Close filters">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <FilterSidebar />
                        <Button className="mt-6 w-full" onClick={() => setIsMobileFilterOpen(false)}>
                            Show {filteredProducts.length} Results
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
