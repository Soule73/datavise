import { Widget } from "@domain/entities/Widget.entity";
import { createDataSourceSummary, type DataSourceSummary } from "@domain/value-objects/DataSourceSummary.vo";
import type {
    AIGeneratedWidgetDTO,
    GenerateWidgetsResponseDTO,
    AnalyzeDataSourceResponseDTO,
} from "../api/dto/AIWidgetDTO";
import type { GenerateWidgetsResult } from "@domain/ports/repositories/IAIWidgetRepository";

export const aiWidgetMapper = {
    widgetToDomain(dto: AIGeneratedWidgetDTO): Widget {
        return new Widget(
            dto._id || dto.id,
            dto.id,
            dto.name,
            dto.type as any,
            dto.config as any,
            dto.dataSourceId,
            "private",
            true,
            true,
            undefined,
            false,
            dto.description,
            dto.reasoning,
            dto.confidence
        );
    },

    widgetToDTO(widget: Widget): AIGeneratedWidgetDTO {
        return {
            id: widget.widgetId,
            _id: widget.id,
            name: widget.title,
            description: widget.description || "",
            type: widget.type,
            config: widget.config as any,
            dataSourceId: widget.dataSourceId,
            reasoning: widget.reasoning || "",
            confidence: widget.confidence || 0,
        };
    },

    summaryToDomain(dto: GenerateWidgetsResponseDTO["dataSourceSummary"] | AnalyzeDataSourceResponseDTO): DataSourceSummary {
        return createDataSourceSummary(
            dto.name,
            dto.type,
            dto.rowCount,
            dto.columns.map((col) => ({
                name: col.name,
                type: col.type,
                uniqueValues: col.uniqueValues,
                sampleValues: col.sampleValues,
            }))
        );
    },

    generateResponseToDomain(dto: GenerateWidgetsResponseDTO): GenerateWidgetsResult {
        return {
            conversationTitle: dto.conversationTitle,
            widgets: dto.widgets.map((w) => aiWidgetMapper.widgetToDomain(w)),
            totalGenerated: dto.totalGenerated,
            dataSourceSummary: aiWidgetMapper.summaryToDomain(dto.dataSourceSummary),
            suggestions: dto.suggestions,
        };
    },
};
