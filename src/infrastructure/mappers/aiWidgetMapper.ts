import { createDataSourceSummary, type DataSourceSummary } from "@/domain/value-objects/DataSourceSummary.vo";
import type {
    GenerateWidgetsResponseDTO,
    AnalyzeDataSourceResponseDTO,
} from "../api/dto/AIWidgetDTO";
import type { GenerateWidgetsResult } from "@/domain/ports/repositories/IAIWidgetRepository";
import { widgetMapper } from "./widgetMapper";

export const aiWidgetMapper = {

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
            widgets: dto.widgets.map((w) => widgetMapper.toDomain(w)),
            totalGenerated: dto.totalGenerated,
            dataSourceSummary: aiWidgetMapper.summaryToDomain(dto.dataSourceSummary),
            suggestions: dto.suggestions,
        };
    },
};
