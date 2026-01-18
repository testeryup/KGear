import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProductImage {
    id: string;
    url: string;
    alt: string;
}

export interface ProductVariant {
    id: string;
    name: string;
    sku: string;
    price: number;
    compareAtPrice?: number;
    stock: number;
    images: ProductImage[];
}

export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    brand: string;
    status: 'active' | 'draft' | 'archived';
    variants: ProductVariant[];
    createdAt: string;
    updatedAt: string;
}

interface ProductState {
    products: Product[];
    getProduct: (id: string) => Product | undefined;
    addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    addVariant: (productId: string, variant: Omit<ProductVariant, 'id'>) => void;
    updateVariant: (productId: string, variantId: string, updates: Partial<ProductVariant>) => void;
    deleteVariant: (productId: string, variantId: string) => void;
}

const generateId = () => `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;

// Sample data
const initialProducts: Product[] = [
    {
        id: '1',
        name: 'Phantom 75 Wireless',
        description: 'Premium wireless mechanical keyboard with 75% layout',
        category: 'keyboards',
        brand: 'KGear',
        status: 'active',
        variants: [
            { id: '1-black', name: 'Black', sku: 'PH75-BLK', price: 299, stock: 45, images: [] },
            { id: '1-white', name: 'White', sku: 'PH75-WHT', price: 299, stock: 32, images: [] },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Voyager 65 TKL',
        description: 'Compact 65% gasket-mount keyboard',
        category: 'keyboards',
        brand: 'KGear',
        status: 'active',
        variants: [
            { id: '2-clear', name: 'Clear', sku: 'VY65-CLR', price: 249, stock: 28, images: [] },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const useProductStore = create<ProductState>()(
    persist(
        (set, get) => ({
            products: initialProducts,

            getProduct: (id) => get().products.find((p) => p.id === id),

            addProduct: (productData) => {
                const newProduct: Product = {
                    ...productData,
                    id: generateId(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                set((state) => ({
                    products: [...state.products, newProduct],
                }));
                return newProduct;
            },

            updateProduct: (id, updates) => {
                set((state) => ({
                    products: state.products.map((p) =>
                        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
                    ),
                }));
            },

            deleteProduct: (id) => {
                set((state) => ({
                    products: state.products.filter((p) => p.id !== id),
                }));
            },

            addVariant: (productId, variantData) => {
                const newVariant: ProductVariant = {
                    ...variantData,
                    id: generateId(),
                };
                set((state) => ({
                    products: state.products.map((p) =>
                        p.id === productId
                            ? { ...p, variants: [...p.variants, newVariant], updatedAt: new Date().toISOString() }
                            : p
                    ),
                }));
            },

            updateVariant: (productId, variantId, updates) => {
                set((state) => ({
                    products: state.products.map((p) =>
                        p.id === productId
                            ? {
                                ...p,
                                variants: p.variants.map((v) => (v.id === variantId ? { ...v, ...updates } : v)),
                                updatedAt: new Date().toISOString(),
                            }
                            : p
                    ),
                }));
            },

            deleteVariant: (productId, variantId) => {
                set((state) => ({
                    products: state.products.map((p) =>
                        p.id === productId
                            ? {
                                ...p,
                                variants: p.variants.filter((v) => v.id !== variantId),
                                updatedAt: new Date().toISOString(),
                            }
                            : p
                    ),
                }));
            },
        }),
        {
            name: 'kgear-product-storage',
        }
    )
);
