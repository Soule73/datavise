import type { ApiResponse, ApiError } from "@type/api";
import type { AIGeneratedWidget } from "@/domain/entities/AIGeneratedWidget.entity";
import type { Widget } from "@/domain/entities/Widget.entity";

/**
 * Extrait les données d'une ApiResponse ou lance une erreur
 */
export function extractApiData<T>(response: ApiResponse<T>): T {
    if (response.success && "data" in response) {
        return response.data;
    }
    const error = response as ApiError;
    throw new Error(error.error?.message || "Erreur inconnue");
}

/**
 * Récupère l'ID d'un widget (temporaire ou MongoDB)
 */
export function getWidgetId(widget: AIGeneratedWidget | Widget | any): string {
    return widget.id || widget._id || "";
}

/**
 * Récupère le nom/titre d'un widget
 */
export function getWidgetName(widget: AIGeneratedWidget | Widget | any): string {
    return widget.name || widget.title || "Sans nom";
}

/**
 * Vérifie si un widget AI a été sauvegardé dans la BDD
 */
export function isWidgetSaved(widget: AIGeneratedWidget): boolean {
    return !!widget.mongoId;
}

/**
 * Filtre les widgets qui ont été sauvegardés
 */
export function getSavedWidgets(widgets: AIGeneratedWidget[]): AIGeneratedWidget[] {
    return widgets.filter(isWidgetSaved);
}

/**
 * Récupère les IDs MongoDB des widgets sauvegardés
 */
export function getSavedWidgetIds(widgets: AIGeneratedWidget[]): string[] {
    return getSavedWidgets(widgets).map((w) => w.mongoId!);
}

/**
 * Formatte un message d'erreur à partir d'une exception
 */
export function formatErrorMessage(
    error: any,
    defaultMessage: string = "Une erreur est survenue"
): string {
    return (
        error.response?.data?.message ||
        error.message ||
        defaultMessage
    );
}

/**
 * Vérifie si une conversation est active
 */
export function hasActiveConversation(conversationId: string | null): boolean {
    return !!conversationId && conversationId.length > 0;
}

/**
 * Transforme un widget AI en payload pour le backend
 */
export function toWidgetPayload(widget: AIGeneratedWidget) {
    return {
        title: widget.name,
        description: widget.description,
        type: widget.type,
        dataSourceId: widget.dataSourceId,
        config: widget.config,
        isGeneratedByAI: true,
        reasoning: widget.reasoning,
        confidence: widget.confidence,
    };
}

/**
 * Logs pour debugging AI
 */
export const aiLogger = {
    generate: (message: string, data?: any) => {
        console.log(`[AI Generate] ${message}`, data || "");
    },
    refine: (message: string, data?: any) => {
        console.log(`[AI Refine] ${message}`, data || "");
    },
    save: (message: string, data?: any) => {
        console.log(`[AI Save] ${message}`, data || "");
    },
    success: (message: string, data?: any) => {
        console.log(`[AI Success] ${message}`, data || "");
    },
    error: (message: string, error?: any) => {
        console.error(`[AI Error] ${message}`, error || "");
    },
};
