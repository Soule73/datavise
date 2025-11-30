import type { User } from "@domain/entities/User.entity";

export interface CreateUserPayload {
    username: string;
    email: string;
    password: string;
    roleId: string;
}

export interface UpdateUserPayload {
    username?: string;
    email?: string;
    password?: string;
    roleId?: string;
}

export interface IUserRepository {
    findAll(): Promise<User[]>;
    findById(userId: string): Promise<User | null>;
    create(payload: CreateUserPayload): Promise<User>;
    update(userId: string, payload: UpdateUserPayload): Promise<User>;
    delete(userId: string): Promise<void>;
}
