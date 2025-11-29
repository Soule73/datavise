import type { Role } from "@domain/entities/Role.entity";
import type { Permission } from "@domain/value-objects/Permission.vo";
import {
  PermissionGroup,
  RoleActions,
  RoleInfo,
} from "@components/RoleManagementParts";
import AlertModal from "@/presentation/components/shared/AlertModal";
import { Link } from "react-router-dom";
import { ROUTES } from "@constants/routes";
import CheckboxField from "@/presentation/components/shared/forms/CheckboxField";
import { useRoleManagement } from "@/application/hooks/auth/useRoleManagement";
import { useUserStore } from "@store/user";
import AuthLayout from "@/presentation/components/shared/layouts/AuthLayout";
import breadcrumbs from "@/core/utils/breadcrumbs";
import Section from "@/presentation/components/shared/Section";
import PageHeader from "@/presentation/components/shared/layouts/PageHeader";

export default function RoleManagementPage() {
  const {
    roles,
    permissions,
    isLoading,
    showPerms,
    setShowPerms,
    editRoleId,
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
    formHook,
  } = useRoleManagement();

  const hasPermission = useUserStore((s) => s.hasPermission);

  return (
    <AuthLayout permission="role:canView"
      breadcrumb={breadcrumbs.roleList}
    >
      <Section>
        <PageHeader
          title="Gestion des rôles"
          actions={
            hasPermission("role:canCreate") && (
              <Link
                to={ROUTES.roleCreate}
                className="w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
              >
                Nouveau rôle
              </Link>
            )
          }
        />
        {isLoading ? (
          <div>Chargement…</div>
        ) : (
          <div className="space-y-6">
            {(Array.isArray(roles) ? roles : []).map((role: Role) => (
              <div
                key={role.id}
                className="bg-white dark:bg-gray-900 rounded p-4 border border-gray-200 dark:border-gray-700"
              >
                <RoleActions
                  isEditing={editRoleId === role.id}
                  onEdit={
                    hasPermission("role:canUpdate")
                      ? () => startEdit(role)
                      : () => { }
                  }
                  onCancel={cancelEdit}
                  onSave={saveEdit}
                  onTogglePerms={() =>
                    setShowPerms(showPerms === role.id ? null : role.id)
                  }
                  showPerms={showPerms === role.id}
                  canDelete={role.canDelete && hasPermission("role:canDelete")}
                  onDelete={
                    role.canDelete && hasPermission("role:canDelete")
                      ? () => setRoleToDelete(role)
                      : undefined
                  }
                />
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <RoleInfo
                    isEditing={editRoleId === role.id}
                    name={editRoleId === role.id ? editRole.name : role.name}
                    description={
                      editRoleId === role.id
                        ? editRole.description
                        : role.description
                    }
                    onChangeName={(v) =>
                      setEditRole((prev: Role) => ({ ...prev, name: v }))
                    }
                    onChangeDescription={(v) =>
                      setEditRole((prev: Role) => ({ ...prev, description: v }))
                    }
                  />
                </div>
                {showPerms === role.id && editRoleId === role.id && (
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-medium">Permissions</span>
                    <CheckboxField
                      label="Tout sélectionner"
                      checked={
                        editRole &&
                        (permissions ?? []).length > 0 &&
                        editRole.permissions.length === (permissions ?? []).length
                      }
                      onChange={() => {
                        if (!editRole) return;
                        const allPermissionIds = (permissions ?? []).map(
                          (p: Permission) => p.id
                        );
                        const shouldSelectAll =
                          editRole.permissions.length !== allPermissionIds.length;
                        setEditRole((prev: Role) => ({
                          ...prev,
                          permissions: shouldSelectAll ? allPermissionIds : [],
                        }));
                        formHook.setValue(
                          "permissions",
                          shouldSelectAll ? allPermissionIds : []
                        );
                      }}
                      id={`select-all-edit-${role.id}`}
                      name="selectAllEditPerms"
                    />
                  </div>
                )}
                {showPerms === role.id && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    {Object.entries(groupedPermissions).map(([model, perms]) => (
                      <PermissionGroup
                        key={model}
                        model={model}
                        perms={perms as Permission[]}
                        checkedPerms={
                          editRoleId === role.id
                            ? editRole.permissions
                            : role.permissions
                        }
                        onToggle={togglePermission}
                        editable={editRoleId === role.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {/* <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">
          Toutes les permissions existantes
        </h2>
        <div className="flex flex-wrap gap-2">
          {(permissions ?? []).map((perm: Permission) => (
            <span
              key={perm.id}
              className="inline-block bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-700 mb-1"
            >
              {perm.name}
            </span>
          ))}
        </div>
      </div> */}
        <AlertModal
          key={roleToDelete ? `delete-${roleToDelete.id}` : "delete-modal"}
          open={!!roleToDelete}
          onClose={() => setRoleToDelete(null)}
          onConfirm={handleDeleteRole}
          type="error"
          title="Confirmer la suppression"
          description={
            roleToDelete
              ? `Êtes-vous sûr de vouloir supprimer le rôle « ${roleToDelete.name}» ? Cette action est irréversible.`
              : ""
          }
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          loading={false}
        />
        <AlertModal
          key={editRoleId ? `edit-${editRoleId}` : "edit-modal"}
          open={editConfirm}
          onClose={() => setEditConfirm(false)}
          onConfirm={handleEditConfirm}
          type="info"
          title="Confirmer la modification"
          description={
            editRole
              ? `Voulez-vous vraiment enregistrer les modifications du rôle « ${editRole.name} » ?`
              : ""
          }
          confirmLabel="Enregistrer"
          cancelLabel="Annuler"
          loading={false}
        />
      </Section>
    </AuthLayout>
  );
}