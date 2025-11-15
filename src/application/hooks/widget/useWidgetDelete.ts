import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteWidgetUseCase } from "@domain/use-cases/widget/DeleteWidget.usecase";
import { WidgetRepository } from "@infrastructure/repositories/WidgetRepository";
import { useNotificationStore } from "@store/notification";

const widgetRepository = new WidgetRepository();
const deleteWidgetUseCase = new DeleteWidgetUseCase(widgetRepository);

export function useWidgetDelete() {
    const queryClient = useQueryClient();
    const showNotification = useNotificationStore((s) => s.showNotification);

    const mutation = useMutation({
        mutationFn: (widgetId: string) => deleteWidgetUseCase.execute(widgetId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["widgets"] });
            showNotification({
                open: true,
                type: "success",
                title: "Succès",
                description: "Widget supprimé avec succès",
            });
        },
        onError: (error: Error) => {
            showNotification({
                open: true,
                type: "error",
                title: "Erreur",
                description: error.message || "Erreur lors de la suppression du widget",
            });
        },
    });

    return {
        deleteWidget: mutation.mutate,
        isDeleting: mutation.isPending,
    };
}
