import type { IDashboardRepository, UpdateDashboardPayload } from "../../ports/repositories/IDashboardRepository";
import type { Dashboard } from "../../entities/Dashboard.entity";
import { DashboardNotFoundError } from "../../errors/DomainError";

export class UpdateDashboardUseCase {
    private dashboardRepository: IDashboardRepository;

    constructor(dashboardRepository: IDashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    async execute(id: string, updates: UpdateDashboardPayload): Promise<Dashboard> {
        const existing = await this.dashboardRepository.findById(id);

        if (!existing) {
            throw new DashboardNotFoundError(id);
        }

        try {
            return await this.dashboardRepository.update(id, updates);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du dashboard:", error);
            throw error;
        }
    }
}
