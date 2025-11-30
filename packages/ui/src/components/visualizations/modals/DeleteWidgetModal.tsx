import { Button, Modal } from "@datavise/ui";
import type { Widget } from "@domain/entities/Widget.entity";
import { TrashIcon } from "@heroicons/react/24/outline";

export function DeleteWidgetModal({
  open,
  onClose,
  onDelete,
  loading,
  widget,
}: {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  loading: boolean;
  widget: Widget | null;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Supprimer le widget" size="sm">
      <div className="mb-4 flex flex-col items-center gap-4">
        <TrashIcon className="h-6 w-6 text-red-600" />
        <p className="text-center text-sm text-gray-700 dark:text-gray-300">
          Voulez-vous vraiment supprimer la visualisation
          <span className="font-semibold"> {widget?.title} </span> ?
        </p>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Cette action est irréversible.
        </p>
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          className="w-max!"
          variant="outline"
          color="gray" onClick={onClose}>
          Annuler
        </Button>
        <Button
          color="red"
          className=" w-max!"
          onClick={onDelete}
          loading={loading}
          disabled={loading}
        >
          Supprimer
        </Button>
      </div>
    </Modal>
  );
}
