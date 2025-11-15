import type { User } from "@domain/entities/User.entity";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}

export interface LoginResult {
    user: User;
    token: string;
}

export interface IAuthRepository {
    login(payload: LoginPayload): Promise<LoginResult>;
    register(payload: RegisterPayload): Promise<LoginResult>;
}
