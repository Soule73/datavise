import type {
    IAuthRepository,
    RegisterPayload,
    LoginResult,
} from "@domain/ports/repositories/IAuthRepository";
import { AuthenticationError } from "@domain/errors/DomainError";

export class RegisterUseCase {
    private repository: IAuthRepository;

    constructor(repository: IAuthRepository) {
        this.repository = repository;
    }

    async execute(payload: RegisterPayload): Promise<LoginResult> {
        if (!payload.username || !payload.email || !payload.password) {
            throw new AuthenticationError(
                "Nom d'utilisateur, email et mot de passe sont requis"
            );
        }

        if (payload.password.length < 6) {
            throw new AuthenticationError(
                "Le mot de passe doit contenir au moins 6 caractères"
            );
        }

        return this.repository.register(payload);
    }
}
