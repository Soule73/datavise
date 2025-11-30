import type { IWidgetRepository } from "@domain/ports/repositories/IWidgetRepository";
import type { Widget } from "@domain/entities/Widget.entity";
import { WidgetNotFoundError, WidgetValidationError } from "@domain/errors/DomainError";

export class PublishWidgetUseCase {
    private repository: IWidgetRepository;

    constructor(repository: IWidgetRepository) {
        this.repository = repository;
    }

    async execute(widgetId: string): Promise<Widget> {
        if (!widgetId) {
            throw new WidgetValidationError("L'ID du widget est requis");
        }

        const existingWidget = await this.repository.findById(widgetId);
        if (!existingWidget) {
            throw new WidgetNotFoundError(widgetId);
        }

        if (!existingWidget.isDraft) {
            throw new WidgetValidationError("Le widget est déjà publié");
        }

        return this.repository.publish(widgetId);
    }
}
