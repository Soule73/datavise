import type {
    IUserRepository,
    CreateUserPayload,
} from "@domain/ports/repositories/IUserRepository";
import type { User } from "@domain/entities/User.entity";
import { UserValidationError } from "@domain/errors/DomainError";

export class CreateUserUseCase {
    private repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async execute(payload: CreateUserPayload): Promise<User> {
        if (!payload.username || !payload.email || !payload.password) {
            throw new UserValidationError(
                "Nom d'utilisateur, email et mot de passe sont requis"
            );
        }

        if (!payload.roleId) {
            throw new UserValidationError("Le rôle est requis");
        }

        if (payload.password.length < 6) {
            throw new UserValidationError(
                "Le mot de passe doit contenir au moins 6 caractères"
            );
        }

        return this.repository.create(payload);
    }
}
