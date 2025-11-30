import {
    RoleValidationError,
    RoleNotFoundError,
} from "../errors/DomainError";
import type { Permission } from "../value-objects/Permission.vo";

export class Role {
    readonly id: string;
    readonly name: string;
    readonly description?: string;
    readonly permissions: Permission[];
    readonly canDelete: boolean;

    constructor(
        id: string,
        name: string,
        permissions: Permission[],
        canDelete: boolean = true,
        description?: string
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.permissions = permissions;
        this.canDelete = canDelete;
        this.validate();
    }

    private validate(): void {
        if (!this.name || this.name.trim().length < 2) {
            throw new RoleValidationError(
                "Le nom du rôle doit contenir au moins 2 caractères"
            );
        }
        if (this.name.length > 50) {
            throw new RoleValidationError(
                "Le nom du rôle ne peut pas dépasser 50 caractères"
            );
        }
        if (this.description && this.description.length > 500) {
            throw new RoleValidationError(
                "La description ne peut pas dépasser 500 caractères"
            );
        }
    }

    isSystemRole(): boolean {
        return !this.canDelete;
    }

    canBeDeleted(): boolean {
        return this.canDelete;
    }

    hasPermission(permissionName: string): boolean {
        return this.permissions.some((p) => p.name === permissionName);
    }

    getPermissionIds(): string[] {
        return this.permissions.map((p) => p.id);
    }

    getPermissionCount(): number {
        return this.permissions.length;
    }

    updateDescription(newDescription?: string): Role {
        return new Role(
            this.id,
            this.name,
            this.permissions,
            this.canDelete,
            newDescription
        );
    }

    addPermission(permission: Permission): Role {
        if (this.hasPermission(permission.name)) {
            return this;
        }
        return new Role(
            this.id,
            this.name,
            [...this.permissions, permission],
            this.canDelete,
            this.description
        );
    }

    removePermission(permissionId: string): Role {
        return new Role(
            this.id,
            this.name,
            this.permissions.filter((p) => p.id !== permissionId),
            this.canDelete,
            this.description
        );
    }

    clone(overrides?: Partial<Omit<Role, "validate">>): Role {
        return new Role(
            overrides?.id ?? this.id,
            overrides?.name ?? this.name,
            overrides?.permissions ?? this.permissions,
            overrides?.canDelete ?? this.canDelete,
            overrides?.description ?? this.description
        );
    }
}

export { RoleValidationError, RoleNotFoundError };
