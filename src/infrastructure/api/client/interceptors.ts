import { type AxiosInstance, type AxiosError } from "axios";
import { useUserStore } from "@stores/user";
import { ROUTES } from "@/core/constants/routes";

const PUBLIC_ENDPOINTS = [
    '/v1/auth/login',
    '/v1/auth/register',
];

function isPublicEndpoint(url: string | undefined): boolean {
    if (!url) return false;
    return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
}

export function setupInterceptors(client: AxiosInstance): void {
    client.interceptors.request.use(
        (config) => {
            if (isPublicEndpoint(config.url)) {
                return config;
            }

            const store = useUserStore.getState();
            const token = store.token;
            const isExpired = store.isTokenExpired();

            if (token && !isExpired && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            } else if (token && isExpired) {
                store.logout();
                window.location.replace(ROUTES.login);
                return Promise.reject(new Error('Token expiré'));
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    client.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.error("Session expirée, déconnexion...");
                useUserStore.getState().logout();
                window.location.replace(ROUTES.login);
            }

            if (error.response?.status === 429) {
                console.error("Trop de requêtes, veuillez réessayer plus tard");
            }

            return Promise.reject(error);
        }
    );
}
