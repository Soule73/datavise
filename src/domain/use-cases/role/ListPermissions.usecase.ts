import type { IRoleRepository } from "@domain/ports/repositories/IRoleRepository";
import type { Permission } from "@domain/value-objects/Permission.vo";

export class ListPermissionsUseCase {
    private repository: IRoleRepository;

    constructor(repository: IRoleRepository) {
        this.repository = repository;
    }

    async execute(): Promise<Permission[]> {
        return this.repository.findAllPermissions();
    }
}
