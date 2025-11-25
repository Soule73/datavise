import { useWidgetEdit } from "@/application/hooks/widget/useWidgetActions";
import { useEffect } from "react";
import AuthLayout from "@/presentation/components/layouts/AuthLayout";
import breadcrumbs from "@/core/utils/breadcrumbs";
import { useWidgetFormStore } from "@/core/store/widgetFormStore";
import WidgetFormLayout from "@/presentation/components/widgets/layouts/WidgetFormLayout";

export default function WidgetEditPage() {
  const { loading, error, widget, formReady, loadWidget, handleConfirmSave } =
    useWidgetEdit();

  const setShowSaveModal = useWidgetFormStore((s) => s.setShowSaveModal);

  useEffect(() => {
    loadWidget();
  }, []);

  if (loading || !formReady) return <div>Chargement…</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!widget) return null;

  const handleSave = () => {
    setShowSaveModal(true);
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <AuthLayout permission="widget:canUpdate"
      breadcrumb={breadcrumbs.widgetEdit(widget.title)}
    >
      <WidgetFormLayout
        title="Modifier la visualisation"
        isLoading={loading}
        onSave={handleSave}
        onCancel={handleCancel}
        saveButtonText="Enregistrer"
        showCancelButton={true}
        onModalConfirm={handleConfirmSave}
      />
    </AuthLayout>
  );
}
