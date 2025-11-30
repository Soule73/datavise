import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDataSourceList } from "./useDataSourceList";
import { useDataSourceDelete } from "./useDataSourceDelete";
import { useNotificationStore } from "@stores/notification";
import { useUserStore } from "@stores/user";
import type { DataSource } from "@domain/entities/DataSource.entity";
import { DataSourceRepository } from "@/infrastructure/repositories/DataSourceRepository";

const dataSourceRepository = new DataSourceRepository();

export function useDataSourceListPage() {
    const navigate = useNavigate();
    const showNotification = useNotificationStore((s) => s.showNotification);
    const hasPermission = useUserStore((s) => s.hasPermission);

    const { dataSources, isLoading, refetch } = useDataSourceList();
    const { deleteDataSource, isDeleting } = useDataSourceDelete();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
    const [modalType, setModalType] = useState<"delete" | "edit" | null>(null);

    const handleDownload = async (filename: string | undefined, displayName?: string) => {
        if (!filename) {
            showNotification({
                open: true,
                type: "error",
                title: "Téléchargement échoué",
                description: "Aucun fichier à télécharger.",
            });
            return;
        }

        const cleanFilename = filename.startsWith("uploads/")
            ? filename.replace(/^uploads\//, "")
            : filename;

        try {
            const blob = await dataSourceRepository.downloadFile(cleanFilename);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = displayName || cleanFilename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Erreur lors du téléchargement du fichier:", e);
            showNotification({
                open: true,
                type: "error",
                title: "Téléchargement échoué",
                description: "Erreur lors du téléchargement du fichier.",
            });
        }
    };

    const handleConfirmDelete = () => {
        if (!selectedSource) return;

        deleteDataSource(selectedSource.id, {
            onSuccess: () => {
                setModalOpen(false);
                setSelectedSource(null);
            },
            onError: () => {
                setModalOpen(false);
                setSelectedSource(null);
            },
        });
    };

    return {
        sources: dataSources,
        isLoading,
        modalOpen,
        setModalOpen,
        selectedSource,
        setSelectedSource,
        modalType,
        setModalType,
        isDeleting,
        hasPermission,
        handleDownload,
        handleConfirmDelete,
        navigate,
        refetch,
    };
}
