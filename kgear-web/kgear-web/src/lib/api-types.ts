// Backend API Types - aligned with KGear.API DTOs

// ============ Auth Types ============
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    email: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    address?: string;
}

export interface RegisterResponse {
    name: string;
    email: string;
    status: string;
}

// ============ Product Types ============
export interface ProductInfo {
    id: number;
    name: string;
    description?: string;
    brandName: string;
    thumbnailLink?: string;
}

export interface ProductVariant {
    id: number;
    sku: string;
    name: string;
    price: number;
    stock: number;
    productId: number;
    images?: { id: number; url: string }[];
}

export interface ProductDetail extends ProductInfo {
    variants: ProductVariant[];
}

export interface ProductCursorRequest {
    lastId?: number;
    pageSize?: number;
}

export interface ProductCursorResponse {
    status: boolean;
    items: ProductInfo[];
    nextCursor: number | null;
    hasMore: boolean;
}

// ============ Order Types ============
export interface OrderItem {
    variantId: number;
    quantity: number;
}

export interface PlaceOrderRequest {
    address: string;
    state: string;
    city: string;
    phone: string;
    zipCode: string;
    items: OrderItem[];
}

export interface PlaceOrderResponse {
    success: boolean;
    createdOn: string;
    message: string;
    orderId?: number;
}

export interface VariantInfo {
    variantId: number;
    unitPrice: number;
    quantity: number;
    thumbnail?: string;
    variantName?: string;
    productName?: string;
    productId: number;
}

export interface OrderDetailResponse {
    id: number;
    userId: number;
    createdOn: string;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';
    total: number;
    variants: VariantInfo[];
}

export interface OrderBrief {
    id: number;
    status: string;
    totalAmount: number;
    createdOn: string;
}
