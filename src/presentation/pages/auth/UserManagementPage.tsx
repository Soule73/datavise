import { useUserManagement } from "@/application/hooks/auth/useUserManagement";
import Table from "@components/Table";
import Button from "@components/forms/Button";
import type { User } from "@domain/entities/User.entity";
import UserModalForm from "@components/auth/UserModalForm";
import UserDeleteModal from "@components/auth/UserDeleteModal";
import AuthLayout from "@/presentation/components/layouts/AuthLayout";
import breadcrumbs from "@/core/utils/breadcrumbs";
import Section from "@components/Section";
import PageHeader from "@components/PageHeader";

function getErrorMsg(err: unknown) {
  if (!err) return undefined;
  if (typeof err === "string") return err;
  if (typeof (err as { message?: string }).message === "string")
    return (err as { message?: string }).message;
  return undefined;
}

export default function UserManagementPage() {

  const {
    users,
    isLoading,
    modalOpen,
    setModalOpen,
    editingUser,
    form,
    setForm,
    isSaving,
    showPassword,
    openModal,
    handleSaveUser,
    deleteModalOpen,
    setDeleteModalOpen,
    userToDelete,
    setUserToDelete,
    handleDeleteUser,
    isDeleting,
    generatePassword,
    formHook,
    columns,
    hasPermission,
    rolesList,
  } = useUserManagement();

  return (
    <AuthLayout permission="user:canView"
      breadcrumb={breadcrumbs.userList}
    >
      <Section>
        <PageHeader
          title="Gestion des utilisateurs"
          actions={
            hasPermission("user:canCreate") && (
              <Button
                color="indigo"
                size="sm"
                variant="solid"
                className="w-max"
                onClick={() => openModal()}
              >
                Ajouter un utilisateur
              </Button>
            )
          }
        />
        <Table
          searchable={true}
          paginable={true}
          rowPerPage={5}
          columns={columns}
          data={users}
          loading={isLoading}
          emptyMessage="Aucun utilisateur."
          actionsColumn={{
            label: "",
            key: "actions",
            render: (u: User) => (
              <div className="flex gap-2">
                {hasPermission("user:canUpdate") && (
                  <div>
                    <Button
                      color="indigo"
                      size="sm"
                      variant="outline"
                      title="Modfier l’utilisateur"
                      className=" w-max border-none!"
                      onClick={() => openModal(u)}
                    >
                      Modifier
                    </Button>
                  </div>
                )}
                {hasPermission("user:canDelete") && (
                  <div>
                    <Button
                      color="red"
                      size="sm"
                      variant="outline"
                      title="Supprimer l’utilisateur"
                      className="w-max border-none! "
                      onClick={() => {
                        setUserToDelete(u);
                        setDeleteModalOpen(true);
                      }}
                    >
                      Supprimer
                    </Button>
                  </div>
                )}
              </div>
            ),
          }}
        />
        <UserModalForm
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveUser}
          loading={isSaving}
          editingUser={!!editingUser}
          form={form}
          setForm={setForm}
          formHook={formHook}
          showPassword={showPassword}
          generatePassword={generatePassword}
          rolesList={rolesList}
          getErrorMsg={getErrorMsg}
        />
        <UserDeleteModal
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setUserToDelete(null);
          }}
          onConfirm={handleDeleteUser}
          loading={isDeleting}
          userToDelete={userToDelete}
        />
      </Section>
    </AuthLayout>
  );
}
