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

const listRolesUseCase = new ListRolesUseCase(roleRepository);
const createRoleUseCase = new CreateRoleUseCase(roleRepository);
const updateRoleUseCase = new UpdateRoleUseCase(roleRepository);
const deleteRoleUseCase = new DeleteRoleUseCase(roleRepository);
const listPermissionsUseCase = new ListPermissionsUseCase(roleRepository);

const ROLES_QUERY_KEY = ["roles"];
const PERMISSIONS_QUERY_KEY = ["permissions"];

export function useRoleManagement() {
    const queryClient = useQueryClient();

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

    const createMutation = useMutation({
        mutationFn: (payload: CreateRolePayload) =>
            createRoleUseCase.execute(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
        },
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
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (roleId: string) => deleteRoleUseCase.execute(roleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
        },
    });

    return {
        roles: rolesQuery.data ?? [],
        isLoadingRoles: rolesQuery.isLoading,
        rolesError: rolesQuery.error,
        refetchRoles: rolesQuery.refetch,

        permissions: permissionsQuery.data ?? [],
        isLoadingPermissions: permissionsQuery.isLoading,
        permissionsError: permissionsQuery.error,
        refetchPermissions: permissionsQuery.refetch,

        createRole: createMutation.mutate,
        createRoleAsync: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        createError: createMutation.error,

        updateRole: updateMutation.mutate,
        updateRoleAsync: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        updateError: updateMutation.error,

        deleteRole: deleteMutation.mutate,
        deleteRoleAsync: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
        deleteError: deleteMutation.error,
    };
}
