export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code?: number;
        details?: unknown;
    };
    message?: string;
    meta?: {
        pagination?: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        [key: string]: unknown;
    };
    links?: {
        self: string;
        first?: string;
        last?: string;
        next?: string;
        prev?: string;
    };
    timestamp?: string;
}
