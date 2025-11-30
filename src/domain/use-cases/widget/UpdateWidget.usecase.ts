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
        if (updates.title !== undefined && updates.title.trim().length < 3) {
            throw new WidgetValidationError("Le titre doit contenir au moins 3 caractères");
        }

        const widget = await this.widgetRepository.findById(widgetId);
        if (!widget) {
            throw new WidgetValidationError("Widget non trouvé");
        }

        return this.widgetRepository.update(widgetId, updates as Partial<Widget>);
    }
}
