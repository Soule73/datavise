import { useMutation } from "@tanstack/react-query";
import { authRepository } from "@infrastructure/repositories/AuthRepository";
import { LoginUseCase } from "@domain/use-cases/auth/Login.usecase";
import { RegisterUseCase } from "@domain/use-cases/auth/Register.usecase";
import type {
    LoginPayload,
    RegisterPayload,
    LoginResult,
} from "@domain/ports/repositories/IAuthRepository";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@stores/user";
import { loginSchema, type LoginForm } from "@validation/login";
import { registerSchema, type RegisterForm } from "@validation/register";
import { useState } from "react";
import type { ApiResponse } from "@/infrastructure/api/dto/ApiResponse.dto";
import { ROUTES } from "@/core/constants/routes";

type ApiError = ApiResponse<never> & { success: false };

const loginUseCase = new LoginUseCase(authRepository);
const registerUseCase = new RegisterUseCase(authRepository);

export function useLoginForm() {
    const setUser = useUserStore((s) => s.setUser);
    const navigate = useNavigate();
    const [globalError, setGlobalError] = useState("");
    const form = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

    const mutation = useMutation({
        mutationFn: (payload: LoginPayload) => loginUseCase.execute(payload),
        onSuccess: (res: LoginResult) => {
            setUser(res.user, res.token);
            setGlobalError("");
            navigate(ROUTES.dashboards, { replace: true });
        },
        onError: (e: ApiError) => {
            if (e?.error?.details && typeof e.error.details === "object") {
                Object.entries(e.error.details).forEach(([field, message]) => {
                    form.setError(field as keyof LoginForm, {
                        type: "manual",
                        message: message as string,
                    });
                });
                setGlobalError("");
            } else {
                setGlobalError(e.error?.message || "Erreur de connexion");
            }
        },
    });

    const onSubmit = (data: LoginForm) => {
        setGlobalError("");
        mutation.mutate(data);
    };

    return {
        ...form,
        onSubmit,
        globalError,
        setGlobalError,
        loading: mutation.isPending,
    };
}

export function useRegisterForm() {
    const setUser = useUserStore((s) => s.setUser);
    const form = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });
    const [globalError, setGlobalError] = useState("");
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (payload: RegisterPayload) => registerUseCase.execute(payload),
        onSuccess: (res: LoginResult) => {
            setUser(res.user, res.token);
            setGlobalError("");
            navigate(ROUTES.dashboard, { replace: true });
        },
        onError: (e: ApiError) => {
            if (e?.error?.details && typeof e.error.details === "object") {
                Object.entries(e.error.details).forEach(([field, message]) => {
                    form.setError(field as keyof RegisterForm, {
                        type: "manual",
                        message: message as string,
                    });
                });
                setGlobalError("");
            } else {
                setGlobalError(
                    e.error?.message || "Erreur lors de la création du compte"
                );
            }
        },
    });

    const onSubmit = (data: RegisterForm) => {
        setGlobalError("");
        mutation.mutate(data);
    };

    return {
        ...form,
        onSubmit,
        loading: mutation.isPending,
        globalError,
        setGlobalError,
    };
}
