import { useWidgetCreate } from "@/application/hooks/widget/useWidgetActions";
import { useSearchParams } from "react-router-dom";
import type { WidgetType } from "@/domain/value-objects";
import AuthLayout from "@/presentation/components/shared/layouts/AuthLayout";
import breadcrumbs from "@/core/utils/breadcrumbs";
import { useWidgetFormStore } from "@/core/store/widgetFormStore";
import WidgetFormLayout from "@/presentation/components/widgets/layouts/WidgetFormLayout";

export default function WidgetCreatePage() {
  const [searchParams] = useSearchParams();
  const sourceIdFromUrl = searchParams.get("sourceId") || "";
  const typeFromUrl = (searchParams.get("type") as WidgetType) || "bar";

  const { createMutation, handleCreate } = useWidgetCreate({
    sourceId: sourceIdFromUrl,
    type: typeFromUrl,
  });

  const setShowSaveModal = useWidgetFormStore((s) => s.setShowSaveModal);

  const handleSave = () => {
    setShowSaveModal(true);
  };

  return (
    <AuthLayout permission="widget:canCreate"
      breadcrumb={breadcrumbs.widgetCreate}
    >
      <WidgetFormLayout
        title="Créer une visualisation"
        isLoading={createMutation.isPending}
        onSave={handleSave}
        saveButtonText="Enregistrer"
        showCancelButton={false}
        onModalConfirm={handleCreate}
      />
    </AuthLayout>
  );
}
