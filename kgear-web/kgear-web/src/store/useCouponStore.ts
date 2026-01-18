import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Coupon {
    id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderValue: number;
    maxUsage: number;
    usageCount: number;
    expiresAt: string | null;
    isActive: boolean;
    createdAt: string;
}

interface CouponState {
    coupons: Coupon[];
    getCoupon: (id: string) => Coupon | undefined;
    getCouponByCode: (code: string) => Coupon | undefined;
    validateCoupon: (code: string, orderTotal: number) => { valid: boolean; error?: string; coupon?: Coupon };
    addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount' | 'createdAt'>) => Coupon;
    updateCoupon: (id: string, updates: Partial<Coupon>) => void;
    deleteCoupon: (id: string) => void;
    incrementUsage: (id: string) => void;
}

const generateId = () => `CPO-${Date.now().toString(36).toUpperCase()}`;

// Sample coupons
const initialCoupons: Coupon[] = [
    {
        id: 'CPO-1',
        code: 'SAVE10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 0,
        maxUsage: 1000,
        usageCount: 47,
        expiresAt: null,
        isActive: true,
        createdAt: new Date().toISOString(),
    },
    {
        id: 'CPO-2',
        code: 'FLAT20',
        discountType: 'fixed',
        discountValue: 20,
        minOrderValue: 100,
        maxUsage: 500,
        usageCount: 23,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
    },
    {
        id: 'CPO-3',
        code: 'WELCOME15',
        discountType: 'percentage',
        discountValue: 15,
        minOrderValue: 50,
        maxUsage: 100,
        usageCount: 88,
        expiresAt: null,
        isActive: false,
        createdAt: new Date().toISOString(),
    },
];

export const useCouponStore = create<CouponState>()(
    persist(
        (set, get) => ({
            coupons: initialCoupons,

            getCoupon: (id) => get().coupons.find((c) => c.id === id),

            getCouponByCode: (code) =>
                get().coupons.find((c) => c.code.toLowerCase() === code.toLowerCase()),

            validateCoupon: (code, orderTotal) => {
                const coupon = get().getCouponByCode(code);

                if (!coupon) {
                    return { valid: false, error: 'Coupon not found' };
                }

                if (!coupon.isActive) {
                    return { valid: false, error: 'This coupon is no longer active' };
                }

                if (coupon.usageCount >= coupon.maxUsage) {
                    return { valid: false, error: 'This coupon has reached its usage limit' };
                }

                if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
                    return { valid: false, error: 'This coupon has expired' };
                }

                if (orderTotal < coupon.minOrderValue) {
                    return {
                        valid: false,
                        error: `Minimum order of $${coupon.minOrderValue} required`,
                    };
                }

                return { valid: true, coupon };
            },

            addCoupon: (couponData) => {
                const newCoupon: Coupon = {
                    ...couponData,
                    id: generateId(),
                    usageCount: 0,
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({
                    coupons: [...state.coupons, newCoupon],
                }));
                return newCoupon;
            },

            updateCoupon: (id, updates) => {
                set((state) => ({
                    coupons: state.coupons.map((c) => (c.id === id ? { ...c, ...updates } : c)),
                }));
            },

            deleteCoupon: (id) => {
                set((state) => ({
                    coupons: state.coupons.filter((c) => c.id !== id),
                }));
            },

            incrementUsage: (id) => {
                set((state) => ({
                    coupons: state.coupons.map((c) =>
                        c.id === id ? { ...c, usageCount: c.usageCount + 1 } : c
                    ),
                }));
            },
        }),
        {
            name: 'kgear-coupon-storage',
        }
    )
);
