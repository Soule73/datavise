import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardRepository } from "@/infrastructure/repositories/DashboardRepository";
import { DeleteDashboardUseCase } from "@/domain/use-cases/dashboard/DeleteDashboard.usecase";
import { useDashboardList } from "./useDashboardList";
import { useUserStore } from "@/core/store/user";
import { useNotificationStore } from "@/core/store/notification";
import { useNavigate } from "react-router-dom";
import type { Dashboard } from "@/domain/entities/Dashboard.entity";

const dashboardRepository = new DashboardRepository();
const deleteDashboardUseCase = new DeleteDashboardUseCase(dashboardRepository);

export function useDashboardListPage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const hasPermission = useUserStore((s) => s.hasPermission);
    const showNotification = useNotificationStore((s) => s.showNotification);

    const { dashboards, isLoading } = useDashboardList();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);

    const deleteMutation = useMutation({
        mutationFn: (dashboardId: string) => deleteDashboardUseCase.execute(dashboardId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboards"] });
            showNotification({
                open: true,
                type: "success",
                title: "Dashboard supprimé",
                description: "Le dashboard a bien été supprimé.",
            });
            setModalOpen(false);
            setSelectedDashboard(null);
        },
        onError: (error: Error) => {
            showNotification({
                open: true,
                type: "error",
                title: "Erreur de suppression",
                description: error.message || "Une erreur est survenue lors de la suppression du dashboard.",
            });
        },
    });

    const handleDelete = useCallback(async () => {
        if (!selectedDashboard) return;
        deleteMutation.mutate(selectedDashboard.id);
    }, [selectedDashboard, deleteMutation]);

    const columns = [
        { key: "title", label: "Titre" },
        {
            key: "widgets",
            label: "Widgets",
            render: (row: Dashboard) => row.layout?.length || 0,
        },
    ];

    return {
        dashboards,
        isLoading,
        modalOpen,
        setModalOpen,
        selectedDashboard,
        setSelectedDashboard,
        deleteLoading: deleteMutation.isPending,
        handleDelete,
        columns,
        navigate,
        hasPermission,
    };
}
