import type {
    IRoleRepository,
    CreateRolePayload,
    UpdateRolePayload,
} from "@domain/ports/repositories/IRoleRepository";
import type { Role } from "@domain/entities/Role.entity";
import type { Permission } from "@domain/value-objects/Permission.vo";
import { apiClient } from "../api/client/apiClient";
import { ROLE_ENDPOINTS } from "@infrastructure/api/endpoints/auth.endpoints";
import type { RoleDTO, PermissionDTO } from "@infrastructure/api/dto/AuthDTO";
import { authMapper } from "@infrastructure/mappers/authMapper";
import { RoleNotFoundError } from "@domain/errors/DomainError";

export class RoleRepository implements IRoleRepository {
    async findAll(): Promise<Role[]> {
        const response = await apiClient.get<RoleDTO[]>(ROLE_ENDPOINTS.list);

        if (!response.success || !response.data) {
            throw new Error(
                response.error?.message || "Erreur de récupération des rôles"
            );
        }

        return response.data.map((dto: RoleDTO) => authMapper.roleToDomain(dto));
    }

    async findById(roleId: string): Promise<Role | null> {
        try {
            const response = await apiClient.get<RoleDTO>(
                ROLE_ENDPOINTS.byId(roleId)
            );

            if (!response.success || !response.data) {
                return null;
            }

            return authMapper.roleToDomain(response.data);
        } catch {
            return null;
        }
    }

    async create(payload: CreateRolePayload): Promise<Role> {
        const response = await apiClient.post<RoleDTO>(
            ROLE_ENDPOINTS.create,
            payload
        );

        if (!response.success || !response.data) {
            throw new Error(
                response.error?.message || "Erreur de création du rôle"
            );
        }

        return authMapper.roleToDomain(response.data);
    }

    async update(roleId: string, payload: UpdateRolePayload): Promise<Role> {
        const response = await apiClient.patch<RoleDTO>(
            ROLE_ENDPOINTS.update(roleId),
            payload
        );

        if (!response.success || !response.data) {
            throw new Error(
                response.error?.message || "Erreur de mise à jour du rôle"
            );
        }

        return authMapper.roleToDomain(response.data);
    }

    async delete(roleId: string): Promise<void> {
        const response = await apiClient.delete(ROLE_ENDPOINTS.delete(roleId));

        if (!response.success) {
            if (response.error?.code === 404) {
                throw new RoleNotFoundError(roleId);
            }
            throw new Error(
                response.error?.message || "Erreur de suppression du rôle"
            );
        }
    }

    async findAllPermissions(): Promise<Permission[]> {
        const response = await apiClient.get<PermissionDTO[]>(
            ROLE_ENDPOINTS.permissions
        );

        if (!response.success || !response.data) {
            throw new Error(
                response.error?.message || "Erreur de récupération des permissions"
            );
        }

        return response.data.map((dto: PermissionDTO) => authMapper.permissionToDomain(dto));
    }
}

export const roleRepository = new RoleRepository();
