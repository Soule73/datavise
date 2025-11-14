import { useState, useCallback } from "react";
import { aiWidgetApi } from "@services/aiWidget";
import { createWidget } from "@services/widget";
import type {
    AIGenerateRequest,
    AIGeneratedWidget,
    AIGeneratorState,
    AIRefineRequest,
} from "@type/aiTypes";
import { useNotificationStore } from "@store/notification";
import {
    extractApiData,
    formatErrorMessage,
    toWidgetPayload,
    aiLogger,
} from "@utils/aiHelpers";

/**
 * Hook pour gérer la génération de widgets par IA
 */
export function useAIWidgetGenerator() {
    const { showNotification } = useNotificationStore();

    const [state, setState] = useState<AIGeneratorState>({
        status: "idle",
        widgets: [],
        dataSourceSummary: null,
        conversationTitle: undefined,
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
                aiLogger.generate("Envoi de la requête", request);
                const response = await aiWidgetApi.generateWidgets(request);
                aiLogger.generate("Réponse brute de l'API", response);

                const data = extractApiData(response);
                aiLogger.generate("Données extraites", data);
                aiLogger.generate("Widgets générés", `${data.widgets.length} widgets`);
                aiLogger.generate("Titre de conversation", data.conversationTitle);

                setState({
                    status: "success",
                    widgets: data.widgets,
                    dataSourceSummary: data.dataSourceSummary,
                    conversationTitle: data.conversationTitle,
                    suggestions: data.suggestions || [],
                    error: null,
                    isLoading: false,
                });

                showNotification({
                    open: true,
                    type: "success",
                    title: `${data.widgets.length} widgets générés avec succès`,
                });

                return data;
            } catch (error: any) {
                aiLogger.error("Erreur lors de la génération", error);

                const errorMessage = formatErrorMessage(
                    error,
                    "Erreur lors de la génération"
                );

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
                aiLogger.refine("Envoi de la requête", request);
                const response = await aiWidgetApi.refineWidgets(request);
                aiLogger.refine("Réponse du raffinement", response);

                const data = extractApiData(response);
                aiLogger.refine("Widgets raffinés", `${data.widgets.length} widgets`);

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

                return data;
            } catch (error: any) {
                aiLogger.error("Erreur lors du raffinement", error);

                const errorMessage = formatErrorMessage(
                    error,
                    "Erreur lors du raffinement"
                );

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
                aiLogger.save("Tentative de sauvegarde", {
                    id: widget.id,
                    name: widget.name,
                    type: widget.type,
                });

                const payload = toWidgetPayload(widget) as any;

                aiLogger.save("Payload envoyé au backend", payload);
                const savedWidget = await createWidget(payload);
                aiLogger.success("Widget sauvegardé", savedWidget);

                if (savedWidget._id) {
                    aiLogger.success("Mise à jour du widget avec _id", savedWidget._id);
                    setState((prev) => ({
                        ...prev,
                        widgets: prev.widgets.map((w) =>
                            w.id === widget.id ? { ...w, _id: savedWidget._id } : w
                        ),
                    }));
                }

                showNotification({
                    open: true,
                    type: "success",
                    title: `Widget "${widget.name}" sauvegardé`,
                });

                return savedWidget;
            } catch (error: any) {
                aiLogger.error("Erreur lors de la sauvegarde", error);

                const errorMessage = formatErrorMessage(
                    error,
                    "Erreur lors de la sauvegarde"
                );

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

    /**
     * Définit directement les widgets (pour charger une conversation)
     */
    const setWidgets = useCallback((widgets: AIGeneratedWidget[]) => {
        setState((prev) => ({
            ...prev,
            widgets,
            status: widgets.length > 0 ? "success" : "idle",
        }));
    }, []);

    /**
     * Définit le résumé de la source de données
     */
    const setDataSourceSummary = useCallback((summary: any) => {
        setState((prev) => ({
            ...prev,
            dataSourceSummary: summary,
        }));
    }, []);

    /**
     * Définit les suggestions
     */
    const setSuggestions = useCallback((suggestions: string[]) => {
        setState((prev) => ({
            ...prev,
            suggestions,
        }));
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
        setWidgets,
        setDataSourceSummary,
        setSuggestions,
    };
}