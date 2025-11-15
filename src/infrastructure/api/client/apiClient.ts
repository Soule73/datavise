import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { setupInterceptors } from "./interceptors";
import type { ApiResponse } from "../dto/ApiResponse.dto";

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: import.meta.env.VITE_API_URL || "",
            withCredentials: true,
            timeout: 30000,
            headers: {
                "Content-Type": "application/json",
            },
        });

        setupInterceptors(this.client);
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.get<ApiResponse<T>>(url, config);
        return response.data;
    }

    async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.post<ApiResponse<T>>(url, data, config);
        return response.data;
    }

    async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.patch<ApiResponse<T>>(url, data, config);
        return response.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.delete<ApiResponse<T>>(url, config);
        return response.data;
    }

    setAuthToken(token: string): void {
        this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    clearAuthToken(): void {
        delete this.client.defaults.headers.common["Authorization"];
    }

    getInstance(): AxiosInstance {
        return this.client;
    }
}

export const apiClient = new ApiClient();
