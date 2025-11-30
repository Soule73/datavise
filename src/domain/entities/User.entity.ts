import {
    UserValidationError,
    UserNotFoundError,
} from "../errors/DomainError";
import type { Role } from "./Role.entity";

export class User {
    readonly id: string;
    readonly email: string;
    readonly username: string;
    readonly role?: Role;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    constructor(
        id: string,
        email: string,
        username: string,
        role?: Role,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.validate();
    }

    private validate(): void {
        if (!this.email || !this.isValidEmail(this.email)) {
            throw new UserValidationError("Email invalide");
        }
        if (!this.username || this.username.trim().length < 2) {
            throw new UserValidationError(
                "Le nom d'utilisateur doit contenir au moins 2 caractères"
            );
        }
        if (this.username.length > 50) {
            throw new UserValidationError(
                "Le nom d'utilisateur ne peut pas dépasser 50 caractères"
            );
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    hasRole(): boolean {
        return !!this.role;
    }

    getRoleId(): string | undefined {
        return this.role?.id;
    }

    getRoleName(): string | undefined {
        return this.role?.name;
    }

    hasPermission(permissionName: string): boolean {
        if (!this.role) {
            return false;
        }
        return this.role.hasPermission(permissionName);
    }

    canBeDeleted(): boolean {
        return true;
    }

    isSystemUser(): boolean {
        return false;
    }

    updateUsername(newUsername: string): User {
        return new User(
            this.id,
            this.email,
            newUsername,
            this.role,
            this.createdAt,
            this.updatedAt
        );
    }

    updateEmail(newEmail: string): User {
        return new User(
            this.id,
            newEmail,
            this.username,
            this.role,
            this.createdAt,
            this.updatedAt
        );
    }

    assignRole(newRole: Role): User {
        return new User(
            this.id,
            this.email,
            this.username,
            newRole,
            this.createdAt,
            this.updatedAt
        );
    }

    clone(overrides?: Partial<Omit<User, "validate">>): User {
        return new User(
            overrides?.id ?? this.id,
            overrides?.email ?? this.email,
            overrides?.username ?? this.username,
            overrides?.role ?? this.role,
            overrides?.createdAt ?? this.createdAt,
            overrides?.updatedAt ?? this.updatedAt
        );
    }
}

export { UserValidationError, UserNotFoundError };
