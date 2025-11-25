import { Widget } from "@/domain/entities/Widget.entity";
import type { WidgetDTO } from "../api/dto/WidgetDTO";
import type { WidgetType } from "@/domain/value-objects";

export const widgetMapper = {
    toDomain(dto: WidgetDTO): Widget {
        return new Widget(
            dto._id,
            dto.widgetId,
            dto.title,
            dto.type as WidgetType,
            dto.config,
            dto.dataSourceId,
            dto.visibility,
            dto.isDraft ?? false,
            dto.isGeneratedByAI ?? false,
            dto.conversationId,
            dto.isUsed,
            dto.description,
            dto.reasoning,
            dto.confidence,
            dto.createdAt ? new Date(dto.createdAt) : undefined,
            dto.updatedAt ? new Date(dto.updatedAt) : undefined
        );
    },

    toDTO(widget: Widget): WidgetDTO {
        return {
            _id: widget.id,
            widgetId: widget.widgetId,
            title: widget.title,
            type: widget.type,
            config: widget.config,
            dataSourceId: widget.dataSourceId,
            visibility: widget.visibility,
            isDraft: widget.isDraft,
            isGeneratedByAI: widget.isGeneratedByAI,
            conversationId: widget.conversationId,
            isUsed: widget.isUsed,
            description: widget.description,
            reasoning: widget.reasoning,
            confidence: widget.confidence,
            createdAt: widget.createdAt?.toISOString(),
            updatedAt: widget.updatedAt?.toISOString(),
        };
    },

    partialToDTO(partial: Partial<Widget>): Partial<WidgetDTO> {
        const dto: Partial<WidgetDTO> = {};

        if (partial.title !== undefined) dto.title = partial.title;
        if (partial.type !== undefined) dto.type = partial.type;
        if (partial.config !== undefined) dto.config = partial.config;
        if (partial.visibility !== undefined) dto.visibility = partial.visibility;
        if (partial.isDraft !== undefined) dto.isDraft = partial.isDraft;

        return dto;
    },
};
