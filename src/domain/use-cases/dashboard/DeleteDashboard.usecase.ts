import type { IDashboardRepository } from "../../ports/repositories/IDashboardRepository";
import { DashboardNotFoundError } from "../../errors/DomainError";

export class DeleteDashboardUseCase {
    private dashboardRepository: IDashboardRepository;

    constructor(dashboardRepository: IDashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    async execute(id: string): Promise<void> {
        const dashboard = await this.dashboardRepository.findById(id);

        if (!dashboard) {
            throw new DashboardNotFoundError(id);
        }

        if (!dashboard.canBeDeleted()) {
            throw new Error("Ce dashboard ne peut pas être supprimé");
        }

        await this.dashboardRepository.delete(id);
    }
}
