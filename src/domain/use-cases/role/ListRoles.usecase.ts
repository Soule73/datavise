import type { IRoleRepository } from "@domain/ports/repositories/IRoleRepository";
import type { Role } from "@domain/entities/Role.entity";

export class ListRolesUseCase {
    private repository: IRoleRepository;

    constructor(repository: IRoleRepository) {
        this.repository = repository;
    }

    async execute(): Promise<Role[]> {
        return this.repository.findAll();
    }
}
