import type { IWidgetRepository } from "@domain/ports/repositories/IWidgetRepository";
import type { Widget } from "@domain/entities/Widget.entity";
import { WidgetValidationError } from "@domain/errors/DomainError";

export interface CreateWidgetInput {
    title: string;
    type: string;
    config: unknown;
    dataSourceId: string;
    visibility?: "public" | "private";
    isGeneratedByAI?: boolean;
    conversationId?: string;
}

export class CreateWidgetUseCase {
    private widgetRepository: IWidgetRepository;
    constructor(widgetRepository: IWidgetRepository) {
        this.widgetRepository = widgetRepository;
    }

    async execute(input: CreateWidgetInput): Promise<Widget> {
        if (!input.title || input.title.trim().length < 3) {
            throw new WidgetValidationError("Le titre doit contenir au moins 3 caractères");
        }

        if (!input.dataSourceId) {
            throw new WidgetValidationError("La source de données est requise");
        }

        const widgetData = {
            widgetId: `widget-${Date.now()}`,
            title: input.title.trim(),
            type: input.type,
            config: input.config,
            dataSourceId: input.dataSourceId,
            visibility: input.visibility || "private",
            isDraft: true,
            isGeneratedByAI: input.isGeneratedByAI || false,
            conversationId: input.conversationId,
        } as Omit<Widget, "id" | "createdAt" | "updatedAt">;

        return this.widgetRepository.create(widgetData);
    }
}
