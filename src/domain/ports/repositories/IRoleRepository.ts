import type { Role } from "@domain/entities/Role.entity";
import type { Permission } from "@domain/value-objects/Permission.vo";

export interface CreateRolePayload {
    name: string;
    description?: string;
    permissions: string[];
}

export interface UpdateRolePayload {
    name?: string;
    description?: string;
    permissions?: string[];
}

export interface IRoleRepository {
    findAll(): Promise<Role[]>;
    findById(roleId: string): Promise<Role | null>;
    create(payload: CreateRolePayload): Promise<Role>;
    update(roleId: string, payload: UpdateRolePayload): Promise<Role>;
    delete(roleId: string): Promise<void>;
    findAllPermissions(): Promise<Permission[]>;
}
