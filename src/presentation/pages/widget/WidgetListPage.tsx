import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "@/core/constants/routes";
import { useWidgetListPage } from "@hooks/widget/useWidgetListPage";
import { DeleteWidgetModal, WidgetTypeSelectionModal } from "@datavise/ui";
import type { Widget } from "@domain/entities/Widget.entity";
import type { WidgetType } from "@domain/value-objects";
import { useMemo, useState } from "react";
import { WIDGETS } from "@/core/config/visualizations";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useDataSourceList } from "@hooks/datasource/useDataSourceList";
import { Badge, Button, DataTable, Modal, PageHeader, Section } from "@datavise/ui";
import AuthLayout from "@/presentation/layout/AuthLayout";
import breadcrumbs from "@/core/utils/breadcrumbs";

export default function WidgetListPage() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { dataSources: sources } = useDataSourceList();

  const {
    tableData,
    isLoading,
    modalOpen,
    setModalOpen,
    selectedConfig,
    setSelectedConfig,
    deleteModalOpen,
    setDeleteModalOpen,
    selectedWidget,
    setSelectedWidget,
    deleteMutation,
    hasPermission,
  } = useWidgetListPage();

  const handleCreateWidget = (sourceId: string, type: WidgetType) => {
    setShowCreateModal(false);
    navigate(`${ROUTES.createWidget}?sourceId=${sourceId}&type=${type}`);
  };

  const columns = useMemo(
    () => [
      {
        key: "icon",
        label: " ",
        render: (row: Widget) => {
          const widgetDef = WIDGETS[row.type as keyof typeof WIDGETS];
          const Icon = widgetDef?.icon;
          return Icon ? (
            <span className="flex items-center justify-center w-8 h-8">
              <Icon className="w-6 h-6 text-indigo-500" />
            </span>
          ) : (
            <span className="w-8 h-8" />
          );
        },
      },
      {
        key: "title",
        label: "Titre",
        render: (row: Widget) => (
          <span className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {row.title}
            {row.isUsed && <Badge color="yellow">utilisée</Badge>}
          </span>
        ),
      },
      {
        key: "typeLabel",
        label: "Type",
      },
      {
        key: "isGeneratedByAI",
        label: "Généré par IA",
        render: (row: Widget) => (
          row.isGeneratedByAI ? <Badge color="indigo">Oui</Badge> : <Badge color="gray">Non</Badge>
        ),
      },
      {
        key: "dataSourceId",
        label: "Source",
      },
    ],
    []
  );

  return (
    <AuthLayout permission="widget:canView"
      breadcrumb={breadcrumbs.widgetList}
    >
      <Section>
        <PageHeader
          title="Visualisations"
          actions={
            hasPermission("widget:canCreate") && (
              <Button
                color="indigo"
                onClick={() => setShowCreateModal(true)}
                className="w-max"
              >
                Nouvelle visualisation
              </Button>
            )
          }
        />
        <DataTable
          paginable={true}
          searchable={true}
          rowPerPage={5}
          columns={columns}
          data={tableData}
          loading={isLoading}
          emptyMessage="Aucune visualisation."
          actionsColumn={{
            key: "actions",
            label: "Actions",
            render: (row: Widget) => (
              <div className="flex gap-2">
                {hasPermission("widget:canUpdate") && (
                  <Link
                    to={
                      row.id ? ROUTES.editWidget.replace(":id", row.id) : "#"
                    }
                  >
                    <Button
                      color="indigo"
                      size="sm"
                      variant="outline"
                      className=" w-max border-none!"
                      title="Modifier le widget"
                    >
                      Modifier
                    </Button>
                  </Link>
                )}
                <Button
                  color="indigo"
                  size="sm"
                  variant="outline"
                  title="Modfier la source"
                  className=" w-max border-none!"
                  onClick={() => {
                    setSelectedConfig(row);
                    setModalOpen(true);
                  }}
                >
                  Voir la config
                </Button>
                {hasPermission("widget:canDelete") && (
                  <Button
                    color="red"
                    size="sm"
                    variant="outline"
                    className="w-max border-none! "
                    disabled={!!row.isUsed}
                    title={
                      row.isUsed
                        ? "Impossible de supprimer un widget utilisé dans un dashboard"
                        : "Supprimer le widget"
                    }
                    onClick={() => {
                      setSelectedWidget(row);
                      setDeleteModalOpen(true);
                    }}
                  >
                    Supprimer
                  </Button>
                )}
              </div>
            ),
          }}
        />
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Configuration du widget"
          size="2xl"
        >
          <SyntaxHighlighter
            language="json"
            style={okaidia}
            className="text-x config-scrollbar rounded p-2 overflow-y-auto max-h-80"
          >
            {selectedConfig ? JSON.stringify(selectedConfig, null, 2) : ""}
          </SyntaxHighlighter>
        </Modal>
        <DeleteWidgetModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onDelete={() =>
            selectedWidget && deleteMutation.mutate(selectedWidget.id)
          }
          loading={deleteMutation.isPending}
          widget={selectedWidget}
        />

        <WidgetTypeSelectionModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onConfirm={handleCreateWidget}
          sources={sources}
        />
      </Section>
    </AuthLayout>
  );
}
