import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useAIStore } from "@stores/aiStore";
import { useNotificationStore } from "@stores/notification";
import { formatErrorMessage, getSavedWidgetIds } from "@utils/aiHelpers";
import { useAIConversationActions } from "./useAIConversationActions";
import { useAIWidgetGeneration } from "./useAIWidgetGeneration";
import { DeleteWidgetUseCase } from "@domain/use-cases/widget/DeleteWidget.usecase";
import { PublishWidgetUseCase } from "@domain/use-cases/widget/PublishWidget.usecase";
import { CreateWidgetUseCase } from "@domain/use-cases/widget/CreateWidget.usecase";
import { WidgetRepository } from "@/infrastructure/repositories/WidgetRepository";
import { toWidgetPayload, aiLogger } from "@utils/aiHelpers";
import type { Widget } from "@domain/entities/Widget.entity";

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

    const {
        activeConversationId,
        activeConversation,
        selectedSourceId,
        userPrompt,
        refinementPrompt,
        generatedWidgets,
        maxWidgets,
        setActiveConversationId,
        setActiveConversation,
        setGeneratedWidgets,
        setIsLoading,
        setError,
        resetState,
        setWidgetToDelete,
        setUserPrompt,
        setRefinementPrompt,
    } = useAIStore();

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

            const userMessage = {
                role: "user" as const,
                content: userPrompt,
                timestamp: new Date(),
            };

            if (activeConversation) {
                setActiveConversation(
                    activeConversation.clone({
                        messages: [...activeConversation.messages, userMessage],
                    })
                );
            }

            await queryClient.setQueryData(
                ["ai-conversation", conversationId],
                (old: any) => {
                    if (!old) return old;
                    return {
                        ...old,
                        messages: [...(old.messages || []), userMessage],
                    };
                }
            );

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
            setUserPrompt("");
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
            const userMessage = {
                role: "user" as const,
                content: refinementPrompt,
                timestamp: new Date(),
            };

            if (activeConversation) {
                setActiveConversation(
                    activeConversation.clone({
                        messages: [...activeConversation.messages, userMessage],
                    })
                );
            }

            await queryClient.setQueryData(
                ["ai-conversation", activeConversationId],
                (old: any) => {
                    if (!old) return old;
                    return {
                        ...old,
                        messages: [...(old.messages || []), userMessage],
                    };
                }
            );

            await addMessageAsync({
                conversationId: activeConversationId,
                message: {
                    role: "user",
                    content: refinementPrompt,
                },
            });

            const result = await refineWidgetsAsync({
                conversationId: activeConversationId,
                refinementPrompt,
            });

            setGeneratedWidgets(result.widgets as any);
            setRefinementPrompt("");
            await queryClient.invalidateQueries({ queryKey: ["ai-conversation", activeConversationId] });
            await queryClient.invalidateQueries({ queryKey: ["widgets", "conversation", activeConversationId] });
            await queryClient.refetchQueries({
                queryKey: ["ai-conversation", activeConversationId],
                exact: true
            });
            await queryClient.refetchQueries({
                queryKey: ["widgets", "conversation", activeConversationId],
                exact: true
            });
        } catch (error: any) {
            setError(formatErrorMessage(error, "Erreur lors du raffinement"));
        } finally {
            setIsLoading(false);
        }
    }, [
        refinementPrompt,
        activeConversationId,
        activeConversation,
        addMessageAsync,
        refineWidgetsAsync,
        queryClient,
        setGeneratedWidgets,
        setIsLoading,
        setError,
        setActiveConversation,
        setRefinementPrompt,
    ]);

    const handleSaveWidget = useCallback(
        async (widget: Widget) => {
            try {
                aiLogger.save("Tentative de sauvegarde", {
                    id: widget.id,
                    name: widget.title,
                    type: widget.type,
                });

                const payload = toWidgetPayload(widget) as any;
                const savedWidget = await createWidgetUseCase.execute(payload);

                aiLogger.success("Widget sauvegardé", savedWidget);

                if (savedWidget.id) {
                    setGeneratedWidgets(
                        generatedWidgets.map((w: Widget) =>
                            w.widgetId === widget.widgetId || w.id === widget.id
                                ? w.clone({ ...savedWidget, isDraft: false })
                                : w
                        )
                    );
                }

                showNotification({
                    open: true,
                    type: "success",
                    title: `Widget "${widget.title}" sauvegardé`,
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
            const widget = generatedWidgets.find((w) => w.widgetId === widgetId || w.id === widgetId);

            if (widget?.id && !widget.isDraft) {
                try {
                    await deleteWidgetUseCase.execute(widget.id);
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

            setGeneratedWidgets(generatedWidgets.filter((w) => w.widgetId !== widgetId && w.id !== widgetId));
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
            setGeneratedWidgets([]);
            setActiveConversationId(conversationId);
            setSearchParams({ current: conversationId });
        },
        [setSearchParams, setActiveConversationId, setGeneratedWidgets]
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
                const userMessage = {
                    role: "user" as const,
                    content: suggestion,
                    timestamp: new Date(),
                };

                if (activeConversation) {
                    setActiveConversation(
                        activeConversation.clone({
                            messages: [...activeConversation.messages, userMessage],
                        })
                    );
                }

                await queryClient.setQueryData(
                    ["ai-conversation", activeConversationId],
                    (old: any) => {
                        if (!old) return old;
                        return {
                            ...old,
                            messages: [...(old.messages || []), userMessage],
                        };
                    }
                );

                await addMessageAsync({
                    conversationId: activeConversationId,
                    message: {
                        role: "user",
                        content: suggestion,
                    },
                });

                const result = await refineWidgetsAsync({
                    conversationId: activeConversationId,
                    refinementPrompt: suggestion,
                });

                setGeneratedWidgets(result.widgets as any);
                await queryClient.invalidateQueries({ queryKey: ["ai-conversation", activeConversationId] });
                await queryClient.invalidateQueries({ queryKey: ["widgets", "conversation", activeConversationId] });
                await queryClient.refetchQueries({
                    queryKey: ["ai-conversation", activeConversationId],
                    exact: true
                });
                await queryClient.refetchQueries({
                    queryKey: ["widgets", "conversation", activeConversationId],
                    exact: true
                });
            } catch (error) {
                console.error("Erreur suggestion:", error);
                setError(formatErrorMessage(error as any, "Erreur lors du raffinement"));
            } finally {
                setIsLoading(false);
            }
        },
        [activeConversationId, activeConversation, selectedSourceId, generatedWidgets, addMessageAsync, refineWidgetsAsync, queryClient, setGeneratedWidgets, setIsLoading, setError, setActiveConversation]
    );

    const handleConfirmDelete = useCallback(async () => {
        const currentWidgetToDelete = useAIStore.getState().widgetToDelete;
        if (currentWidgetToDelete) {
            await handleRemoveWidget(currentWidgetToDelete.id);
        }
    }, [handleRemoveWidget]);

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
