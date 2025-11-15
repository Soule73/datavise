import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteDashboardUseCase } from "@/domain/use-cases/dashboard/DeleteDashboard.usecase";
import { DashboardRepository } from "@/infrastructure/repositories/DashboardRepository";
import { useNotificationStore } from "@store/notification";

const dashboardRepository = new DashboardRepository();
const deleteDashboardUseCase = new DeleteDashboardUseCase(dashboardRepository);

export function useDashboardDelete() {
    const queryClient = useQueryClient();
    const showNotification = useNotificationStore((s) => s.showNotification);

    const { mutate: deleteDashboard, isPending: isDeleting } = useMutation({
        mutationFn: (id: string) => deleteDashboardUseCase.execute(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboards"] });
            showNotification({
                type: "success",
                title: "Dashboard supprimé",
                description: "Le dashboard a été supprimé avec succès",
                open: true,
            });
        },
        onError: (error: Error) => {
            showNotification({
                type: "error",
                title: "Erreur",
                description: error.message || "Erreur lors de la suppression du dashboard",
                open: true,
            });
        },
    });

    return {
        deleteDashboard,
        isDeleting,
    };
}
