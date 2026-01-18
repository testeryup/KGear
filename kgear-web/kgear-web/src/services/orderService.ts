import api from '@/lib/api';
import type {
    PlaceOrderRequest,
    PlaceOrderResponse,
    OrderDetailResponse,
} from '@/lib/api-types';

export const orderService = {
    async placeOrder(request: PlaceOrderRequest): Promise<PlaceOrderResponse> {
        const response = await api.post<PlaceOrderResponse>('/api/Order/order', request);
        return response.data;
    },

    async getOrderDetail(orderId: number): Promise<OrderDetailResponse | null> {
        try {
            const response = await api.get<OrderDetailResponse>(`/api/Order/${orderId}`);
            return response.data;
        } catch {
            return null;
        }
    },
};
