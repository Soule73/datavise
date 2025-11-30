import type { Widget } from "@/domain/entities/Widget.entity";

export function getWidgetId(widget: Widget | any): string {
    return widget.widgetId || widget.id || widget._id || "";
}

export function getWidgetName(widget: Widget | any): string {
    return widget.title || widget.name || "Sans nom";
}

export function isWidgetSaved(widget: Widget): boolean {
    return !!widget.id;
}

export function getSavedWidgets(widgets: Widget[]): Widget[] {
    return widgets.filter(isWidgetSaved);
}

export function getSavedWidgetIds(widgets: Widget[]): string[] {
    return getSavedWidgets(widgets).map((w) => w.id);
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
export function toWidgetPayload(widget: Widget) {
    return {
        title: widget.title,
        description: widget.description,
        type: widget.type,
        dataSourceId: widget.dataSourceId,
        config: widget.config,
        visibility: widget.visibility,
        isDraft: widget.isDraft,
        isGeneratedByAI: widget.isGeneratedByAI,
        conversationId: widget.conversationId,
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
