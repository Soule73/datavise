import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userRepository } from "@infrastructure/repositories/UserRepository";
import { ListUsersUseCase } from "@domain/use-cases/user/ListUsers.usecase";
import { CreateUserUseCase } from "@domain/use-cases/user/CreateUser.usecase";
import { UpdateUserUseCase } from "@domain/use-cases/user/UpdateUser.usecase";
import { DeleteUserUseCase } from "@domain/use-cases/user/DeleteUser.usecase";
import type {
    CreateUserPayload,
    UpdateUserPayload,
} from "@domain/ports/repositories/IUserRepository";

const listUsersUseCase = new ListUsersUseCase(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

const USERS_QUERY_KEY = ["users"];

export function useUserManagement() {
    const queryClient = useQueryClient();

    const usersQuery = useQuery({
        queryKey: USERS_QUERY_KEY,
        queryFn: () => listUsersUseCase.execute(),
        staleTime: 5 * 60 * 1000,
    });

    const createMutation = useMutation({
        mutationFn: (payload: CreateUserPayload) =>
            createUserUseCase.execute(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            userId,
            payload,
        }: {
            userId: string;
            payload: UpdateUserPayload;
        }) => updateUserUseCase.execute(userId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (userId: string) => deleteUserUseCase.execute(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        },
    });

    return {
        users: usersQuery.data ?? [],
        isLoading: usersQuery.isLoading,
        error: usersQuery.error,
        refetch: usersQuery.refetch,

        createUser: createMutation.mutate,
        createUserAsync: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        createError: createMutation.error,

        updateUser: updateMutation.mutate,
        updateUserAsync: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        updateError: updateMutation.error,

        deleteUser: deleteMutation.mutate,
        deleteUserAsync: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
        deleteError: deleteMutation.error,
    };
}
