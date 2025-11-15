import type {
    IAuthRepository,
    LoginPayload,
    RegisterPayload,
    LoginResult,
} from "@domain/ports/repositories/IAuthRepository";
import { apiClient } from "../api/client/apiClient";
import { AUTH_ENDPOINTS } from "@infrastructure/api/endpoints/auth.endpoints";
import type { LoginResponseDTO } from "@infrastructure/api/dto/AuthDTO";

export class AuthRepository implements IAuthRepository {
    async login(payload: LoginPayload): Promise<LoginResult> {
        const response = await apiClient.post<LoginResponseDTO>(
            AUTH_ENDPOINTS.login,
            payload
        );

        if (!response.success || !response.data) {
            throw new Error(response.error?.message || "Erreur de connexion");
        }

        return response.data as unknown as LoginResult;
    }

    async register(payload: RegisterPayload): Promise<LoginResult> {
        const response = await apiClient.post<LoginResponseDTO>(
            AUTH_ENDPOINTS.register,
            payload
        );

        if (!response.success || !response.data) {
            throw new Error(response.error?.message || "Erreur d'inscription");
        }

        return response.data as unknown as LoginResult;
    }
}

export const authRepository = new AuthRepository();
