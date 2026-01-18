import api from '@/lib/api';
import type {
    ProductCursorRequest,
    ProductCursorResponse,
    ProductDetail,
} from '@/lib/api-types';

export const productService = {
    async getProducts(params?: ProductCursorRequest): Promise<ProductCursorResponse> {
        const response = await api.get<ProductCursorResponse>('/Product', {
            params: {
                lastId: params?.lastId,
                pageSize: params?.pageSize ?? 10,
            },
        });
        return response.data;
    },

    async getProductById(productId: number): Promise<ProductDetail | null> {
        try {
            const response = await api.get<ProductDetail>(`/Product/${productId}`);
            return response.data;
        } catch {
            return null;
        }
    },

    async createProduct(formData: FormData): Promise<{ success: boolean }> {
        const response = await api.post<{ success: boolean }>('/Product/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    async updateProduct(productId: number, formData: FormData): Promise<{ success: boolean }> {
        const response = await api.put<{ success: boolean }>(`/Product/${productId}/info`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    async updateVariant(
        productId: number,
        variantId: number,
        formData: FormData
    ): Promise<{ success: boolean }> {
        const response = await api.put<{ success: boolean }>(
            `/Product/${productId}/variants/${variantId}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response.data;
    },

    async deleteProduct(productId: number): Promise<{ success: boolean }> {
        const response = await api.delete<{ success: boolean }>(`/Product/${productId}`);
        return response.data;
    },

    async deleteVariant(productId: number, variantId: number): Promise<{ success: boolean }> {
        const response = await api.delete<{ success: boolean }>(
            `/Product/${productId}/variants/${variantId}`
        );
        return response.data;
    },
};
