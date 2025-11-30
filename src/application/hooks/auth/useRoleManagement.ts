import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleRepository } from "@infrastructure/repositories/RoleRepository";
import { ListRolesUseCase } from "@domain/use-cases/role/ListRoles.usecase";
import { CreateRoleUseCase } from "@domain/use-cases/role/CreateRole.usecase";
import { UpdateRoleUseCase } from "@domain/use-cases/role/UpdateRole.usecase";
import { DeleteRoleUseCase } from "@domain/use-cases/role/DeleteRole.usecase";
import { ListPermissionsUseCase } from "@domain/use-cases/role/ListPermissions.usecase";
import type {
    CreateRolePayload,
    UpdateRolePayload,
} from "@domain/ports/repositories/IRoleRepository";
import { useState, useMemo } from "react";
import { useNotificationStore } from "@stores/notification";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roleSchema } from "@validation/role";
import { groupPermissionsByModel, toggleArrayValue } from "@utils/roleUtils";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/core/constants/routes";
import type { Role } from "@domain/entities/Role.entity";
import type { Permission } from "@domain/value-objects/Permission.vo";

export interface RoleCreateForm {
    name: string;
    description: string;
    permissions: string[];
}


const listRolesUseCase = new ListRolesUseCase(roleRepository);
const createRoleUseCase = new CreateRoleUseCase(roleRepository);
const updateRoleUseCase = new UpdateRoleUseCase(roleRepository);
const deleteRoleUseCase = new DeleteRoleUseCase(roleRepository);
const listPermissionsUseCase = new ListPermissionsUseCase(roleRepository);

const ROLES_QUERY_KEY = ["roles"];
const PERMISSIONS_QUERY_KEY = ["permissions"];

export function useRoleManagement() {
    const queryClient = useQueryClient();
    const showNotification = useNotificationStore((s) => s.showNotification);

    const [showPerms, setShowPerms] = useState<string | null>(null);
    const [editRoleId, setEditRoleId] = useState<string | null>(null);
    const [editRole, setEditRole] = useState<any>(null);
    const [roleToDelete, setRoleToDelete] = useState<any>(null);
    const [editConfirm, setEditConfirm] = useState(false);

    const rolesQuery = useQuery({
        queryKey: ROLES_QUERY_KEY,
        queryFn: () => listRolesUseCase.execute(),
        staleTime: 5 * 60 * 1000,
    });

    const permissionsQuery = useQuery({
        queryKey: PERMISSIONS_QUERY_KEY,
        queryFn: () => listPermissionsUseCase.execute(),
        staleTime: 10 * 60 * 1000,
    });

    const formHook = useForm({
        resolver: zodResolver(roleSchema),
        defaultValues: editRole,
        values: editRole,
    });

    const updateMutation = useMutation({
        mutationFn: ({
            roleId,
            payload,
        }: {
            roleId: string;
            payload: UpdateRolePayload;
        }) => updateRoleUseCase.execute(roleId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
            setEditRoleId(null);
            setEditRole(null);
            showNotification({
                open: true,
                type: "success",
                title: "Rôle mis à jour",
                description: "Les modifications ont été enregistrées avec succès.",
            });
        },
        onError: () => {
            showNotification({
                open: true,
                type: "error",
                title: "Erreur",
                description: "Erreur lors de la sauvegarde du rôle.",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (roleId: string) => deleteRoleUseCase.execute(roleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
            setRoleToDelete(null);
            showNotification({
                open: true,
                type: "success",
                title: "Rôle supprimé",
                description: "Le rôle a bien été supprimé.",
            });
        },
        onError: (e: any) => {
            showNotification({
                open: true,
                type: "error",
                title: "Erreur",
                description:
                    e?.response?.data?.message ||
                    "Erreur lors de la suppression du rôle.",
            });
        },
    });

    function startEdit(role: any) {
        setEditRoleId(role.id);
        setEditRole({
            name: role.name,
            description: role.description,
            permissions: role.permissions.map((p: any) => p.id),
        });
        setShowPerms(role.id);
    }

    function cancelEdit() {
        setEditRoleId(null);
        setEditRole(null);
    }

    function togglePermission(permId: string) {
        if (!editRole) return;
        setEditRole((prev: any) => ({
            ...prev,
            permissions: toggleArrayValue(prev.permissions, permId),
        }));
    }

    function saveEdit() {
        setEditConfirm(true);
    }

    function handleEditConfirm() {
        setEditConfirm(false);
        if (!editRoleId || !editRole) return;
        updateMutation.mutate({ roleId: editRoleId, payload: editRole });
    }

    function handleDeleteRole() {
        if (!roleToDelete) return;
        deleteMutation.mutate(roleToDelete.id);
    }

    const groupedPermissions = groupPermissionsByModel(permissionsQuery.data ?? []);

    return {
        roles: (rolesQuery.data ?? []) as any as Role[],
        permissions: (permissionsQuery.data ?? []) as any as Permission[],
        isLoading: rolesQuery.isLoading,
        showPerms,
        setShowPerms,
        editRoleId,
        setEditRoleId,
        editRole,
        setEditRole,
        roleToDelete,
        setRoleToDelete,
        editConfirm,
        setEditConfirm,
        startEdit,
        cancelEdit,
        togglePermission,
        saveEdit,
        handleEditConfirm,
        handleDeleteRole,
        groupedPermissions,
        updateLoading: updateMutation.isPending,
        deleteLoading: deleteMutation.isPending,
        formHook,
    };
}

export function useRoleCreate() {
    const navigate = useNavigate();
    const showNotification = useNotificationStore((s) => s.showNotification);
    const queryClient = useQueryClient();
    const [form, setForm] = useState<RoleCreateForm>({
        name: "",
        description: "",
        permissions: [],
    });
    const [loading, setLoading] = useState(false);

    const permissionsQuery = useQuery({
        queryKey: PERMISSIONS_QUERY_KEY,
        queryFn: () => listPermissionsUseCase.execute(),
        staleTime: 10 * 60 * 1000,
    });

    const mutation = useMutation({
        mutationFn: (payload: CreateRolePayload) =>
            createRoleUseCase.execute(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
            setForm({ name: "", description: "", permissions: [] });
            showNotification({
                open: true,
                type: "success",
                title: "Rôle créé",
                description: "Le nouveau rôle a été ajouté.",
            });
            navigate(ROUTES.roles);
            setLoading(false);
        },
        onError: () => {
            showNotification({
                open: true,
                type: "error",
                title: "Erreur",
                description: "Erreur lors de la création du rôle.",
            });
            setLoading(false);
        },
    });

    const handleChange = (field: string, value: string | string[]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleTogglePerm = (permId: string) => {
        setForm((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(permId)
                ? prev.permissions.filter((id) => id !== permId)
                : [...prev.permissions, permId],
        }));
    };

    const allPermissionIds = (permissionsQuery.data ?? []).map((p) => p.id);
    const allSelected =
        form.permissions.length === allPermissionIds.length &&
        allPermissionIds.length > 0;

    const toggleAll = () => {
        setForm((prev) => ({
            ...prev,
            permissions: allSelected ? [] : allPermissionIds,
        }));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!form.name.trim()) {
            showNotification({
                open: true,
                type: "error",
                title: "Nom requis",
                description: "Le nom du rôle est obligatoire.",
            });
            return;
        }
        if (form.permissions.length === 0) {
            showNotification({
                open: true,
                type: "error",
                title: "Permissions requises",
                description: "Veuillez sélectionner au moins une permission.",
            });
            return;
        }
        setLoading(true);
        mutation.mutate(form);
    };

    const groupedPermissions = useMemo(() => {
        return (permissionsQuery.data ?? []).reduce(
            (acc: Record<string, typeof permissionsQuery.data>, perm) => {
                const [model] = perm.name.split(":");
                if (!acc[model]) acc[model] = [];
                acc[model].push(perm);
                return acc;
            },
            {} as Record<string, typeof permissionsQuery.data>
        );
    }, [permissionsQuery.data]);

    return {
        form,
        setForm,
        loading: loading || mutation.isPending,
        handleChange,
        handleTogglePerm,
        allSelected,
        toggleAll,
        handleSubmit,
        permissions: (permissionsQuery.data ?? []) as any as Permission[],
        groupedPermissions,
    };
}
