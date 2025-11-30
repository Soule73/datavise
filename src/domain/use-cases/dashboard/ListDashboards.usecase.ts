import type { IDashboardRepository, DashboardFilters } from "../../ports/repositories/IDashboardRepository";
import type { Dashboard } from "../../entities/Dashboard.entity";

export class ListDashboardsUseCase {
    private dashboardRepository: IDashboardRepository;

    constructor(dashboardRepository: IDashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    async execute(filters?: DashboardFilters): Promise<Dashboard[]> {
        try {
            return await this.dashboardRepository.findAll(filters);
        } catch (error) {
            console.error("Erreur lors de la récupération des dashboards:", error);
            throw error;
        }
    }
}
