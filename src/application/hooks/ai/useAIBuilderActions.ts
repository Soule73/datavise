import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useAIStore } from "@store/aiStore";
import { useNotificationStore } from "@store/notification";
import { formatErrorMessage, getSavedWidgetIds } from "@utils/aiHelpers";
import { useAIConversationActions } from "./useAIConversationActions";
import { useAIWidgetGeneration } from "./useAIWidgetGeneration";
import { DeleteWidgetUseCase } from "@/domain/use-cases/widget/DeleteWidget.usecase";
import { PublishWidgetUseCase } from "@/domain/use-cases/widget/PublishWidget.usecase";
import { CreateWidgetUseCase } from "@/domain/use-cases/widget/CreateWidget.usecase";
import { WidgetRepository } from "@/infrastructure/repositories/WidgetRepository";
import { toWidgetPayload, aiLogger } from "@utils/aiHelpers";
import type { AIGeneratedWidget } from "@/domain/entities/AIGeneratedWidget.entity";

const widgetRepository = new WidgetRepository();
const deleteWidgetUseCase = new DeleteWidgetUseCase(widgetRepository);
const publishWidgetUseCase = new PublishWidgetUseCase(widgetRepository);
const createWidgetUseCase = new CreateWidgetUseCase(widgetRepository);

export function useAIBuilderActions() {
    const queryClient = useQueryClient();
    const [, setSearchParams] = useSearchParams();
    const { showNotification } = useNotificationStore();

    const {
        createConversationAsync,
        addMessageAsync,
        updateTitle,
        deleteConversation: deleteConversationMutation,
    } = useAIConversationActions();

    const {
        generateWidgetsAsync,
        refineWidgetsAsync,
        isGenerating,
        isRefining,
    } = useAIWidgetGeneration();

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
                const newConversation = await createConversationAsync({
                    dataSourceId: selectedSourceId,
                    title: "Nouvelle conversation",
                });
                conversationId = newConversation.id;
                setActiveConversationId(conversationId);
                setSearchParams({ current: conversationId });
            }

            await addMessageAsync({
                conversationId: conversationId!,
                message: {
                    role: "user",
                    content: userPrompt,
                },
            });

            const result = await generateWidgetsAsync({
                dataSourceId: selectedSourceId,
                conversationId: conversationId!,
                userPrompt,
                maxWidgets,
            });

            if (result.conversationTitle && conversationId) {
                updateTitle({
                    conversationId,
                    payload: { title: result.conversationTitle },
                });
            }

            setGeneratedWidgets(result.widgets as any);
            await queryClient.invalidateQueries({ queryKey: ["ai-conversation", conversationId!] });
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
        createConversationAsync,
        addMessageAsync,
        updateTitle,
        generateWidgetsAsync,
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
            await addMessageAsync({
                conversationId: activeConversationId,
                message: {
                    role: "user",
                    content: refinementPrompt,
                },
            });

            const result = await refineWidgetsAsync({
                dataSourceId: selectedSourceId,
                currentWidgets: generatedWidgets as any,
                refinementPrompt,
            });

            setGeneratedWidgets(result.widgets as any);
            await queryClient.invalidateQueries({ queryKey: ["ai-conversation", activeConversationId] });
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
        addMessageAsync,
        refineWidgetsAsync,
        queryClient,
        setGeneratedWidgets,
        setIsLoading,
        setError,
    ]);

    const handleSaveWidget = useCallback(
        async (widget: AIGeneratedWidget) => {
            try {
                aiLogger.save("Tentative de sauvegarde", {
                    id: widget.id,
                    name: widget.name,
                    type: widget.type,
                });

                const payload = toWidgetPayload(widget) as any;
                const savedWidget = await createWidgetUseCase.execute(payload);

                aiLogger.success("Widget sauvegardé", savedWidget);

                if (savedWidget.id) {
                    setGeneratedWidgets(
                        generatedWidgets.map((w: any) => (w.id === widget.id ? { ...w, _id: savedWidget.id } : w)) as any
                    );
                }

                showNotification({
                    open: true,
                    type: "success",
                    title: `Widget "${widget.name}" sauvegardé`,
                });

                return savedWidget;
            } catch (error: any) {
                const errorMessage = formatErrorMessage(error, "Erreur lors de la sauvegarde");
                showNotification({
                    open: true,
                    type: "error",
                    title: errorMessage,
                });
                throw error;
            }
        },
        [generatedWidgets, setGeneratedWidgets, showNotification]
    );

    const handleSaveAll = useCallback(async () => {
        const widgetIds = getSavedWidgetIds(generatedWidgets);
        if (widgetIds.length > 0) {
            try {
                await Promise.all(widgetIds.map((id) => publishWidgetUseCase.execute(id)));
                await queryClient.invalidateQueries({ queryKey: ["widgets"] });
                showNotification({
                    open: true,
                    type: "success",
                    title: "Tous les widgets publiés",
                });
            } catch (error: any) {
                showNotification({
                    open: true,
                    type: "error",
                    title: error.message || "Erreur publication",
                });
            }
        }
    }, [generatedWidgets, queryClient, showNotification]);

    const handleRemoveWidget = useCallback(
        async (widgetId: string) => {
            const widget = generatedWidgets.find((w) => w.id === widgetId);

            if (widget?.mongoId) {
                try {
                    await deleteWidgetUseCase.execute(widget.mongoId);
                    await queryClient.invalidateQueries({ queryKey: ["widgets"] });
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

            setGeneratedWidgets(generatedWidgets.filter((w: any) => w.id !== widgetId) as any);
            setWidgetToDelete(null);
        },
        [generatedWidgets, setGeneratedWidgets, queryClient, setWidgetToDelete, showNotification]
    );

    const handleReset = useCallback(() => {
        resetState();
        setSearchParams({});
    }, [resetState, setSearchParams]);

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
            deleteConversationMutation(conversationId);
            if (conversationId === activeConversationId) {
                handleReset();
            }
        },
        [deleteConversationMutation, activeConversationId, handleReset]
    );

    const handleUpdateTitle = useCallback(
        async (conversationId: string, title: string) => {
            updateTitle({
                conversationId,
                payload: { title },
            });
        },
        [updateTitle]
    );

    const handleSuggestionClick = useCallback(
        async (suggestion: string) => {
            if (!activeConversationId) return;

            setIsLoading(true);
            try {
                await addMessageAsync({
                    conversationId: activeConversationId,
                    message: {
                        role: "user",
                        content: suggestion,
                    },
                });

                const result = await refineWidgetsAsync({
                    dataSourceId: selectedSourceId,
                    currentWidgets: generatedWidgets as any,
                    refinementPrompt: suggestion,
                });

                setGeneratedWidgets(result.widgets as any);
                await queryClient.invalidateQueries({ queryKey: ["ai-conversation", activeConversationId] });
            } catch (error) {
                console.error("Erreur suggestion:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [activeConversationId, selectedSourceId, generatedWidgets, addMessageAsync, refineWidgetsAsync, queryClient, setGeneratedWidgets, setIsLoading]
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
        isGenerating,
        isRefining,
    };
}
