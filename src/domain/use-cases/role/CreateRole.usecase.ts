import type {
    IRoleRepository,
    CreateRolePayload,
} from "@domain/ports/repositories/IRoleRepository";
import type { Role } from "@domain/entities/Role.entity";
import { RoleValidationError } from "@domain/errors/DomainError";

export class CreateRoleUseCase {
    private repository: IRoleRepository;

    constructor(repository: IRoleRepository) {
        this.repository = repository;
    }

    async execute(payload: CreateRolePayload): Promise<Role> {
        if (!payload.name) {
            throw new RoleValidationError("Le nom du rôle est requis");
        }

        if (!payload.permissions || payload.permissions.length === 0) {
            throw new RoleValidationError("Au moins une permission est requise");
        }

        return this.repository.create(payload);
    }
}
