import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WidgetRepository } from "@/infrastructure/repositories/WidgetRepository";
import { DeleteWidgetUseCase } from "@/domain/use-cases/widget/DeleteWidget.usecase";
import { PublishWidgetUseCase } from "@/domain/use-cases/widget/PublishWidget.usecase";
import { useWidgetList } from "./useWidgetList";
import { useDataSourceList } from "../datasource/useDataSourceList";
import { useUserStore } from "@/core/store/user";
import { useNotificationStore } from "@/core/store/notification";
import { WIDGETS } from "@/core/config/visualizations";
import type { Widget } from "@/domain/entities/Widget.entity";

const widgetRepository = new WidgetRepository();
const deleteWidgetUseCase = new DeleteWidgetUseCase(widgetRepository);
const publishWidgetUseCase = new PublishWidgetUseCase(widgetRepository);

export function useWidgetListPage() {
    const queryClient = useQueryClient();
    const hasPermission = useUserStore((s) => s.hasPermission);
    const showNotification = useNotificationStore((s) => s.showNotification);

    const { widgets, isLoading: isLoadingWidgets } = useWidgetList();
    const { dataSources } = useDataSourceList();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState<Widget | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);

    const tableData = useMemo(() => {
        return widgets.map((widget) => {
            const widgetDef = WIDGETS[widget.type as keyof typeof WIDGETS];
            const source = dataSources.find((s) => s.id === widget.dataSourceId);

            return Object.assign(widget, {
                typeLabel: widgetDef?.label || widget.type,
                dataSourceId: source?.name || widget.dataSourceId,
            });
        });
    }, [widgets, dataSources]);

    const deleteMutation = useMutation({
        mutationFn: (widgetId: string) => deleteWidgetUseCase.execute(widgetId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["widgets"] });
            showNotification({
                open: true,
                type: "success",
                title: "Succès",
                description: "Widget supprimé avec succès",
            });
            setDeleteModalOpen(false);
            setSelectedWidget(null);
        },
        onError: (error: Error) => {
            showNotification({
                open: true,
                type: "error",
                title: "Erreur",
                description: error.message || "Erreur lors de la suppression du widget",
            });
            setDeleteModalOpen(false);
            setSelectedWidget(null);
        },
    });

    const publishMutation = useMutation({
        mutationFn: (widgetId: string) => publishWidgetUseCase.execute(widgetId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["widgets"] });
            showNotification({
                open: true,
                type: "success",
                title: "Succès",
                description: "Widget publié avec succès",
            });
        },
        onError: (error: Error) => {
            showNotification({
                open: true,
                type: "error",
                title: "Erreur",
                description: error.message || "Erreur lors de la publication du widget",
            });
        },
    });

    return {
        tableData,
        isLoading: isLoadingWidgets,
        modalOpen,
        setModalOpen,
        selectedConfig,
        setSelectedConfig,
        deleteModalOpen,
        setDeleteModalOpen,
        selectedWidget,
        setSelectedWidget,
        deleteMutation,
        publishMutation,
        hasPermission,
    };
}
