import type { IUserRepository } from "@domain/ports/repositories/IUserRepository";
import { UserNotFoundError, UserValidationError } from "@domain/errors/DomainError";

export class DeleteUserUseCase {
    private repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async execute(userId: string): Promise<void> {
        if (!userId) {
            throw new UserValidationError("L'ID utilisateur est requis");
        }

        const existingUser = await this.repository.findById(userId);
        if (!existingUser) {
            throw new UserNotFoundError(userId);
        }

        if (!existingUser.canBeDeleted()) {
            throw new UserValidationError("Cet utilisateur ne peut pas être supprimé");
        }

        await this.repository.delete(userId);
    }
}
