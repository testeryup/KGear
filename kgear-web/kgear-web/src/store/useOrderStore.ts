import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ShippingAddress {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface Order {
    id: string;
    items: OrderItem[];
    shipping: ShippingAddress;
    paymentMethod: 'card' | 'paypal';
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    subtotal: number;
    discount: number;
    shippingCost: number;
    tax: number;
    total: number;
    couponCode?: string;
    createdAt: string;
}

interface OrderState {
    orders: Order[];
    currentOrder: Partial<Order> | null;
    setShipping: (shipping: ShippingAddress) => void;
    setPaymentMethod: (method: 'card' | 'paypal') => void;
    setCoupon: (code: string, discount: number) => void;
    placeOrder: (items: OrderItem[], subtotal: number, shippingCost: number, tax: number) => Order;
    getOrderById: (id: string) => Order | undefined;
    getUserOrders: () => Order[];
}

const generateOrderId = () => `ORD-${Date.now().toString(36).toUpperCase()}`;

export const useOrderStore = create<OrderState>()(
    persist(
        (set, get) => ({
            orders: [],
            currentOrder: null,

            setShipping: (shipping) =>
                set((state) => ({
                    currentOrder: { ...state.currentOrder, shipping },
                })),

            setPaymentMethod: (paymentMethod) =>
                set((state) => ({
                    currentOrder: { ...state.currentOrder, paymentMethod },
                })),

            setCoupon: (couponCode, discount) =>
                set((state) => ({
                    currentOrder: { ...state.currentOrder, couponCode, discount },
                })),

            placeOrder: (items, subtotal, shippingCost, tax) => {
                const { currentOrder } = get();
                const discount = currentOrder?.discount || 0;
                const total = subtotal - discount + shippingCost + tax;

                const newOrder: Order = {
                    id: generateOrderId(),
                    items,
                    shipping: currentOrder?.shipping as ShippingAddress,
                    paymentMethod: currentOrder?.paymentMethod || 'card',
                    status: 'pending',
                    subtotal,
                    discount,
                    shippingCost,
                    tax,
                    total,
                    couponCode: currentOrder?.couponCode,
                    createdAt: new Date().toISOString(),
                };

                set((state) => ({
                    orders: [newOrder, ...state.orders],
                    currentOrder: null,
                }));

                return newOrder;
            },

            getOrderById: (id) => get().orders.find((order) => order.id === id),

            getUserOrders: () => get().orders,
        }),
        {
            name: 'kgear-order-storage',
        }
    )
);
