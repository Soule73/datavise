import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShareDashboardUseCase } from "@/domain/use-cases/dashboard/ShareDashboard.usecase";
import { DashboardRepository } from "@/infrastructure/repositories/DashboardRepository";
import { useNotificationStore } from "@store/notification";

const dashboardRepository = new DashboardRepository();
const shareDashboardUseCase = new ShareDashboardUseCase(dashboardRepository);

export function useDashboardShare(dashboardId: string) {
    const queryClient = useQueryClient();
    const showNotification = useNotificationStore((s) => s.showNotification);
    const [shareId, setShareId] = useState<string | null>(null);

    const { mutate: enableShare, isPending: isEnabling } = useMutation({
        mutationFn: () => shareDashboardUseCase.enableShare(dashboardId),
        onSuccess: (data) => {
            setShareId(data.shareId);
            queryClient.invalidateQueries({ queryKey: ["dashboard", dashboardId] });
            showNotification({
                type: "success",
                title: "Partage activé",
                description: "Le dashboard est maintenant partageable",
                open: true,
            });
        },
        onError: (error: Error) => {
            showNotification({
                type: "error",
                title: "Erreur",
                description: error.message || "Erreur lors de l'activation du partage",
                open: true,
            });
        },
    });

    const { mutate: disableShare, isPending: isDisabling } = useMutation({
        mutationFn: () => shareDashboardUseCase.disableShare(dashboardId),
        onSuccess: () => {
            setShareId(null);
            queryClient.invalidateQueries({ queryKey: ["dashboard", dashboardId] });
            showNotification({
                type: "success",
                title: "Partage désactivé",
                description: "Le dashboard n'est plus partageable",
                open: true,
            });
        },
        onError: (error: Error) => {
            showNotification({
                type: "error",
                title: "Erreur",
                description: error.message || "Erreur lors de la désactivation du partage",
                open: true,
            });
        },
    });

    return {
        shareId,
        enableShare,
        disableShare,
        isEnabling,
        isDisabling,
    };
}
