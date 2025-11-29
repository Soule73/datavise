import { useDashboardActions } from "@/application/hooks/dashboard/useDashboardActions";
import { useDashboardShare } from "@/application/hooks/dashboard/useDashboardShare";
import { useDashboardDataLoader } from "@/application/hooks/dashboard/useDashboardDataLoader";
import { useDashboardUIStore } from "@/core/store/useDashboardUIStore";
import { useDashboardConfigStore } from "@/core/store/useDashboardConfigStore";
import { useDashboardStore } from "@/core/store/dashboard";
import breadcrumbs from "@/core/utils/breadcrumbs";
import AuthLayout from "@/presentation/layout/AuthLayout";
import { WidgetSelectModal } from "@/presentation/pages/widget/components";
import DashboardConfigFields from "./components/DashboardConfigFields";
import DashboardGrid from "./components/DashboardGrid";
import DashboardHeader from "./components/DashboardHeader";
import { EmptyDashboard } from "./components/EmptyDashboard";
import ExportPDFModal from "./components/ExportPDFModal";
import { DashboardSaveModal } from "./components/DashboardSaveModal";

export default function DashboardPage() {
  const {
    sources,
    layout = [],
    handleAddWidget,
    handleSwapLayout,
    setLocalTitle,
    saveModalOpen,
    setSaveModalOpen,
    pendingTitle,
    setPendingTitle,
    handleSave,
    handleConfirmSave,
    handleCancelEdit,
    isCreate,
    handleSaveConfig,
    effectiveFrom,
    effectiveTo,
    refreshMs,
    forceRefreshKey,
    visibility,
    setVisibility,
    hasPermission,
    openAddWidgetModal,
    handleExportPDF: handleExportPDFConfirm,
    dashboardId,
  } = useDashboardActions();

  const editMode = useDashboardUIStore((s) => s.editMode);
  const selectOpen = useDashboardUIStore((s) => s.selectOpen);
  const setSelectOpen = useDashboardUIStore((s) => s.setSelectOpen);
  const saving = useDashboardUIStore((s) => s.saving);
  const exportPDFModalOpen = useDashboardUIStore((s) => s.exportPDFModalOpen);
  const setExportPDFModalOpen = useDashboardUIStore((s) => s.setExportPDFModalOpen);

  const incrementForceRefreshKey = useDashboardConfigStore((s) => s.incrementForceRefreshKey);

  const hasUnsavedChanges = useDashboardStore((s) => s.hasUnsavedChanges);

  const {
    shareId,
    enableShare,
    disableShare,
  } = useDashboardShare(dashboardId || "");

  const pageSize = useDashboardConfigStore((s) => s.pageSize);

  useDashboardDataLoader({
    layout,
    timeRangeFrom: effectiveFrom,
    timeRangeTo: effectiveTo,
    refreshMs,
    forceRefreshKey,
    shareId: shareId || undefined,
    pageSize,
  });

  const canUpdate = hasPermission("dashboard:canUpdate");
  const isEditing = editMode || isCreate;
  const isEmpty = layout.length === 0;

  const gridProps = {
    layout,
    sources: sources ?? [],
    handleAddWidget: openAddWidgetModal,
    hasUnsavedChanges,
  };
  const swapHandler = isEditing ? handleSwapLayout : undefined;

  return (
    <AuthLayout permission="dashboard:canView" breadcrumb={breadcrumbs.showDashboard(pendingTitle)} >
      <div className="px-4 md:px-8 pb-8 pt-4 md:pt-6">
        <WidgetSelectModal
          open={selectOpen}
          onClose={() => setSelectOpen(false)}
          onSelect={handleAddWidget}
        />

        <DashboardSaveModal
          saving={saving}
          saveModalOpen={saveModalOpen}
          setSaveModalOpen={setSaveModalOpen}
          pendingTitle={pendingTitle}
          setPendingTitle={setPendingTitle}
          handleConfirmSave={handleConfirmSave}
          isCreate={isCreate}
          setLocalTitle={setLocalTitle}
          visibility={visibility}
          setVisibility={setVisibility}
        />

        <DashboardHeader
          isCreate={isCreate}
          openAddWidgetModal={openAddWidgetModal}
          handleSave={handleSave}
          handleCancelEdit={handleCancelEdit}
          handleEnableShare={() => enableShare()}
          handleDisableShare={() => disableShare()}
        >
          {canUpdate && !isCreate && (
            <DashboardConfigFields
              onSave={handleSaveConfig}
              onForceRefresh={() => incrementForceRefreshKey()}
            />
          )}
        </DashboardHeader>

        <ExportPDFModal
          open={exportPDFModalOpen}
          onClose={() => setExportPDFModalOpen(false)}
          onExport={handleExportPDFConfirm}
        />

        {isEmpty ? (
          <EmptyDashboard />
        ) : (
          <DashboardGrid
            {...gridProps}
            editMode={isEditing}
            onSwapLayout={swapHandler}
          />
        )}
      </div>
    </AuthLayout>
  );
}
