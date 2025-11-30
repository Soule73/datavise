import type { IWidgetRepository } from "../../ports/repositories/IWidgetRepository";

export class DeleteWidgetUseCase {
    private widgetRepository: IWidgetRepository;

    constructor(widgetRepository: IWidgetRepository) {
        this.widgetRepository = widgetRepository;
    }

    async execute(widgetId: string): Promise<void> {
        const widget = await this.widgetRepository.findById(widgetId);

        if (!widget) {
            throw new Error(`Widget ${widgetId} non trouvé`);
        }

        if (!widget.canBeDeleted()) {
            throw new Error("Ce widget ne peut pas être supprimé");
        }

        await this.widgetRepository.delete(widgetId);
    }
}
