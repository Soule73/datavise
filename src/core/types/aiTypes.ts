import type { WidgetConfig } from "../../domain/value-objects/widgets/widgetTypes";

/**
 * Widget généré par l'IA avec métadonnées
 */
export interface AIGeneratedWidget {
    id: string; // ID temporaire pour le frontend
    _id?: string; // ID MongoDB après sauvegarde
    name: string;
    description: string;
    type: string;
    config: WidgetConfig;
    dataSourceId: string;
    reasoning: string; // Pourquoi l'IA a choisi ce widget
    confidence: number; // Score de confiance (0-1)
}

/**
 * Configuration pour la génération de widgets par IA
 */
export interface AIGenerateRequest {
    dataSourceId: string;
    conversationId: string;
    userPrompt?: string;
    maxWidgets?: number;
    preferredTypes?: string[];
}

/**
 * Réponse de génération de widgets par IA
 */
export interface AIGenerateResponse {
    conversationTitle?: string; // Titre généré par l'IA pour la conversation
    widgets: AIGeneratedWidget[];
    totalGenerated: number;
    dataSourceSummary: {
        name: string;
        type: string;
        rowCount: number;
        columns: string[];
    };
    suggestions?: string[];
}

/**
 * Requête pour raffiner les widgets générés
 */
export interface AIRefineRequest {
    dataSourceId: string;
    currentWidgets: AIGeneratedWidget[];
    refinementPrompt: string;
}

/**
 * État de la génération AI
 */
export type AIGenerationStatus =
    | "idle"
    | "analyzing"
    | "generating"
    | "refining"
    | "success"
    | "error";

/**
 * État du hook useAIWidgetGenerator
 */
export interface AIGeneratorState {
    status: AIGenerationStatus;
    widgets: AIGeneratedWidget[];
    dataSourceSummary: AIGenerateResponse["dataSourceSummary"] | null;
    conversationTitle?: string; // Titre généré par l'IA
    suggestions: string[];
    error: string | null;
    isLoading: boolean;
}
