import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ListDashboardsUseCase } from "@domain/use-cases/dashboard/ListDashboards.usecase";
import { DashboardRepository } from "@/infrastructure/repositories/DashboardRepository";
import type { Dashboard } from "@domain/entities/Dashboard.entity";
import type { DashboardFilters } from "@domain/ports/repositories/IDashboardRepository";

const dashboardRepository = new DashboardRepository();
const listDashboardsUseCase = new ListDashboardsUseCase(dashboardRepository);

export function useDashboardList(filters?: DashboardFilters) {
    const queryClient = useQueryClient();

    const { data: dashboards, isLoading, error } = useQuery<Dashboard[]>({
        queryKey: ["dashboards", filters],
        queryFn: () => listDashboardsUseCase.execute(filters),
        staleTime: 1000 * 60 * 5,
    });

    const refetch = () => {
        queryClient.invalidateQueries({ queryKey: ["dashboards"] });
    };

    return {
        dashboards: dashboards ?? [],
        isLoading,
        error,
        refetch,
    };
}
