import { useMutation } from "@tanstack/react-query";
import { authRepository } from "@infrastructure/repositories/AuthRepository";
import { LoginUseCase } from "@domain/use-cases/auth/Login.usecase";
import { RegisterUseCase } from "@domain/use-cases/auth/Register.usecase";
import type {
    LoginPayload,
    RegisterPayload,
} from "@domain/ports/repositories/IAuthRepository";

const loginUseCase = new LoginUseCase(authRepository);
const registerUseCase = new RegisterUseCase(authRepository);

export function useAuth() {
    const loginMutation = useMutation({
        mutationFn: (payload: LoginPayload) => loginUseCase.execute(payload),
    });

    const registerMutation = useMutation({
        mutationFn: (payload: RegisterPayload) => registerUseCase.execute(payload),
    });

    return {
        login: loginMutation.mutate,
        loginAsync: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,
        loginData: loginMutation.data,

        register: registerMutation.mutate,
        registerAsync: registerMutation.mutateAsync,
        isRegistering: registerMutation.isPending,
        registerError: registerMutation.error,
        registerData: registerMutation.data,
    };
}
