import type {
    IDashboardRepository,
    DashboardFilters,
    UpdateDashboardPayload,
    ShareDashboardResult,
} from "@domain/ports/repositories/IDashboardRepository";
import type { Dashboard } from "@domain/entities/Dashboard.entity";
import { apiClient } from "../api/client/apiClient";
import { dashboardMapper } from "../mappers/dashboardMapper";
import { DASHBOARD_ENDPOINTS } from "../api/endpoints/dashboard.endpoints";
import type { DashboardDTO } from "../api/dto/DashboardDTO";

export class DashboardRepository implements IDashboardRepository {
    async findAll(filters?: DashboardFilters): Promise<Dashboard[]> {
        const params = new URLSearchParams();

        if (filters?.visibility) {
            params.append("visibility", filters.visibility);
        }
        if (filters?.search) {
            params.append("search", filters.search);
        }
        if (filters?.ownerId) {
            params.append("ownerId", filters.ownerId);
        }

        const url = `${DASHBOARD_ENDPOINTS.list}${params.toString() ? `?${params}` : ""}`;
        const response = await apiClient.get<DashboardDTO[]>(url);

        if (!response.success) {
            throw new Error(response.error?.message || "Erreur lors de la récupération des dashboards");
        }

        return response.data!.map(dashboardMapper.toDomain);
    }

    async findById(id: string): Promise<Dashboard | null> {
        try {
            const response = await apiClient.get<DashboardDTO>(DASHBOARD_ENDPOINTS.byId(id));

            if (!response.success || !response.data) {
                return null;
            }

            return dashboardMapper.toDomain(response.data);
        } catch (error) {
            console.error("Erreur findById dashboard:", error);
            return null;
        }
    }

    async findByShareId(shareId: string): Promise<Dashboard | null> {
        try {
            const response = await apiClient.get<DashboardDTO>(DASHBOARD_ENDPOINTS.byShareId(shareId));

            if (!response.success || !response.data) {
                return null;
            }

            return dashboardMapper.toDomain(response.data);
        } catch (error) {
            console.error("Erreur findByShareId:", error);
            return null;
        }
    }

    async create(
        dashboard: Omit<Dashboard, "id" | "ownerId" | "createdAt" | "updatedAt" | "widgets">
    ): Promise<Dashboard> {
        const payload = {
            title: dashboard.title,
            layout: dashboard.layout,
            visibility: dashboard.visibility,
            timeRange: dashboard.timeRange,
            autoRefreshIntervalValue: dashboard.autoRefreshIntervalValue,
            autoRefreshIntervalUnit: dashboard.autoRefreshIntervalUnit,
        };

        const response = await apiClient.post<DashboardDTO>(DASHBOARD_ENDPOINTS.create, payload);

        if (!response.success || !response.data) {
            throw new Error(response.error?.message || "Erreur lors de la création du dashboard");
        }

        return dashboardMapper.toDomain(response.data);
    }

    async update(id: string, updates: UpdateDashboardPayload): Promise<Dashboard> {
        const payload: any = {};

        if (updates.title !== undefined) payload.title = updates.title;
        if (updates.layout !== undefined) payload.layout = updates.layout;
        if (updates.visibility !== undefined) payload.visibility = updates.visibility;
        if (updates.timeRange !== undefined) payload.timeRange = updates.timeRange;
        if (updates.autoRefreshIntervalValue !== undefined)
            payload.autoRefreshIntervalValue = updates.autoRefreshIntervalValue;
        if (updates.autoRefreshIntervalUnit !== undefined)
            payload.autoRefreshIntervalUnit = updates.autoRefreshIntervalUnit;

        const response = await apiClient.patch<DashboardDTO>(DASHBOARD_ENDPOINTS.update(id), payload);

        if (!response.success || !response.data) {
            throw new Error(response.error?.message || "Erreur lors de la mise à jour du dashboard");
        }

        return dashboardMapper.toDomain(response.data);
    }

    async delete(id: string): Promise<void> {
        const response = await apiClient.delete<unknown>(DASHBOARD_ENDPOINTS.delete(id));

        if (!response.success) {
            throw new Error(response.error?.message || "Erreur lors de la suppression du dashboard");
        }
    }

    async enableShare(id: string): Promise<ShareDashboardResult> {
        const response = await apiClient.patch<any>(DASHBOARD_ENDPOINTS.sharing(id), {
            enabled: true,
        });

        if (!response.success) {
            throw new Error(response.error?.message || "Erreur lors de l'activation du partage");
        }

        return {
            shareId: response.data.shareId,
            shareEnabled: true,
        };
    }

    async disableShare(id: string): Promise<{ success: boolean }> {
        const response = await apiClient.patch<any>(DASHBOARD_ENDPOINTS.sharing(id), {
            enabled: false,
        });

        if (!response.success) {
            throw new Error(response.error?.message || "Erreur lors de la désactivation du partage");
        }

        return { success: true };
    }
}
