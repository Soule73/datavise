import type { IDashboardRepository, ShareDashboardResult } from "../../ports/repositories/IDashboardRepository";
import { DashboardNotFoundError } from "../../errors/DomainError";

export class ShareDashboardUseCase {
    private dashboardRepository: IDashboardRepository;

    constructor(dashboardRepository: IDashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    async enableShare(id: string): Promise<ShareDashboardResult> {
        const dashboard = await this.dashboardRepository.findById(id);

        if (!dashboard) {
            throw new DashboardNotFoundError(id);
        }

        try {
            return await this.dashboardRepository.enableShare(id);
        } catch (error) {
            console.error("Erreur lors de l'activation du partage:", error);
            throw error;
        }
    }

    async disableShare(id: string): Promise<{ success: boolean }> {
        const dashboard = await this.dashboardRepository.findById(id);

        if (!dashboard) {
            throw new DashboardNotFoundError(id);
        }

        try {
            return await this.dashboardRepository.disableShare(id);
        } catch (error) {
            console.error("Erreur lors de la désactivation du partage:", error);
            throw error;
        }
    }
}
