import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/shop', label: 'Shop', icon: '🛍️' },
    { to: '/admin', label: 'Admin', icon: '📊', adminOnly: true },
];

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { totalItems } = useCartStore();
    const { isAuthenticated, isAdmin, user, logout, demoLoginAsBuyer, demoLoginAsAdmin } = useAuthStore();
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
            <nav className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 shrink-0"
                >
                    {/* Logo Icon */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <rect x="2" y="6" width="20" height="12" rx="2" />
                            <line x1="6" y1="10" x2="6" y2="10.01" />
                            <line x1="10" y1="10" x2="10" y2="10.01" />
                            <line x1="14" y1="10" x2="14" y2="10.01" />
                            <line x1="18" y1="10" x2="18" y2="10.01" />
                            <line x1="8" y1="14" x2="16" y2="14" />
                        </svg>
                    </div>
                    <div className="hidden sm:block">
                        <span className="text-lg font-bold tracking-tight">KGear</span>
                        <span className="ml-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                            Luxury Hardware
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks
                        .filter(link => !link.adminOnly || isAdmin)
                        .map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={cn(
                                    'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive(link.to)
                                        ? 'text-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                {isActive(link.to) && (
                                    <span className="text-primary" aria-hidden="true">⌂</span>
                                )}
                                {link.label}
                            </Link>
                        ))}
                    {!isAuthenticated && (
                        <Link
                            to="/login"
                            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <User className="h-4 w-4" aria-hidden="true" />
                            Login
                        </Link>
                    )}
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-xs hidden lg:block">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                        <input
                            type="search"
                            placeholder="Search…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9 w-full rounded-lg border border-border bg-muted/50 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                            name="search"
                            autoComplete="off"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Cart */}
                    <Link
                        to="/cart"
                        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`Shopping cart with ${totalItems} items`}
                    >
                        <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                        {totalItems > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                {totalItems > 9 ? '9+' : totalItems}
                            </span>
                        )}
                    </Link>

                    {/* User Menu - Desktop */}
                    {isAuthenticated ? (
                        <div className="hidden md:flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{user?.name}</span>
                            <Button variant="ghost" size="sm" onClick={logout}>
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={demoLoginAsBuyer}>
                                Demo Buyer
                            </Button>
                            <Button size="sm" onClick={demoLoginAsAdmin}>
                                Demo Admin
                            </Button>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? (
                            <X className="h-5 w-5" aria-hidden="true" />
                        ) : (
                            <Menu className="h-5 w-5" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="border-t border-border md:hidden bg-background">
                    <div className="container mx-auto px-4 py-4 space-y-1">
                        {/* Mobile Search */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                            <input
                                type="search"
                                placeholder="Search…"
                                className="h-10 w-full rounded-lg border border-border bg-muted/50 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                name="mobile-search"
                                autoComplete="off"
                            />
                        </div>

                        {navLinks
                            .filter(link => !link.adminOnly || isAdmin)
                            .map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={cn(
                                        'flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                        isActive(link.to)
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}

                        <div className="pt-4 border-t border-border space-y-2">
                            {isAuthenticated ? (
                                <>
                                    <p className="px-3 text-sm text-muted-foreground">
                                        Signed in as <span className="font-medium text-foreground">{user?.name}</span>
                                    </p>
                                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logout}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="ghost" size="sm" className="w-full" onClick={demoLoginAsBuyer}>
                                        Demo Buyer
                                    </Button>
                                    <Button size="sm" className="w-full" onClick={demoLoginAsAdmin}>
                                        Demo Admin
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
