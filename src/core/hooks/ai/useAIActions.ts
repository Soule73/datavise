import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useAIStore } from "@store/aiStore";
import { useAIWidgetGenerator } from "./useAIWidgetGenerator";
import { useNotificationStore } from "@store/notification";
import { formatErrorMessage, getSavedWidgetIds } from "@utils/aiHelpers";
import {
    useCreateConversationMutation,
    useUpdateConversationTitleMutation,
    useDeleteConversationMutation,
    conversationKeys,
} from "./useConversationsQuery";
import { usePublishAllWidgetsMutation, widgetKeys } from "./useAIWidgetsQuery";
import { aiConversationApi } from "@services/aiConversation";
import { deleteWidget as deleteWidgetApi } from "@services/widget";

export function useAIActions() {
    const queryClient = useQueryClient();
    const [, setSearchParams] = useSearchParams();
    const { showNotification } = useNotificationStore();
    const aiGenerator = useAIWidgetGenerator();

    const store = useAIStore();
    const {
        activeConversationId,
        selectedSourceId,
        userPrompt,
        refinementPrompt,
        generatedWidgets,
        maxWidgets,
        setActiveConversationId,
        setGeneratedWidgets,
        setIsLoading,
        setError,
        resetState,
        setWidgetToDelete,
    } = store;

    const createConversationMutation = useCreateConversationMutation();
    const updateTitleMutation = useUpdateConversationTitleMutation();
    const deleteConversationMutation = useDeleteConversationMutation();
    const publishAllMutation = usePublishAllWidgetsMutation();

    const handleGenerate = useCallback(async () => {
        if (!selectedSourceId) {
            setError("Veuillez sélectionner une source de données");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            let conversationId = activeConversationId;

            if (!conversationId) {
                const newConversation = await createConversationMutation.mutateAsync({
                    dataSourceId: selectedSourceId,
                });
                conversationId = newConversation._id;
                setActiveConversationId(conversationId);
                setSearchParams({ current: conversationId });
            }

            await aiConversationApi.addMessage({
                conversationId: conversationId!,
                role: "user",
                content: userPrompt,
            });

            const result = await aiGenerator.generateWidgets({
                dataSourceId: selectedSourceId,
                conversationId: conversationId!,
                userPrompt,
                maxWidgets,
            });

            if (result.conversationTitle && conversationId) {
                await updateTitleMutation.mutateAsync({
                    conversationId,
                    title: result.conversationTitle,
                });
            }

            setGeneratedWidgets(result.widgets);
            await queryClient.invalidateQueries({ queryKey: conversationKeys.detail(conversationId!) });
        } catch (error: any) {
            setError(formatErrorMessage(error, "Erreur lors de la génération"));
        } finally {
            setIsLoading(false);
        }
    }, [
        selectedSourceId,
        activeConversationId,
        userPrompt,
        maxWidgets,
        createConversationMutation,
        updateTitleMutation,
        aiGenerator,
        setSearchParams,
        queryClient,
        setActiveConversationId,
        setGeneratedWidgets,
        setIsLoading,
        setError,
    ]);

    const handleRefine = useCallback(async () => {
        if (!refinementPrompt || !activeConversationId) return;

        setIsLoading(true);
        setError(null);

        try {
            await aiConversationApi.addMessage({
                conversationId: activeConversationId,
                role: "user",
                content: refinementPrompt,
            });

            const result = await aiGenerator.refineWidgets({
                dataSourceId: selectedSourceId,
                currentWidgets: generatedWidgets,
                refinementPrompt,
            });

            setGeneratedWidgets(result.widgets);
            await queryClient.invalidateQueries({ queryKey: conversationKeys.detail(activeConversationId) });
        } catch (error: any) {
            setError(formatErrorMessage(error, "Erreur lors du raffinement"));
        } finally {
            setIsLoading(false);
        }
    }, [
        refinementPrompt,
        activeConversationId,
        generatedWidgets,
        selectedSourceId,
        aiGenerator,
        queryClient,
        setGeneratedWidgets,
        setIsLoading,
        setError,
    ]);

    const handleSaveAll = useCallback(async () => {
        const widgetIds = getSavedWidgetIds(generatedWidgets);
        if (widgetIds.length > 0) {
            await publishAllMutation.mutateAsync(widgetIds);
        }
    }, [generatedWidgets, publishAllMutation]);

    const handleReset = useCallback(() => {
        aiGenerator.reset();
        resetState();
        setSearchParams({});
    }, [aiGenerator, resetState, setSearchParams]);

    const handleNewConversation = useCallback(() => {
        resetState();
        setSearchParams({});
    }, [resetState, setSearchParams]);

    const handleLoadConversation = useCallback(
        async (conversationId: string) => {
            setActiveConversationId(conversationId);
            setSearchParams({ current: conversationId });
        },
        [setSearchParams, setActiveConversationId]
    );

    const handleDeleteConversation = useCallback(
        async (conversationId: string) => {
            await deleteConversationMutation.mutateAsync(conversationId);
            if (conversationId === activeConversationId) {
                handleReset();
            }
        },
        [deleteConversationMutation, activeConversationId, handleReset]
    );

    const handleUpdateTitle = useCallback(
        async (conversationId: string, title: string) => {
            await updateTitleMutation.mutateAsync({ conversationId, title });
        },
        [updateTitleMutation]
    );

    const handleSuggestionClick = useCallback(
        async (suggestion: string) => {
            if (!activeConversationId) return;

            setIsLoading(true);
            try {
                await aiConversationApi.addMessage({
                    conversationId: activeConversationId,
                    role: "user",
                    content: suggestion,
                });

                const result = await aiGenerator.refineWidgets({
                    dataSourceId: selectedSourceId,
                    currentWidgets: generatedWidgets,
                    refinementPrompt: suggestion,
                });

                setGeneratedWidgets(result.widgets);
                await queryClient.invalidateQueries({ queryKey: conversationKeys.detail(activeConversationId) });
            } catch (error) {
                console.error("Erreur suggestion:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [activeConversationId, selectedSourceId, generatedWidgets, aiGenerator, queryClient, setGeneratedWidgets, setIsLoading]
    );

    const handleRemoveWidget = useCallback(
        async (widgetId: string) => {
            const widget = generatedWidgets.find((w) => w.id === widgetId);

            if (widget?._id) {
                try {
                    await deleteWidgetApi(widget._id);
                    await queryClient.invalidateQueries({ queryKey: widgetKeys.all });
                    showNotification({
                        open: true,
                        type: "success",
                        title: "Widget supprimé avec succès",
                    });
                } catch (error: any) {
                    showNotification({
                        open: true,
                        type: "error",
                        title: error?.message || "Erreur lors de la suppression du widget",
                    });
                    return;
                }
            }

            aiGenerator.removeWidget(widgetId);
            setGeneratedWidgets(generatedWidgets.filter((w) => w.id !== widgetId));
            setWidgetToDelete(null);
        },
        [aiGenerator, generatedWidgets, setGeneratedWidgets, queryClient, setWidgetToDelete, showNotification]
    );

    const handleSaveWidget = useCallback(
        async (widget: any) => {
            const result = await aiGenerator.saveWidget(widget);
            if (result) {
                setGeneratedWidgets(
                    generatedWidgets.map((w) => (w.id === widget.id ? { ...w, _id: result._id } : w))
                );
            }
            return result;
        },
        [aiGenerator, generatedWidgets, setGeneratedWidgets]
    );

    const handleConfirmDelete = useCallback(async () => {
        const widgetToDelete = store.widgetToDelete;
        if (widgetToDelete) {
            await handleRemoveWidget(widgetToDelete.id);
        }
    }, [store.widgetToDelete, handleRemoveWidget]);

    return {
        handleGenerate,
        handleRefine,
        handleSaveAll,
        handleReset,
        handleNewConversation,
        handleLoadConversation,
        handleDeleteConversation,
        handleUpdateTitle,
        handleSuggestionClick,
        handleRemoveWidget,
        handleSaveWidget,
        handleConfirmDelete,
    };
}
