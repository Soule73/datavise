import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteDataSourceUseCase } from "@domain/use-cases/datasource/DeleteDataSource.usecase";
import { DataSourceRepository } from "@/infrastructure/repositories/DataSourceRepository";
import { useNotificationStore } from "@stores/notification";

const dataSourceRepository = new DataSourceRepository();
const deleteDataSourceUseCase = new DeleteDataSourceUseCase(dataSourceRepository);

export function useDataSourceDelete() {
    const queryClient = useQueryClient();
    const showNotification = useNotificationStore((s) => s.showNotification);

    const { mutate: deleteDataSource, isPending: isDeleting } = useMutation({
        mutationFn: (id: string) => deleteDataSourceUseCase.execute(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dataSources"] });
            showNotification({
                type: "success",
                title: "Source supprimée",
                description: "La source de données a été supprimée avec succès",
                open: true,
            });
        },
        onError: (error: Error) => {
            showNotification({
                type: "error",
                title: "Erreur",
                description: error.message || "Erreur lors de la suppression de la source",
                open: true,
            });
        },
    });

    return {
        deleteDataSource,
        isDeleting,
    };
}
