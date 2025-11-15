import type { IDashboardRepository } from "../../ports/repositories/IDashboardRepository";
import type { Dashboard } from "../../entities/Dashboard.entity";

export class CreateDashboardUseCase {
    private dashboardRepository: IDashboardRepository;

    constructor(dashboardRepository: IDashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    async execute(
        dashboard: Omit<Dashboard, "id" | "ownerId" | "createdAt" | "updatedAt" | "widgets">
    ): Promise<Dashboard> {
        try {
            return await this.dashboardRepository.create(dashboard);
        } catch (error) {
            console.error("Erreur lors de la création du dashboard:", error);
            throw error;
        }
    }
}
