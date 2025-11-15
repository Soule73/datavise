import { User } from "@domain/entities/User.entity";
import { Role } from "@domain/entities/Role.entity";
import { createPermission } from "@domain/value-objects/Permission.vo";
import type {
    UserDTO,
    RoleDTO,
    PermissionDTO,
    LoginResponseDTO,
} from "@infrastructure/api/dto/AuthDTO";
import type { LoginResult } from "@domain/ports/repositories/IAuthRepository";

export const authMapper = {
    permissionToDomain(dto: PermissionDTO) {
        return createPermission(dto._id, dto.name, dto.description);
    },

    roleToDomain(dto: RoleDTO): Role {
        const permissions = dto.permissions.map((p) =>
            this.permissionToDomain(p)
        );
        return new Role(
            dto._id,
            dto.name,
            permissions,
            dto.canDelete ?? true,
            dto.description
        );
    },

    userToDomain(dto: UserDTO): User {
        const role = dto.role ? this.roleToDomain(dto.role) : undefined;
        return new User(
            dto._id,
            dto.email,
            dto.username,
            role,
            dto.createdAt ? new Date(dto.createdAt) : undefined,
            dto.updatedAt ? new Date(dto.updatedAt) : undefined
        );
    },

    loginResponseToDomain(dto: LoginResponseDTO): LoginResult {
        return {
            user: this.userToDomain(dto.user),
            token: dto.token,
        };
    },
};
