import type {
    IRoleRepository,
    UpdateRolePayload,
} from "@domain/ports/repositories/IRoleRepository";
import type { Role } from "@domain/entities/Role.entity";
import { RoleNotFoundError, RoleValidationError } from "@domain/errors/DomainError";

export class UpdateRoleUseCase {
    private repository: IRoleRepository;

    constructor(repository: IRoleRepository) {
        this.repository = repository;
    }

    async execute(roleId: string, payload: UpdateRolePayload): Promise<Role> {
        if (!roleId) {
            throw new RoleValidationError("L'ID du rôle est requis");
        }

        const existingRole = await this.repository.findById(roleId);
        if (!existingRole) {
            throw new RoleNotFoundError(roleId);
        }

        if (existingRole.isSystemRole()) {
            throw new RoleValidationError("Les rôles système ne peuvent pas être modifiés");
        }

        return this.repository.update(roleId, payload);
    }
}
