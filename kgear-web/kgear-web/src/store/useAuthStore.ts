import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/authService';
import { setAccessToken } from '@/lib/api';
import type { LoginRequest, RegisterRequest } from '@/lib/api-types';

export type UserRole = 'guest' | 'buyer' | 'admin';

interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    error: string | null;
    login: (request: LoginRequest) => Promise<boolean>;
    register: (request: RegisterRequest) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
    // Demo functions for testing when backend is unavailable
    demoLoginAsBuyer: () => void;
    demoLoginAsAdmin: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
            error: null,

            login: async (request) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.login(request);
                    // Determine role based on email (backend should return this)
                    const isAdmin = response.email.includes('admin');
                    set({
                        user: {
                            id: response.email,
                            email: response.email,
                            name: response.email.split('@')[0],
                            role: isAdmin ? 'admin' : 'buyer',
                        },
                        isAuthenticated: true,
                        isAdmin,
                        isLoading: false,
                    });
                    return true;
                } catch (error: unknown) {
                    const message = error instanceof Error ? error.message : 'Login failed';
                    set({ error: message, isLoading: false });
                    return false;
                }
            },

            register: async (request) => {
                set({ isLoading: true, error: null });
                try {
                    await authService.register(request);
                    set({ isLoading: false });
                    return true;
                } catch (error: unknown) {
                    const message = error instanceof Error ? error.message : 'Registration failed';
                    set({ error: message, isLoading: false });
                    return false;
                }
            },

            logout: () => {
                authService.logout();
                setAccessToken(null);
                set({
                    user: null,
                    isAuthenticated: false,
                    isAdmin: false,
                });
            },

            clearError: () => set({ error: null }),

            // Demo functions for testing when backend is unavailable
            demoLoginAsBuyer: () =>
                set({
                    user: {
                        id: 'demo-buyer-1',
                        email: 'buyer@kgear.com',
                        name: 'Demo Buyer',
                        role: 'buyer',
                    },
                    isAuthenticated: true,
                    isAdmin: false,
                }),
            demoLoginAsAdmin: () =>
                set({
                    user: {
                        id: 'demo-admin-1',
                        email: 'admin@kgear.com',
                        name: 'Admin User',
                        role: 'admin',
                    },
                    isAuthenticated: true,
                    isAdmin: true,
                }),
        }),
        {
            name: 'kgear-auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                isAdmin: state.isAdmin,
            }),
        }
    )
);
