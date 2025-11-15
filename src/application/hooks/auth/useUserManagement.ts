import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userRepository } from "@infrastructure/repositories/UserRepository";
import { roleRepository } from "@infrastructure/repositories/RoleRepository";
import { ListUsersUseCase } from "@domain/use-cases/user/ListUsers.usecase";
import { CreateUserUseCase } from "@domain/use-cases/user/CreateUser.usecase";
import { UpdateUserUseCase } from "@domain/use-cases/user/UpdateUser.usecase";
import { DeleteUserUseCase } from "@domain/use-cases/user/DeleteUser.usecase";
import { ListRolesUseCase } from "@domain/use-cases/role/ListRoles.usecase";
import type {
    CreateUserPayload,
    UpdateUserPayload,
} from "@domain/ports/repositories/IUserRepository";
import { useState, useMemo } from "react";
import { useNotificationStore } from "@store/notification";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@store/user";
import type { User } from "@domain/entities/User.entity";
import type { Role } from "@domain/entities/Role.entity";
import { userSchema } from "@validation/user";

const listUsersUseCase = new ListUsersUseCase(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const listRolesUseCase = new ListRolesUseCase(roleRepository);

const USERS_QUERY_KEY = ["users"];
const ROLES_QUERY_KEY = ["roles"];

export function useUserManagement() {
    const queryClient = useQueryClient();
    const showNotification = useNotificationStore((s) => s.showNotification);
    const hasPermission = useUserStore((s) => s.hasPermission);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [form, setForm] = useState<any>({ email: "", username: "", role: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any>(null);

    const usersQuery = useQuery({
        queryKey: USERS_QUERY_KEY,
        queryFn: () => listUsersUseCase.execute(),
        staleTime: 5 * 60 * 1000,
    });

    const rolesQuery = useQuery({
        queryKey: ROLES_QUERY_KEY,
        queryFn: () => listRolesUseCase.execute(),
        staleTime: 5 * 60 * 1000,
    });

    const createMutation = useMutation({
        mutationFn: (payload: CreateUserPayload) =>
            createUserUseCase.execute(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
            setModalOpen(false);
            showNotification({
                open: true,
                type: "success",
                title: "Utilisateur ajouté",
                description: "Nouvel utilisateur créé.",
            });
        },
        onError: (e: any) => {
            showNotification({
                open: true,
                type: "error",
                title: "Erreur",
                description:
                    e?.response?.data?.message || "Erreur lors de la sauvegarde.",
            });
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
            setModalOpen(false);
            setEditingUser(null);
            showNotification({
                open: true,
                type: "success",
                title: "Utilisateur modifié",
                description: "Utilisateur mis à jour.",
            });
        },
        onError: (e: any) => {
            showNotification({
                open: true,
                type: "error",
                title: "Erreur",
                description:
                    e?.response?.data?.message || "Erreur lors de la sauvegarde.",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (userId: string) => deleteUserUseCase.execute(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
            setDeleteModalOpen(false);
            setUserToDelete(null);
            showNotification({
                open: true,
                type: "success",
                title: "Utilisateur supprimé",
                description: "L'utilisateur et ses données privées ont été supprimés.",
            });
        },
        onError: (e: any) => {
            showNotification({
                open: true,
                type: "error",
                title: "Erreur",
                description:
                    e?.response?.data?.message || "Erreur lors de la suppression.",
            });
        },
    });

    const formHook = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: form,
        values: form,
    });

    const columns = useMemo(
        () => [
            { key: "email", label: "Email" },
            { key: "username", label: "Nom d'utilisateur" },
            { key: "roleId", label: "Rôle", render: (u: User) => u.role?.name },
        ],
        []
    );

    const rolesList = useMemo(
        () => (rolesQuery.data ?? []).map((r: Role) => ({ value: r.id, label: r.name })),
        [rolesQuery.data]
    );

    function openModal(user?: any) {
        setEditingUser(user || null);
        setForm(
            user
                ? { ...user, role: user.roleId?._id }
                : { email: "", username: "", role: "" }
        );
        setModalOpen(true);
    }

    function handleSaveUser() {
        const payload = { ...form, roleId: form.role };
        if (editingUser) {
            updateMutation.mutate({ userId: editingUser.id, payload });
        } else {
            createMutation.mutate(payload);
        }
    }

    function handleDeleteUser() {
        if (userToDelete) deleteMutation.mutate(userToDelete.id);
    }

    function generatePassword() {
        const chars =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let pwd = "";
        while (pwd.length < 8) {
            pwd += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setForm((f: any) => ({ ...f, password: pwd }));
        setShowPassword(true);
    }

    return {
        users: (usersQuery.data || []) as any as User[],
        roles: (rolesQuery.data || []) as any as Role[],
        isLoading: usersQuery.isLoading,
        modalOpen,
        setModalOpen,
        editingUser,
        setEditingUser,
        form,
        setForm,
        isSaving: createMutation.isPending || updateMutation.isPending,
        showPassword,
        setShowPassword,
        openModal,
        handleSaveUser,
        deleteModalOpen,
        setDeleteModalOpen,
        userToDelete,
        setUserToDelete,
        handleDeleteUser,
        isDeleting: deleteMutation.isPending,
        generatePassword,
        formHook,
        columns,
        hasPermission,
        rolesList,
    };
}
