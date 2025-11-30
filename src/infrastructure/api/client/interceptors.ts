import { type AxiosInstance, type AxiosError } from "axios";
import { useUserStore } from "@store/user";
import { ROUTES } from "@/core/constants/routes";

export function setupInterceptors(client: AxiosInstance): void {
    client.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("token");
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
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
