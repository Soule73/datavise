import { AIGeneratedWidget } from "@/domain/entities/AIGeneratedWidget.entity";
import { createDataSourceSummary, type DataSourceSummary } from "@/domain/value-objects/DataSourceSummary.vo";
import type {
    AIGeneratedWidgetDTO,
    GenerateWidgetsResponseDTO,
    AnalyzeDataSourceResponseDTO,
} from "../api/dto/AIWidgetDTO";
import type { GenerateWidgetsResult } from "@/domain/ports/repositories/IAIWidgetRepository";

export const aiWidgetMapper = {
    widgetToDomain(dto: AIGeneratedWidgetDTO): AIGeneratedWidget {
        return new AIGeneratedWidget(
            dto.id,
            dto.name,
            dto.description,
            dto.type,
            dto.config,
            dto.dataSourceId,
            dto.reasoning,
            dto.confidence,
            dto._id
        );
    },

    widgetToDTO(widget: AIGeneratedWidget): AIGeneratedWidgetDTO {
        return {
            id: widget.id,
            _id: widget.mongoId,
            name: widget.name,
            description: widget.description,
            type: widget.type,
            config: widget.config,
            dataSourceId: widget.dataSourceId,
            reasoning: widget.reasoning,
            confidence: widget.confidence,
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
