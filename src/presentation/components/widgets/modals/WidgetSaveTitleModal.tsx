import Modal from "@/presentation/components/shared/Modal";
import InputField from "@/presentation/components/shared/forms/InputField";
import Button from "@/presentation/components/shared/forms/Button";
import CheckboxField from "@/presentation/components/shared/forms/CheckboxField";


export interface WidgetSaveTitleModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  setTitle: (t: string) => void;
  error: string;
  setError: (e: string) => void;
  onConfirm: () => void;
  loading: boolean;
  visibility: "public" | "private";
  setVisibility: (p: "public" | "private") => void;
}

export default function WidgetSaveTitleModal({
  open,
  onClose,
  title,
  setTitle,
  error,
  setError,
  onConfirm,
  loading,
  visibility,
  setVisibility,
}: WidgetSaveTitleModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Enregistrer la visualisation"
      size="sm"
      footer={null}
    >
      <div className="space-y-4">
        <InputField
          label="Titre du widget"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
          error={error}
          autoFocus
          required
        />

        <div className="flex items-center gap-2">
          <CheckboxField
            label="Rendre le widget privé"
            checked={visibility == "private"}
            onChange={(val) => setVisibility(val ? "private" : "public")}
            name="private-widget"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button color="gray" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button color="indigo" onClick={onConfirm} loading={loading}>
            Confirmer
          </Button>
        </div>
      </div>
    </Modal>
  );
}
