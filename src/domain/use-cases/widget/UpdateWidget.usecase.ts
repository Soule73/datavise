import type { IWidgetRepository } from "@domain/ports/repositories/IWidgetRepository";
import type { Widget } from "@domain/entities/Widget.entity";
import { WidgetValidationError } from "@domain/errors/DomainError";

export interface UpdateWidgetInput {
    title?: string;
    config?: unknown;
    visibility?: "public" | "private";
    isDraft?: boolean;
}

export class UpdateWidgetUseCase {
    private widgetRepository: IWidgetRepository;

    constructor(widgetRepository: IWidgetRepository) {
        this.widgetRepository = widgetRepository;
    }

    async execute(widgetId: string, updates: UpdateWidgetInput): Promise<Widget> {
        const widget = await this.widgetRepository.findById(widgetId);
        if (!widget) {
            throw new WidgetValidationError("Widget non trouv\u00e9");
        }

        if (updates.title !== undefined && updates.title.trim().length === 0) {
            if (!widget.isGeneratedByAI && !widget.isDraft) {
                throw new WidgetValidationError("Le titre ne peut pas \u00eatre vide");
            }
        }

        return this.widgetRepository.update(widgetId, updates as Partial<Widget>);
    }
}
