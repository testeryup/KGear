import { Link } from 'react-router-dom';
import { Keyboard, Twitter, Github, Mail } from 'lucide-react';

const footerLinks = {
    shop: [
        { label: 'All Keyboards', to: '/shop?category=keyboards' },
        { label: 'Switches', to: '/shop?category=switches' },
        { label: 'Keycaps', to: '/shop?category=keycaps' },
        { label: 'Accessories', to: '/shop?category=accessories' },
    ],
    support: [
        { label: 'Contact Us', to: '/contact' },
        { label: 'FAQs', to: '/faq' },
        { label: 'Shipping', to: '/shipping' },
        { label: 'Returns', to: '/returns' },
    ],
    company: [
        { label: 'About', to: '/about' },
        { label: 'Blog', to: '/blog' },
        { label: 'Careers', to: '/careers' },
    ],
};

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border bg-muted/30">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
                            <Keyboard className="h-6 w-6" aria-hidden="true" />
                            <span>KGear</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Premium mechanical keyboards and accessories for enthusiasts and professionals.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                                aria-label="Follow us on Twitter"
                            >
                                <Twitter className="h-5 w-5" aria-hidden="true" />
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                                aria-label="View our GitHub"
                            >
                                <Github className="h-5 w-5" aria-hidden="true" />
                            </a>
                            <a
                                href="mailto:hello@kgear.com"
                                className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                                aria-label="Email us"
                            >
                                <Mail className="h-5 w-5" aria-hidden="true" />
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Shop</h3>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Support</h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
                    <p className="text-sm text-muted-foreground">
                        © {currentYear} KGear. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
