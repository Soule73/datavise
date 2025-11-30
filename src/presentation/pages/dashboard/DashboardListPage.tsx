import type { Dashboard } from "@domain/entities/Dashboard.entity";
import { EyeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { ROUTES } from "@/core/constants/routes";
import { useDashboardListPage } from "@/application/hooks/dashboard/useDashboardListPage";
import breadcrumbs from "@/core/utils/breadcrumbs";
import AuthLayout from "@/presentation/layout/AuthLayout";
import { Button, DataTable, Modal, PageHeader, Section } from "@datavise/ui";

export default function DashboardListPage() {
  const {
    dashboards,
    isLoading,
    modalOpen,
    setModalOpen,
    setSelectedDashboard,
    deleteLoading,
    handleDelete,
    columns,
    navigate,
    hasPermission,
  } = useDashboardListPage();

  return (
    <AuthLayout permission="dashboard:canView" breadcrumb={breadcrumbs.dashboardList} >
      <Section>
        <PageHeader
          title="Tableaux de bord"
          actions={
            hasPermission("dashboard:canCreate") && (
              <Link
                to={ROUTES.createDashboard}
                className="w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
              >
                Nouveau tableau de bord
              </Link>
            )
          }
        />
        <DataTable
          searchable={true}
          paginable={true}
          rowPerPage={5}
          columns={columns}
          data={dashboards}
          loading={isLoading}
          emptyMessage="Aucun dashboard pour l'instant."
          onClickItem={(row) => navigate(`/dashboards/${row.id}`)}
          actionsColumn={{
            key: "actions",
            label: "",
            render: (row: Dashboard) => (
              <div className="flex gap-2">
                {hasPermission("dashboard:canView") && (
                  <Button
                    color="gray"
                    size="sm"
                    variant="outline"
                    title="Ouvrir le dashboard"
                    className=" w-max border-none! bg-transparent! hover:bg-gray-100! dark:hover:bg-gray-800!"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboards/${row.id}`);
                    }}
                  >
                    <EyeIcon className="w-4 h-4 ml-1 inline" />
                  </Button>
                )}
                {hasPermission("dashboard:canDelete") && (
                  <Button
                    color="red"
                    size="sm"
                    variant="outline"
                    title="Supprimer le dashboard"
                    className=" w-max border-none! bg-transparent! hover:bg-red-100! dark:hover:bg-red-900!"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDashboard(row);
                      setModalOpen(true);
                    }}
                  >
                    Supprimer
                  </Button>
                )}
              </div>
            ),
          }}
        />
      </Section>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedDashboard(null);
        }}
        title="Supprimer le dashboard"
        size="sm"
        footer={null}
      >
        <div className="space-y-8 py-2">
          <div className="text-gray-700 dark:text-gray-300  text-center">
            Voulez-vous vraiment supprimer ce dashboard&nbsp;?
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              color="gray"
              variant="outline"
              onClick={() => {
                setModalOpen(false);
                setSelectedDashboard(null);
              }}
              disabled={deleteLoading}
            >
              Annuler
            </Button>
            <Button color="red" onClick={handleDelete} loading={deleteLoading}>
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </AuthLayout>
  );
}
