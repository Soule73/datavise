import type {
    IAuthRepository,
    LoginPayload,
    LoginResult,
} from "@domain/ports/repositories/IAuthRepository";
import { AuthenticationError } from "@domain/errors/DomainError";

export class LoginUseCase {
    private repository: IAuthRepository;

    constructor(repository: IAuthRepository) {
        this.repository = repository;
    }

    async execute(payload: LoginPayload): Promise<LoginResult> {
        if (!payload.email || !payload.password) {
            throw new AuthenticationError(
                "Email et mot de passe sont requis"
            );
        }

        return this.repository.login(payload);
    }
}
