import type { IWidgetRepository, WidgetFilters } from "../../ports/repositories/IWidgetRepository";
import type { Widget } from "../../entities/Widget.entity";
import type { Pagination } from "../../value-objects/Pagination.vo";

export class ListWidgetsUseCase {
    private widgetRepository: IWidgetRepository;

    constructor(widgetRepository: IWidgetRepository) {
        this.widgetRepository = widgetRepository;
    }

    async execute(filters?: WidgetFilters, pagination?: Pagination): Promise<Widget[]> {
        try {
            return await this.widgetRepository.findAll(filters, pagination);
        } catch (error) {
            console.error("Erreur lors de la récupération des widgets:", error);
            throw error;
        }
    }
}
