import { useDataSourceListPage } from "@/application/hooks/datasource/useDataSourceListPage";
import { ROUTES } from "@/core/constants/routes";
import { Link } from "react-router-dom";
import { DeleteSourceForm } from "./components/DeleteSourceForm";
import type { DataSource } from "@/domain/entities/DataSource.entity";
import { DocumentTextIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";
import breadcrumbs from "@/core/utils/breadcrumbs";
import { Badge, Button, DataTable, Modal, PageHeader, Section } from "@datavise/ui";
import AuthLayout from "@/presentation/layout/AuthLayout";

export default function SourcesPage() {
  const {
    sources,
    isLoading,
    modalOpen,
    setModalOpen,
    selectedSource,
    setSelectedSource,
    modalType,
    setModalType,
    isDeleting,
    hasPermission,
    handleDownload,
    handleConfirmDelete,
    navigate,
  } = useDataSourceListPage();

  const columns = useMemo(
    () => [
      {
        key: "icon",
        label: " ",
        render: (row: DataSource) => {
          if (row.type === "csv") {
            return (
              <span className="flex items-center justify-center w-8 h-8">
                <TableCellsIcon className="w-6 h-6 text-indigo-500" />
              </span>
            );
          }
          if (row.type === "json" || row.type === "elasticsearch") {
            return (
              <span className="flex items-center justify-center w-8 h-8">
                <DocumentTextIcon className="w-6 h-6 text-indigo-500" />
              </span>
            );
          }

          return <span className="w-8 h-8" />;
        },
      },
      {
        key: "name",
        label: "Nom",
        render: (row: DataSource) => (
          <span className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {row.name}
            {row.isUsed && <Badge color="yellow">utilisée</Badge>}
          </span>
        ),
      },
      {
        key: "type",
        label: "Type",
      },
      {
        key: "endpoint",
        label: "Endpoint",
        render: (row: DataSource) =>
          row.endpoint ? (
            <span className="font-mono text-xs break-all">{row.endpoint}</span>
          ) : row.filePath ? (
            <Button
              color="indigo"
              size="sm"
              variant="outline"
              title="Télécharger le fichier"
              className=" w-max border-none!"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(row.filePath, row.name + ".csv");
              }}
            >
              Télécharger le fichier
            </Button>
          ) : (
            <span className="text-gray-500 italic">Non applicable</span>
          ),
      },
    ],
    [handleDownload]
  );

  return (
    <AuthLayout permission="datasource:canView"
      breadcrumb={breadcrumbs.datasourceList}
    >
      <Section>
        <PageHeader
          title="Sources de données"
          actions={
            hasPermission("datasource:canCreate") && (
              <Link
                to={ROUTES.addSource}
                className="w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
              >
                Ajouter une source
              </Link>
            )
          }
        />
        <DataTable
          columns={columns}
          data={sources}
          loading={isLoading}
          emptyMessage="Aucune source enregistrée."
          actionsColumn={{
            key: "empty",
            label: "",
            render: (row: DataSource) => (
              <div className="flex gap-2">
                {hasPermission("datasource:canUpdate") && (
                  <Button
                    color="indigo"
                    size="sm"
                    variant="outline"
                    title="Modfier la source"
                    className=" w-max border-none!"
                    onClick={() => {
                      navigate(`/sources/edit/${row.id}`);
                    }}
                  >
                    Modifier
                  </Button>
                )}
                {hasPermission("datasource:canDelete") && (
                  <Button
                    color="red"
                    size="sm"
                    variant="outline"
                    className="w-max border-none! "
                    title={
                      row.isUsed
                        ? "Impossible de supprimer une source utilisée"
                        : "Supprimer la source"
                    }
                    onClick={() => {
                      setSelectedSource(row);
                      setModalType("delete");
                      setModalOpen(true);
                    }}
                    disabled={row.isUsed}
                  >
                    Supprimer
                  </Button>
                )}
              </div>
            ),
          }}
        />
        <Modal
          open={modalOpen && modalType === "delete"}
          onClose={() => {
            setModalOpen(false);
            setSelectedSource(null);
          }}
          title={"Supprimer la source"}
          size="sm"
          footer={null}
        >
          {modalType === "delete" && selectedSource && (
            <DeleteSourceForm
              source={selectedSource}
              onDelete={handleConfirmDelete}
              onCancel={() => setModalOpen(false)}
              loading={isDeleting}
            />
          )}
        </Modal>
      </Section>
    </AuthLayout>
  );
}
