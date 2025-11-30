import { useQuery } from "@tanstack/react-query";
import { DashboardRepository } from "@/infrastructure/repositories/DashboardRepository";
import { useDataSourceList } from "../datasource/useDataSourceList";
import type { Dashboard } from "@/domain/entities/Dashboard.entity";

const dashboardRepository = new DashboardRepository();

export function useDashboardShareView(shareId?: string) {
    const {
        data: dashboard,
        isLoading: loading,
        error: dashboardError,
    } = useQuery<Dashboard | null>({
        queryKey: ["sharedDashboard", shareId],
        queryFn: () => dashboardRepository.findByShareId(shareId!),
        enabled: !!shareId,
    });

    const { dataSources: sources, isLoading: loadingSources, error: sourcesError } = useDataSourceList();

    const error = dashboardError || sourcesError;

    return {
        dashboard,
        sources,
        loading: loading || loadingSources,
        error: error
            ? (error as any)?.response?.status === 404
                ? "Ce tableau de bord n'est pas disponible ou le lien a été désactivé."
                : "Erreur lors du chargement du dashboard."
            : null,
        errorCode: (error as any)?.response?.status || 500,
    };
}
