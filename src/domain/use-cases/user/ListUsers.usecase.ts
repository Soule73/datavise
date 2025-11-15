import type { IUserRepository } from "@domain/ports/repositories/IUserRepository";
import type { User } from "@domain/entities/User.entity";

export class ListUsersUseCase {
    private repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async execute(): Promise<User[]> {
        return this.repository.findAll();
    }
}
