import React, { useState } from "react";
import Modal from "@/presentation/components/shared/Modal";
import SelectField from "@/presentation/components/shared/SelectField";
import Button from "@/presentation/components/shared/forms/Button";


interface ExportPDFModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (options: { orientation: "portrait" | "landscape" }) => void;
}

const ExportPDFModal: React.FC<ExportPDFModalProps> = ({
  open,
  onClose,
  onExport,
}) => {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "landscape"
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Exporter le dashboard en PDF"
      size="sm"
    >
      <div className="space-y-4">
        <div>
          <SelectField
            id="pdf-orientation"
            label="Orientation"
            value={orientation}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e: React.ChangeEvent<any>) => setOrientation(e.target.value as "portrait" | "landscape")}
            options={[
              { value: "landscape", label: "Paysage" },
              { value: "portrait", label: "Portrait" },
            ]}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button color="gray" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button
          color="indigo"
          variant="solid"
          onClick={() => onExport({ orientation })}
        >
          Exporter
        </Button>
      </div>
    </Modal>
  );
};

export default ExportPDFModal;
