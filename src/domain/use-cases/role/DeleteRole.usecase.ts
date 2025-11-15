import type { IRoleRepository } from "@domain/ports/repositories/IRoleRepository";
import { RoleNotFoundError, RoleValidationError } from "@domain/errors/DomainError";

export class DeleteRoleUseCase {
    private repository: IRoleRepository;

    constructor(repository: IRoleRepository) {
        this.repository = repository;
    }

    async execute(roleId: string): Promise<void> {
        if (!roleId) {
            throw new RoleValidationError("L'ID du rôle est requis");
        }

        const existingRole = await this.repository.findById(roleId);
        if (!existingRole) {
            throw new RoleNotFoundError(roleId);
        }

        if (!existingRole.canBeDeleted()) {
            throw new RoleValidationError("Ce rôle ne peut pas être supprimé");
        }

        await this.repository.delete(roleId);
    }
}
