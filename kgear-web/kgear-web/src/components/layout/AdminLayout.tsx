import { Link, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Settings,
    Keyboard,
    ChevronLeft,
    Menu,
    Tag
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const adminNavItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/admin/coupons', icon: Tag, label: 'Coupons' },
    { to: '/admin/customers', icon: Users, label: 'Customers' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function AdminLayout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const location = useLocation();

    const isActive = (path: string, end?: boolean) => {
        if (end) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex min-h-screen bg-muted/30">
            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar transition-all duration-300',
                    isSidebarCollapsed ? 'w-16' : 'w-64'
                )}
            >
                {/* Header */}
                <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
                    {!isSidebarCollapsed && (
                        <Link to="/" className="flex items-center gap-2 font-bold text-sidebar-foreground">
                            <Keyboard className="h-6 w-6" aria-hidden="true" />
                            <span>KGear Admin</span>
                        </Link>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="text-sidebar-foreground hover:bg-sidebar-accent"
                        aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isSidebarCollapsed ? (
                            <Menu className="h-5 w-5" />
                        ) : (
                            <ChevronLeft className="h-5 w-5" />
                        )}
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="space-y-1 p-2">
                    {adminNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.to, item.end);
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    active
                                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                                    isSidebarCollapsed && 'justify-center px-2'
                                )}
                                title={isSidebarCollapsed ? item.label : undefined}
                            >
                                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                                {!isSidebarCollapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Back to Store */}
                <div className="absolute bottom-4 left-0 right-0 px-2">
                    <Link to="/">
                        <Button
                            variant="outline"
                            className={cn(
                                'w-full justify-start gap-2 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent',
                                isSidebarCollapsed && 'justify-center px-2'
                            )}
                        >
                            <Keyboard className="h-4 w-4" aria-hidden="true" />
                            {!isSidebarCollapsed && <span>Back to Store</span>}
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={cn(
                    'flex-1 transition-all duration-300',
                    isSidebarCollapsed ? 'ml-16' : 'ml-64'
                )}
            >
                <div className="container mx-auto p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
