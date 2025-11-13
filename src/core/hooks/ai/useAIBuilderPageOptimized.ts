import { useEffect, useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAIStore } from "@store/aiStore";
import { useAIWidgetGenerator } from "@hooks/ai/useAIWidgetGenerator";
import {
    useConversationsQuery,
    useConversationQuery,
    useCreateConversationMutation,
    useUpdateConversationTitleMutation,
    useDeleteConversationMutation,
} from "@hooks/ai/useConversationsQuery";
import {
    useConversationWidgetsQuery,
    usePublishAllWidgetsMutation,
} from "@hooks/ai/useAIWidgetsQuery";
import { aiConversationApi } from "@services/aiConversation";
import { getSources } from "@services/datasource";
import type { DataSource } from "@type/dataSource";
import type { AIGeneratedWidget } from "@type/aiTypes";
import type { WidgetConfig } from "@type/widgetTypes";

export function useAIBuilderPageOptimized() {
    const [searchParams, setSearchParams] = useSearchParams();
    const aiGenerator = useAIWidgetGenerator();

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

    // Restore conversation from URL
    useEffect(() => {
        const conversationId = searchParams.get("current");
        if (conversationId && conversationId !== activeConversationId) {
            setActiveConversationId(conversationId);
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

    const handleGenerate = useCallback(async () => {
        if (!selectedSourceId) return;

        try {
            let convId = activeConversationId;

            // Create conversation if needed
            if (!convId || convId === "temp-new") {
                const newConv = await createConversationMutation.mutateAsync({
                    dataSourceId: selectedSourceId,
                    initialPrompt: userPrompt || "Génération automatique",
                });
                convId = newConv._id;
                setActiveConversationId(convId);
                setSearchParams({ current: convId });
            }

            // Add user message
            if (userPrompt && convId) {
                await aiConversationApi.addMessage({
                    conversationId: convId,
                    role: "user",
                    content: userPrompt,
                });
            }

            // Generate widgets
            const result = await aiGenerator.generateWidgets({
                dataSourceId: selectedSourceId,
                conversationId: convId,
                userPrompt: userPrompt || undefined,
                maxWidgets,
            });

            // Update title if generated
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
    ]);

    const handleRefine = useCallback(async () => {
        if (!refinementPrompt || !activeConversationId) return;

        try {
            const result = await aiGenerator.refineWidgets({
                dataSourceId: selectedSourceId,
                currentWidgets: generatedWidgets,
                refinementPrompt,
            });

            await aiConversationApi.addMessage({
                conversationId: activeConversationId,
                role: "user",
                content: refinementPrompt,
            });

            setGeneratedWidgets(result.widgets);
            setRefinementPrompt("");
        } catch (error) {
            console.error("Erreur raffinement:", error);
        }
    }, [refinementPrompt, activeConversationId, generatedWidgets, selectedSourceId]);

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
        setActiveConversationId("temp-new");
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

    // Memoized values
    const isLoading = useMemo(
        () =>
            aiGenerator.isLoading ||
            createConversationMutation.isPending ||
            publishAllMutation.isPending ||
            isLoadingConversation,
        [
            aiGenerator.isLoading,
            createConversationMutation.isPending,
            publishAllMutation.isPending,
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
        removeWidget: aiGenerator.removeWidget,
        saveWidget: aiGenerator.saveWidget,
    };
}
