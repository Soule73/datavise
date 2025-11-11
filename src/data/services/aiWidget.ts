import api from "./api";
import type {
    AIGenerateRequest,
    AIGenerateResponse,
    AIRefineRequest,
} from "@type/aiTypes";
import type { ApiResponse } from "@type/api";

/**
 * Service pour interagir avec l'API de génération de widgets par IA
 */
export const aiWidgetApi = {
    /**
     * Génère des widgets via IA
     */
    async generateWidgets(
        request: AIGenerateRequest
    ): Promise<ApiResponse<AIGenerateResponse>> {
        const response = await api.post<ApiResponse<AIGenerateResponse>>(
            "/ai/generate-widgets",
            request
        );
        return response.data;
    },

    /**
     * Raffine des widgets existants
     */
    async refineWidgets(
        request: AIRefineRequest
    ): Promise<ApiResponse<AIGenerateResponse>> {
        const response = await api.post<ApiResponse<AIGenerateResponse>>(
            "/ai/refine-widgets",
            request
        );
        return response.data;
    },

    /**
     * Analyse une source de données
     */
    async analyzeDataSource(dataSourceId: string): Promise<any> {
        const response = await api.post("/ai/analyze-source", { dataSourceId });
        return response.data;
    },
};
