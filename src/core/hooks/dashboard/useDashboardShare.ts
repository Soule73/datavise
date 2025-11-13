/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useSharedDashboardQuery,
  useSharedDashboardSourcesQuery,
} from "@repositories/dashboards";

export function useDashboardShare(shareId?: string) {
  const {
    data: dashboard,
    isLoading: loading,
    error: dashboardError,
  } = useSharedDashboardQuery(shareId);
  const {
    data: sources = [],
    isLoading: loadingSources,
    error: sourcesError,
  } = useSharedDashboardSourcesQuery(shareId);

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
