import type {
    IUserRepository,
    UpdateUserPayload,
} from "@domain/ports/repositories/IUserRepository";
import type { User } from "@domain/entities/User.entity";
import { UserNotFoundError, UserValidationError } from "@domain/errors/DomainError";

export class UpdateUserUseCase {
    private repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async execute(userId: string, payload: UpdateUserPayload): Promise<User> {
        if (!userId) {
            throw new UserValidationError("L'ID utilisateur est requis");
        }

        const existingUser = await this.repository.findById(userId);
        if (!existingUser) {
            throw new UserNotFoundError(userId);
        }

        if (payload.password && payload.password.length < 6) {
            throw new UserValidationError(
                "Le mot de passe doit contenir au moins 6 caractères"
            );
        }

        return this.repository.update(userId, payload);
    }
}
