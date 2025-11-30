import type {
    IAIWidgetRepository,
    GenerateWidgetsPayload,
    RefineWidgetsPayload,
    GenerateWidgetsResult,
} from "@/domain/ports/repositories/IAIWidgetRepository";
import type { DataSourceSummary } from "@/domain/value-objects/DataSourceSummary.vo";
import { aiWidgetMapper } from "../mappers/aiWidgetMapper";
import { AI_WIDGET_ENDPOINTS } from "../api/endpoints/ai.endpoints";
import { apiClient } from "../api/client/apiClient";
import type { GenerateWidgetsResponseDTO, AnalyzeDataSourceResponseDTO } from "../api/dto/AIWidgetDTO";

export class AIWidgetRepository implements IAIWidgetRepository {
    async generateWidgets(payload: GenerateWidgetsPayload): Promise<GenerateWidgetsResult> {
        const requestBody = {
            dataSourceId: payload.dataSourceId,
            conversationId: payload.conversationId,
            userPrompt: payload.userPrompt,
            maxWidgets: payload.maxWidgets,
            preferredTypes: payload.preferredTypes,
        };

        const response = await apiClient.post<GenerateWidgetsResponseDTO>(
            AI_WIDGET_ENDPOINTS.generate,
            requestBody,
            { timeout: 120000 }
        );

        if (!response.success || !response.data) {
            throw new Error(response.error?.message || "Erreur lors de la génération des widgets");
        }

        return aiWidgetMapper.generateResponseToDomain(response.data);
    }

    async refineWidgets(payload: RefineWidgetsPayload): Promise<GenerateWidgetsResult> {
        const requestBody = {
            dataSourceId: payload.dataSourceId,
            currentWidgets: payload.currentWidgets.map((w) => aiWidgetMapper.widgetToDTO(w)),
            refinementPrompt: payload.refinementPrompt,
        };

        const response = await apiClient.post<GenerateWidgetsResponseDTO>(
            AI_WIDGET_ENDPOINTS.refine,
            requestBody,
            { timeout: 120000 }
        );

        if (!response.success || !response.data) {
            throw new Error(response.error?.message || "Erreur lors du raffinement des widgets");
        }

        return aiWidgetMapper.generateResponseToDomain(response.data);
    }

    async analyzeDataSource(dataSourceId: string): Promise<DataSourceSummary> {
        const response = await apiClient.post<AnalyzeDataSourceResponseDTO>(
            AI_WIDGET_ENDPOINTS.analyze,
            { dataSourceId },
            { timeout: 120000 }
        );

        if (!response.success || !response.data) {
            throw new Error(response.error?.message || "Erreur lors de l'analyse de la source de données");
        }

        return aiWidgetMapper.summaryToDomain(response.data);
    }
}
