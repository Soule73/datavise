import React, { type ReactNode } from "react";
import DashboardSharePopover from "@/presentation/pages/dashboard/components/DashboardSharePopover";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useDashboardUIStore } from "@/core/store/useDashboardUIStore";
import { useDashboardShareStore } from "@/core/store/useDashboardShareStore";
import { useUserStore } from "@/core/store/user";
import { Button } from "@datavise/ui";

export interface DashboardHeaderProps {
  isCreate: boolean;
  openAddWidgetModal: (e: React.MouseEvent) => void;
  handleSave: () => void;
  handleCancelEdit: () => void;
  handleEnableShare?: () => void;
  handleDisableShare?: () => void;
  children?: ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isCreate,
  openAddWidgetModal,
  handleSave,
  handleCancelEdit,
  handleEnableShare,
  handleDisableShare,
  children,
}) => {
  const editMode = useDashboardUIStore((s) => s.editMode);
  const setEditMode = useDashboardUIStore((s) => s.setEditMode);
  const saving = useDashboardUIStore((s) => s.saving);
  const setExportPDFModalOpen = useDashboardUIStore((s) => s.setExportPDFModalOpen);

  const shareId = useDashboardShareStore((s) => s.shareId);
  const isEnabling = useDashboardShareStore((s) => s.isEnabling);
  const isDisabling = useDashboardShareStore((s) => s.isDisabling);
  const shareError = useDashboardShareStore((s) => s.shareError);
  const getShareLink = useDashboardShareStore((s) => s.getShareLink);

  const hasPermission = useUserStore((s) => s.hasPermission);

  const canUpdateDashboard = hasPermission("dashboard:canUpdate");
  const canCreateWidget = hasPermission("widget:canCreate");

  const shareLink = getShareLink(window.location.origin);
  const shareLoading = isEnabling || isDisabling;

  const handleCopyShareLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
    }
  };

  const handleExportPDF = () => {
    setExportPDFModalOpen(true);
  };

  const renderEditActions = () => (
    <div className="hidden md:flex items-center gap-4">
      {canCreateWidget && (
        <Button
          color="indigo"
          size="sm"
          variant="outline"
          className="border-none! min-w-max!"
          onClick={openAddWidgetModal}
        >
          Ajouter un widget
        </Button>
      )}
      {canUpdateDashboard && (
        <Button
          color="indigo"
          size="sm"
          variant="solid"
          className="border-none! min-w-max!"
          onClick={(e) => {
            e.preventDefault();
            handleSave();

          }}
        >
          {saving ? "Sauvegarde…" : "Sauvegarder"}
        </Button>
      )}
      {editMode && !isCreate && canUpdateDashboard && (
        <Button
          variant="outline"
          color="gray"
          size="sm"
          className="border-none! min-w-max!"
          onClick={(e) => {
            e.preventDefault();
            handleCancelEdit();
          }}
        >
          Annuler
        </Button>
      )}
    </div>
  );


  const renderViewActions = () => (
    <div className="flex items-center gap-4">
      {canUpdateDashboard && (
        <Button
          color="indigo"
          size="sm"
          variant="outline"
          className="border-none! min-w-max!"
          onClick={(e) => {
            e.preventDefault();
            setEditMode(true);
          }}
        >
          Modifier
        </Button>
      )}

      {canUpdateDashboard && (
        <DashboardSharePopover
          isShareEnabled={!!shareId}
          shareLoading={shareLoading}
          shareError={shareError}
          shareLink={shareLink}
          currentShareId={shareId}
          handleEnableShare={handleEnableShare}
          handleDisableShare={handleDisableShare}
          handleCopyShareLink={handleCopyShareLink}
        />
      )}

      <Button
        variant="outline"
        size="sm"
        color="gray"
        className="border-none! min-w-max!"
        onClick={handleExportPDF}
      >
        <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
        Exporter PDF
      </Button>
    </div>
  );

  let actionGroup = null;

  if (editMode || isCreate) {
    actionGroup = renderEditActions();
  } else if (!isCreate) {
    actionGroup = renderViewActions();
  }

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 justify-between items-start md:items-center mb-2">
      {actionGroup}
      {children}
    </div>
  );
};

export default DashboardHeader;
