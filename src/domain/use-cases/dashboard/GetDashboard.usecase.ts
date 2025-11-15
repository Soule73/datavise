import type { IDashboardRepository } from "@domain/ports/repositories/IDashboardRepository";
import { Dashboard } from "@domain/entities/Dashboard.entity";

export class GetDashboardUseCase {
    private dashboardRepository: IDashboardRepository;

    constructor(dashboardRepository: IDashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    async execute(dashboardId: string): Promise<Dashboard | null> {
        return this.dashboardRepository.findById(dashboardId);
    }
}
