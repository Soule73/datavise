import Button from "@/presentation/components/shared/forms/Button";
import Modal from "@/presentation/components/shared/Modal";
import InputField from "@/presentation/components/shared/forms/InputField";
import CheckboxField from "@/presentation/components/shared/forms/CheckboxField";

interface SaveModalProps {
  saving: boolean;
  saveModalOpen: boolean;
  setSaveModalOpen: (open: boolean) => void;
  pendingTitle: string;
  setPendingTitle: (title: string) => void;
  isCreate: boolean;
  setLocalTitle?: (title: string) => void;
  visibility: "public" | "private";
  setVisibility: (visibility: "public" | "private") => void;
  handleConfirmSave: (visibility: "public" | "private") => void;
}


export function DashboardSaveModal(props: SaveModalProps) {
  const {
    saving,
    saveModalOpen,
    setSaveModalOpen,
    pendingTitle,
    setPendingTitle,
    handleConfirmSave,
    isCreate,
    setLocalTitle,
    visibility,
    setVisibility,
  } = props;
  return (
    <Modal
      open={saveModalOpen}
      onClose={() => setSaveModalOpen(false)}
      title="Sauvegarder"
    >
      <div className="space-y-4">
        <InputField
          label="Titre du tableau de bord"
          value={pendingTitle}
          onChange={(e) => {
            setPendingTitle(e.target.value);
            if (isCreate && setLocalTitle) setLocalTitle(e.target.value);
          }}
          required
          autoFocus
        />
        <CheckboxField
          label="Privé(visble uniquement par vous)"
          checked={visibility === "private"}
          onChange={(checked) => setVisibility(checked ? "private" : "public")}
          name="dashboard-visibility"
        />
        <div className="flex gap-2 justify-end">
          <Button
            color="gray"
            variant="outline"
            disabled={saving}
            onClick={() => setSaveModalOpen(false)}
          >
            Annuler
          </Button>
          <Button
            color="green"
            className=" "
            onClick={() => handleConfirmSave(visibility)}
            disabled={saving || !pendingTitle.trim()}
          >
            {saving ? "Savegarde..." : "Confirmer"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
