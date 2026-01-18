import api, { setAccessToken, getAccessToken } from '../lib/api';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../lib/api-types';

export const authService = {
    async login(request: LoginRequest): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/api/Auth/login', request);
        setAccessToken(response.data.accessToken);
        return response.data;
    },

    async register(request: RegisterRequest): Promise<RegisterResponse> {
        const response = await api.post<RegisterResponse>('/api/Auth/register', request);
        return response.data;
    },

    async refresh(): Promise<string | null> {
        const currentToken = getAccessToken();
        if (!currentToken) return null;

        try {
            const response = await api.post<{ accessToken: string }>('/api/Auth/refresh', currentToken);
            setAccessToken(response.data.accessToken);
            return response.data.accessToken;
        } catch {
            setAccessToken(null);
            return null;
        }
    },

    logout() {
        setAccessToken(null);
    },

    isAuthenticated(): boolean {
        return getAccessToken() !== null;
    },
};
