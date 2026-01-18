import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import { Keyboard, Loader2, AlertCircle } from 'lucide-react';

type AuthMode = 'login' | 'register';

export function LoginPage() {
    const navigate = useNavigate();
    const { login, register, isLoading, error, clearError, demoLoginAsBuyer, demoLoginAsAdmin } = useAuthStore();

    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        let success = false;
        if (mode === 'login') {
            success = await login({ email, password });
        } else {
            success = await register({ name, email, password });
            if (success) {
                success = await login({ email, password });
            }
        }

        if (success) {
            navigate('/');
        }
    };

    const handleDemoLogin = (type: 'buyer' | 'admin') => {
        if (type === 'buyer') {
            demoLoginAsBuyer();
        } else {
            demoLoginAsAdmin();
        }
        navigate('/');
    };

    return (
        <div className="bg-background min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 py-12">
                <div className="container mx-auto px-4 text-center">
                    <Link to="/" className="inline-flex items-center gap-2 text-white mb-4">
                        <Keyboard className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-black tracking-tight">KGear</span>
                    </Link>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
                        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="mt-2 text-neutral-400">
                        {mode === 'login' ? 'Sign in to your account' : 'Join the KGear community'}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="mx-auto max-w-md">
                    <Card className="border-border/50">
                        <CardContent className="p-6">
                            {error && (
                                <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {mode === 'register' && (
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            autoComplete="name"
                                        />
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                        minLength={6}
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                                        </>
                                    ) : (
                                        mode === 'login' ? 'Sign In' : 'Create Account'
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 text-center text-sm text-muted-foreground">
                                {mode === 'login' ? (
                                    <>
                                        Don't have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={() => { setMode('register'); clearError(); }}
                                            className="text-primary hover:underline"
                                        >
                                            Sign up
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={() => { setMode('login'); clearError(); }}
                                            className="text-primary hover:underline"
                                        >
                                            Sign in
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Demo Login Section */}
                            <div className="mt-6 border-t border-border pt-6">
                                <p className="text-center text-sm text-muted-foreground mb-4">
                                    Or try a demo account
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => handleDemoLogin('buyer')}
                                    >
                                        Demo Buyer
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => handleDemoLogin('admin')}
                                    >
                                        Demo Admin
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        <Link to="/" className="hover:text-primary">
                            ← Back to store
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
