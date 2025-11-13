import { useEffect, useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAIStore } from "@store/aiStore";
import { useAIWidgetGenerator } from "@hooks/ai/useAIWidgetGenerator";
import {
    useConversationsQuery,
    useConversationQuery,
    useCreateConversationMutation,
    useUpdateConversationTitleMutation,
    useDeleteConversationMutation,
    conversationKeys,
} from "@hooks/ai/useConversationsQuery";
import {
    useConversationWidgetsQuery,
    usePublishAllWidgetsMutation,
} from "@hooks/ai/useAIWidgetsQuery";
import { useDeleteWidgetMutation } from "@repositories/widgets";
import { aiConversationApi } from "@services/aiConversation";
import { getSources } from "@services/datasource";
import type { DataSource } from "@type/dataSource";
import type { AIGeneratedWidget } from "@type/aiTypes";
import type { WidgetConfig } from "@type/widgetTypes";
import { isValidObjectId } from "@utils/validation";
import { useNotificationStore } from "@store/notification";

export function useAIBuilderPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const aiGenerator = useAIWidgetGenerator();
    const { showNotification } = useNotificationStore();
    const [widgetToDelete, setWidgetToDelete] = useState<{
        id: string;
        title: string;
        _id?: string;
    } | null>(null);

    // Zustand store
    const {
        activeConversationId,
        generatedWidgets,
        selectedSourceId,
        userPrompt,
        refinementPrompt,
        maxWidgets,
        isSidebarOpen,
        setActiveConversationId,
        setGeneratedWidgets,
        setSelectedSourceId,
        setUserPrompt,
        setRefinementPrompt,
        setMaxWidgets,
        setIsSidebarOpen,
        resetState,
    } = useAIStore();

    // React Query hooks
    const { data: conversations = [] } = useConversationsQuery();

    const { data: activeConversation, isLoading: isLoadingConversation } =
        useConversationQuery(activeConversationId);

    const { data: conversationWidgets } = useConversationWidgetsQuery(activeConversationId);

    const createConversationMutation = useCreateConversationMutation();
    const updateTitleMutation = useUpdateConversationTitleMutation();
    const deleteConversationMutation = useDeleteConversationMutation();
    const publishAllMutation = usePublishAllWidgetsMutation();

    const deleteWidgetMutation = useDeleteWidgetMutation({
        queryClient,
        onSuccess: () => {
            showNotification({
                open: true,
                type: "success",
                title: "Widget supprimé avec succès",
            });
        },
        onError: (error: any) => {
            showNotification({
                open: true,
                type: "error",
                title: error?.message || "Erreur lors de la suppression du widget",
            });
        },
    });


    const handleConfirmDelete = async () => {
        if (widgetToDelete) {
            await handleRemoveWidget(widgetToDelete.id);
            setWidgetToDelete(null);
        }
    };


    // Data sources state
    const [dataSources, setDataSources] = useState<DataSource[]>([]);

    // Load data sources on mount
    useEffect(() => {
        loadDataSources();
    }, []);

    const loadDataSources = useCallback(async () => {
        try {
            const sources = await getSources();
            setDataSources(sources);
        } catch (err) {
            console.error("Erreur chargement sources:", err);
        }
    }, []);

    useEffect(() => {
        const conversationId = searchParams.get("current");

        if (conversationId && isValidObjectId(conversationId) && conversationId !== activeConversationId) {
            setActiveConversationId(conversationId);
        } else if (conversationId && !isValidObjectId(conversationId)) {
            setSearchParams({});
        }
        if (!conversationId && activeConversationId) {
            setSearchParams({ current: activeConversationId });
        }
    }, [searchParams]);

    // Sync widgets with conversation
    useEffect(() => {
        if (conversationWidgets && conversationWidgets.length > 0) {
            const aiWidgets: AIGeneratedWidget[] = conversationWidgets.map((w) => ({
                id: w.widgetId,
                _id: w._id,
                name: w.title,
                description: w.description || "",
                type: w.type,
                config: w.config as WidgetConfig,
                dataSourceId: w.dataSourceId.toString(),
                reasoning: w.reasoning || "",
                confidence: w.confidence || 0.8,
            }));
            setGeneratedWidgets(aiWidgets);
            aiGenerator.setWidgets(aiWidgets);
        }
    }, [conversationWidgets]);

    // Sync conversation metadata (dataSourceSummary & suggestions) when conversation loads
    useEffect(() => {
        if (activeConversation) {
            if (activeConversation.dataSourceSummary) {
                aiGenerator.setDataSourceSummary(activeConversation.dataSourceSummary);
            }
            if (activeConversation.suggestions && activeConversation.suggestions.length > 0) {
                aiGenerator.setSuggestions(activeConversation.suggestions);
            }
        }
    }, [activeConversation]);

    const handleGenerate = useCallback(async () => {
        if (!selectedSourceId) return;

        try {
            let convId = activeConversationId;
            let isNewConversation = false;

            if (!convId || !isValidObjectId(convId)) {
                const newConv = await createConversationMutation.mutateAsync({
                    dataSourceId: selectedSourceId,
                    initialPrompt: userPrompt || "Génération automatique",
                });
                convId = newConv._id;
                setActiveConversationId(convId);
                setSearchParams({ current: convId });
                isNewConversation = true;
            }

            if (userPrompt && convId && !isNewConversation) {
                await aiConversationApi.addMessage({
                    conversationId: convId,
                    role: "user",
                    content: userPrompt,
                });
                queryClient.invalidateQueries({ queryKey: conversationKeys.detail(convId) });
            }

            setUserPrompt("");

            const result = await aiGenerator.generateWidgets({
                dataSourceId: selectedSourceId,
                conversationId: convId,
                userPrompt: userPrompt || undefined,
                maxWidgets,
            });

            if (result.conversationTitle && convId) {
                await updateTitleMutation.mutateAsync({
                    conversationId: convId,
                    title: result.conversationTitle,
                });
            }

            setGeneratedWidgets(result.widgets);
        } catch (error) {
            console.error("Erreur génération:", error);
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
    ]);

    const handleRefine = useCallback(async () => {
        if (!refinementPrompt || !activeConversationId) return;

        try {
            await aiConversationApi.addMessage({
                conversationId: activeConversationId,
                role: "user",
                content: refinementPrompt,
            });
            queryClient.invalidateQueries({ queryKey: conversationKeys.detail(activeConversationId) });

            setRefinementPrompt("");

            const result = await aiGenerator.refineWidgets({
                dataSourceId: selectedSourceId,
                currentWidgets: generatedWidgets,
                refinementPrompt,
            });

            setGeneratedWidgets(result.widgets);
        } catch (error) {
            console.error("Erreur raffinement:", error);
        }
    }, [refinementPrompt, activeConversationId, generatedWidgets, selectedSourceId, aiGenerator, queryClient]);

    const handleSaveAll = useCallback(async () => {
        const widgetIds = generatedWidgets.filter((w) => w._id).map((w) => w._id!);
        if (widgetIds.length > 0) {
            await publishAllMutation.mutateAsync(widgetIds);
        }
    }, [generatedWidgets, publishAllMutation]);

    const handleReset = useCallback(() => {
        aiGenerator.reset();
        resetState();
        setActiveConversationId(null);
        setSearchParams({});
    }, [aiGenerator, resetState, setSearchParams]);

    const handleNewConversation = useCallback(() => {
        resetState();
        setSearchParams({});
        setActiveConversationId(null);
    }, [resetState, setSearchParams]);

    const handleLoadConversation = useCallback(
        async (conversationId: string) => {
            setActiveConversationId(conversationId);
            setSearchParams({ current: conversationId });
        },
        [setSearchParams]
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

            try {
                await aiConversationApi.addMessage({
                    conversationId: activeConversationId,
                    role: "user",
                    content: suggestion,
                });
                queryClient.invalidateQueries({ queryKey: conversationKeys.detail(activeConversationId) });

                const result = await aiGenerator.refineWidgets({
                    dataSourceId: selectedSourceId,
                    currentWidgets: generatedWidgets,
                    refinementPrompt: suggestion,
                });

                setGeneratedWidgets(result.widgets);
            } catch (error) {
                console.error("Erreur suggestion:", error);
            }
        },
        [activeConversationId, selectedSourceId, generatedWidgets, aiGenerator, queryClient]
    );

    const handleRemoveWidget = useCallback(
        async (widgetId: string) => {
            const widget = generatedWidgets.find((w) => w.id === widgetId);

            if (widget?._id) {
                await deleteWidgetMutation.mutateAsync(widget._id);
            }

            aiGenerator.removeWidget(widgetId);
            setGeneratedWidgets(generatedWidgets.filter((w) => w.id !== widgetId));
        },
        [aiGenerator, generatedWidgets, setGeneratedWidgets, deleteWidgetMutation]
    );

    const handleSaveWidget = useCallback(
        async (widget: AIGeneratedWidget) => {
            const result = await aiGenerator.saveWidget(widget);
            if (result) {
                const updatedWidgets = generatedWidgets.map((w) =>
                    w.id === widget.id ? { ...w, _id: result._id } : w
                );
                setGeneratedWidgets(updatedWidgets);
            }
            return result;
        },
        [aiGenerator, generatedWidgets, setGeneratedWidgets]
    );

    // Memoized values
    const isLoading = useMemo(
        () =>
            aiGenerator.isLoading ||
            createConversationMutation.isPending ||
            publishAllMutation.isPending ||
            deleteWidgetMutation.isPending ||
            isLoadingConversation,
        [
            aiGenerator.isLoading,
            createConversationMutation.isPending,
            publishAllMutation.isPending,
            deleteWidgetMutation.isPending,
            isLoadingConversation,
        ]
    );

    return {
        // Data
        dataSources,
        conversations,
        activeConversation,
        widgets: generatedWidgets,
        dataSourceSummary: aiGenerator.dataSourceSummary,
        suggestions: aiGenerator.suggestions,
        error: aiGenerator.error,

        // State
        selectedSourceId,
        userPrompt,
        refinementPrompt,
        maxWidgets,
        isLoading,
        isSidebarOpen,

        // Setters
        setSelectedSourceId,
        setUserPrompt,
        setRefinementPrompt,
        setMaxWidgets,
        setIsSidebarOpen,

        // Actions
        handleGenerate,
        handleRefine,
        handleSaveAll,
        handleReset,
        handleNewConversation,
        handleLoadConversation,
        handleDeleteConversation,
        handleUpdateTitle,
        handleSuggestionClick,
        setWidgetToDelete,
        widgetToDelete,
        handleConfirmDelete,
        handleSaveWidget
    };
}
