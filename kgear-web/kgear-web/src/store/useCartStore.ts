import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartState {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
}

const calculateTotals = (items: CartItem[]) => ({
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
});

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            totalItems: 0,
            totalPrice: 0,
            addItem: (newItem) => {
                const { items } = get();
                const existingItem = items.find((item) => item.id === newItem.id);

                if (existingItem) {
                    const updatedItems = items.map((item) =>
                        item.id === newItem.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                    set({ items: updatedItems, ...calculateTotals(updatedItems) });
                } else {
                    const updatedItems = [...items, { ...newItem, quantity: 1 }];
                    set({ items: updatedItems, ...calculateTotals(updatedItems) });
                }
            },
            removeItem: (id) => {
                const updatedItems = get().items.filter((item) => item.id !== id);
                set({ items: updatedItems, ...calculateTotals(updatedItems) });
            },
            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }
                const updatedItems = get().items.map((item) =>
                    item.id === id ? { ...item, quantity } : item
                );
                set({ items: updatedItems, ...calculateTotals(updatedItems) });
            },
            clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
        }),
        {
            name: 'kgear-cart-storage',
        }
    )
);
