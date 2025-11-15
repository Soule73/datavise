import type {
    IUserRepository,
    CreateUserPayload,
    UpdateUserPayload,
} from "@domain/ports/repositories/IUserRepository";
import type { User } from "@domain/entities/User.entity";
import { USER_ENDPOINTS } from "@infrastructure/api/endpoints/auth.endpoints";
import type { UserDTO } from "@infrastructure/api/dto/AuthDTO";
import { UserNotFoundError } from "@domain/errors/DomainError";
import { apiClient } from "../api/client/apiClient";

export class UserRepository implements IUserRepository {
    async findAll(): Promise<User[]> {
        const response = await apiClient.get<UserDTO[]>(USER_ENDPOINTS.list);

        if (!response.success || !response.data) {
            throw new Error(
                response.error?.message || "Erreur de récupération des utilisateurs"
            );
        }

        return response.data as unknown as User[];
    }

    async findById(userId: string): Promise<User | null> {
        try {
            const response = await apiClient.get<UserDTO>(
                USER_ENDPOINTS.byId(userId)
            );

            if (!response.success || !response.data) {
                return null;
            }

            return response.data as unknown as User;
        } catch {
            return null;
        }
    }

    async create(payload: CreateUserPayload): Promise<User> {
        const response = await apiClient.post<UserDTO>(
            USER_ENDPOINTS.create,
            payload
        );

        if (!response.success || !response.data) {
            throw new Error(
                response.error?.message || "Erreur de création de l'utilisateur"
            );
        }

        return response.data as unknown as User;
    }

    async update(userId: string, payload: UpdateUserPayload): Promise<User> {
        const response = await apiClient.patch<UserDTO>(
            USER_ENDPOINTS.update(userId),
            payload
        );

        if (!response.success || !response.data) {
            throw new Error(
                response.error?.message || "Erreur de mise à jour de l'utilisateur"
            );
        }

        return response.data as unknown as User;
    }

    async delete(userId: string): Promise<void> {
        const response = await apiClient.delete(USER_ENDPOINTS.delete(userId));

        if (!response.success) {
            if (response.error?.code === 404) {
                throw new UserNotFoundError(userId);
            }
            throw new Error(
                response.error?.message || "Erreur de suppression de l'utilisateur"
            );
        }
    }
}

export const userRepository = new UserRepository();
