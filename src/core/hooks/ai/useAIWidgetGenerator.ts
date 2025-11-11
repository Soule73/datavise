import { useState, useCallback } from "react";
import { aiWidgetApi } from "@services/aiWidget";
import { createWidget } from "@services/widget";
import type {
    AIGenerateRequest,
    AIGeneratedWidget,
    AIGeneratorState,
    AIRefineRequest,
} from "@type/aiTypes";
import type { WidgetType } from "@type/widgetTypes";
import type { ApiResponse, ApiError } from "@type/api";
import { useNotificationStore } from "@store/notification";

/**
 * Helper pour extraire les données de l'ApiResponse
 */
function extractData<T>(response: ApiResponse<T>): T {
    if ("data" in response) {
        return response.data;
    }
    // C'est une ApiError
    const error = response as ApiError;
    throw new Error(error.message || "Erreur inconnue");
}

/**
 * Hook pour gérer la génération de widgets par IA
 */
export function useAIWidgetGenerator() {
    const { showNotification } = useNotificationStore();

    const [state, setState] = useState<AIGeneratorState>({
        status: "idle",
        widgets: [],
        dataSourceSummary: null,
        suggestions: [],
        error: null,
        isLoading: false,
    });

    /**
     * Génère des widgets via IA
     */
    const generateWidgets = useCallback(
        async (request: AIGenerateRequest) => {
            setState((prev) => ({
                ...prev,
                status: "generating",
                isLoading: true,
                error: null,
            }));

            try {
                console.log("🤖 [AI] Envoi de la requête de génération:", request);
                const response = await aiWidgetApi.generateWidgets(request);
                console.log("🤖 [AI] Réponse brute de l'API:", response);

                const data = extractData(response);
                console.log("🤖 [AI] Données extraites:", data);
                console.log("🤖 [AI] Nombre de widgets générés:", data.widgets.length);
                console.log("🤖 [AI] Widgets détaillés:", JSON.stringify(data.widgets, null, 2));

                setState({
                    status: "success",
                    widgets: data.widgets,
                    dataSourceSummary: data.dataSourceSummary,
                    suggestions: data.suggestions || [],
                    error: null,
                    isLoading: false,
                });

                showNotification({
                    open: true,
                    type: "success",
                    title: `${data.widgets.length} widgets générés avec succès`,
                });

                return data.widgets;
            } catch (error: any) {
                console.error("❌ [AI] Erreur lors de la génération:", error);
                console.error("❌ [AI] Détails de l'erreur:", {
                    message: error.message,
                    response: error.response?.data,
                    stack: error.stack,
                });

                const errorMessage =
                    error.response?.data?.message ||
                    error.message ||
                    "Erreur lors de la génération";

                setState((prev) => ({
                    ...prev,
                    status: "error",
                    error: errorMessage,
                    isLoading: false,
                }));

                showNotification({
                    open: true,
                    type: "error",
                    title: errorMessage,
                });

                throw error;
            }
        },
        [showNotification]
    );

    /**
     * Raffine les widgets existants
     */
    const refineWidgets = useCallback(
        async (request: AIRefineRequest) => {
            setState((prev) => ({
                ...prev,
                status: "refining",
                isLoading: true,
                error: null,
            }));

            try {
                console.log("🔧 [AI] Envoi de la requête de raffinement:", request);
                const response = await aiWidgetApi.refineWidgets(request);
                console.log("🔧 [AI] Réponse du raffinement:", response);

                const data = extractData(response);
                console.log("🔧 [AI] Widgets raffinés:", data.widgets.length);

                setState({
                    status: "success",
                    widgets: data.widgets,
                    dataSourceSummary: data.dataSourceSummary,
                    suggestions: data.suggestions || [],
                    error: null,
                    isLoading: false,
                });

                showNotification({
                    open: true,
                    type: "success",
                    title: "Widgets raffinés avec succès",
                });

                return data.widgets;
            } catch (error: any) {
                console.error("❌ [AI] Erreur lors du raffinement:", error);

                const errorMessage =
                    error.response?.data?.message ||
                    error.message ||
                    "Erreur lors du raffinement";

                setState((prev) => ({
                    ...prev,
                    status: "error",
                    error: errorMessage,
                    isLoading: false,
                }));

                showNotification({
                    open: true,
                    type: "error",
                    title: errorMessage,
                });

                throw error;
            }
        },
        [showNotification]
    );

    /**
     * Sauvegarde un widget généré
     */
    const saveWidget = useCallback(
        async (widget: AIGeneratedWidget) => {
            try {
                console.log("💾 [AI] Tentative de sauvegarde du widget:", {
                    id: widget.id,
                    name: widget.name,
                    type: widget.type,
                    dataSourceId: widget.dataSourceId,
                    config: widget.config,
                    description: widget.description,
                    reasoning: widget.reasoning,
                    confidence: widget.confidence,
                });

                const payload = {
                    title: widget.name, // ✅ Backend attend "title" pas "name"
                    description: widget.description,
                    type: widget.type as WidgetType,
                    dataSourceId: widget.dataSourceId,
                    config: widget.config,
                    isGeneratedByAI: true,
                    reasoning: widget.reasoning,
                    confidence: widget.confidence,
                };

                console.log("💾 [AI] Payload envoyé au backend:", payload);
                const savedWidget = await createWidget(payload);
                console.log("✅ [AI] Widget sauvegardé avec succès:", savedWidget);

                showNotification({
                    open: true,
                    type: "success",
                    title: `Widget "${widget.name}" sauvegardé`,
                });

                return savedWidget;
            } catch (error: any) {
                console.error("❌ [AI] Erreur lors de la sauvegarde:", error);
                console.error("❌ [AI] Détails:", {
                    message: error.message,
                    response: error.response?.data,
                });

                const errorMessage =
                    error.response?.data?.message ||
                    error.message ||
                    "Erreur lors de la sauvegarde";

                showNotification({
                    open: true,
                    type: "error",
                    title: errorMessage,
                });

                throw error;
            }
        },
        [showNotification]
    );

    /**
     * Sauvegarde tous les widgets
     */
    const saveAllWidgets = useCallback(async () => {
        if (state.widgets.length === 0) {
            showNotification({
                open: true,
                type: "warning",
                title: "Aucun widget à sauvegarder",
            });
            return [];
        }

        const savedWidgets = [];
        let failedCount = 0;

        for (const widget of state.widgets) {
            try {
                const saved = await saveWidget(widget);
                savedWidgets.push(saved);
            } catch (error) {
                failedCount++;
            }
        }

        if (failedCount === 0) {
            showNotification({
                open: true,
                type: "success",
                title: `Tous les widgets (${savedWidgets.length}) ont été sauvegardés`,
            });
        } else {
            showNotification({
                open: true,
                type: "warning",
                title: `${savedWidgets.length} widgets sauvegardés, ${failedCount} échecs`,
            });
        }

        return savedWidgets;
    }, [state.widgets, saveWidget, showNotification]);

    /**
     * Supprime un widget de la liste
     */
    const removeWidget = useCallback((widgetId: string) => {
        setState((prev) => ({
            ...prev,
            widgets: prev.widgets.filter((w) => w.id !== widgetId),
        }));
    }, []);

    /**
     * Met à jour un widget dans la liste
     */
    const updateWidget = useCallback((widgetId: string, updates: Partial<AIGeneratedWidget>) => {
        setState((prev) => ({
            ...prev,
            widgets: prev.widgets.map((w) =>
                w.id === widgetId ? { ...w, ...updates } : w
            ),
        }));
    }, []);

    /**
     * Réinitialise l'état
     */
    const reset = useCallback(() => {
        setState({
            status: "idle",
            widgets: [],
            dataSourceSummary: null,
            suggestions: [],
            error: null,
            isLoading: false,
        });
    }, []);

    return {
        ...state,
        generateWidgets,
        refineWidgets,
        saveWidget,
        saveAllWidgets,
        removeWidget,
        updateWidget,
        reset,
    };
}
