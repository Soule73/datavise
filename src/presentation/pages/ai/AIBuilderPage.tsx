import { useEffect } from "react";
import { useAIStore } from "@store/aiStore";
import { useAIBuilderActions } from "@/application/hooks/ai/useAIBuilderActions";
import { useAIConversationList } from "@/application/hooks/ai/useAIConversationList";
import { useAIConversation } from "@/application/hooks/ai/useAIConversation";
import { useConversationWidgets } from "@/application/hooks/ai/useConversationWidgets";
import { useDataSourceList } from "@/application/hooks/datasource/useDataSourceList";
import { DeleteWidgetModal } from "@/presentation/pages/widget/components/modals";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { ROUTES } from "@/core/constants/routes";
import { getWidgetId, getWidgetName } from "@utils/aiHelpers";
import AuthLayout from "@/presentation/layout/AuthLayout";
import type { BreadcrumbItem } from "@datavise/ui";
import AIBuilderHeader from "./components/AIBuilderHeader";
import { AIConversationSidebar, AIGeneratedWidgetCard, AILoadingOverlay, AIMessageHistory } from "./components";

const aiBuilder = (conversationName?: string): BreadcrumbItem[] => [
    { label: "AI Builder", href: ROUTES.aiBuilder, icon: <SparklesIcon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" /> },
    ...(conversationName ? [{ label: conversationName }] : []),
];

export default function AIBuilderPage() {
    const {
        activeConversationId,
        activeConversation,
        generatedWidgets,
        error,
        isLoading,
        isSidebarOpen,
        widgetToDelete,
        setIsSidebarOpen,
        setActiveConversation,
        setConversations,
        setDataSources,
        setWidgetToDelete,
    } = useAIStore();

    const {
        handleSaveAll,
        handleReset,
        handleNewConversation,
        handleLoadConversation,
        handleDeleteConversation,
        handleUpdateTitle,
        handleSaveWidget,
        handleConfirmDelete,
    } = useAIBuilderActions();

    const { conversations: conversationsData } = useAIConversationList();
    const { data: conversationData } = useAIConversation(activeConversationId || null);
    const { data: conversationWidgetsData } = useConversationWidgets(activeConversationId || null);
    const { dataSources } = useDataSourceList();

    useEffect(() => {
        if (conversationsData && conversationsData.length > 0) {
            setConversations(conversationsData);
        }
    }, [conversationsData?.length]);

    useEffect(() => {
        if (conversationData && conversationData.id !== activeConversation?.id) {
            setActiveConversation(conversationData);
        }
    }, [conversationData?.id, activeConversation?.id]);

    useEffect(() => {
        if (dataSources && dataSources.length > 0) {
            setDataSources(dataSources);
        }
    }, [dataSources?.length]);

    const dataSourceSummary = activeConversation?.dataSourceSummary;
    const conversations = conversationsData || [];
    const widgets = conversationWidgetsData || generatedWidgets;


    return (
        <AuthLayout
            permission="widget:canCreate"
            breadcrumb={aiBuilder()}
        >
            {/* Conteneur principal avec hauteur fixe */}
            <div className="flex gap-4 h-[calc(100vh-3rem)] overflow-hiddens">
                {/* Sidebar gauche - Conversations (Float) */}
                <AIConversationSidebar
                    conversations={conversations}
                    activeConversation={activeConversation}
                    onSelectConversation={handleLoadConversation}
                    onNewConversation={handleNewConversation}
                    onDeleteConversation={handleDeleteConversation}
                    onUpdateTitle={handleUpdateTitle}
                    isOpen={isSidebarOpen}
                    onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                {/* Bouton flottant pour ouvrir le sidebar conversations */}
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all"
                        title="Ouvrir les conversations"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                )}

                {/* Zone principale - Contenu central */}
                <div className="flex-1 flex flex-col min-w-0 overflow-y-auto ">
                    {dataSourceSummary && <AIBuilderHeader
                        sourName={dataSourceSummary?.name || "Inconnue"}
                        widgetLength={widgets.length}
                        showActions={widgets.length > 0}
                        handleReset={handleReset}
                        handleSaveAll={handleSaveAll}
                    />}

                    {/* Widgets Grid - Plus d'espace */}
                    {widgets.length > 0 && (
                        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 px-6 pb-6">
                            {widgets.map((widget: any) => (
                                <AIGeneratedWidgetCard
                                    key={getWidgetId(widget)}
                                    widget={widget}
                                    onRemove={() =>
                                        setWidgetToDelete({
                                            id: getWidgetId(widget),
                                            title: getWidgetName(widget),
                                            _id: widget.id,
                                        })
                                    }
                                    onSave={() => handleSaveWidget(widget)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <svg
                                    className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <div className="flex-1">
                                    <p className="font-medium text-red-800 dark:text-red-300">Erreur</p>
                                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loading Overlay */}
                    <AILoadingOverlay isLoading={isLoading} />
                </div>

                {/* Sidebar droite - Historique des messages */}
                <AIMessageHistory />
            </div>

            {/* Modal de confirmation de suppression */}
            <DeleteWidgetModal
                open={!!widgetToDelete}
                onClose={() => setWidgetToDelete(null)}
                onDelete={handleConfirmDelete}
                loading={isLoading}
                widget={
                    widgetToDelete
                        ? ({ title: widgetToDelete.title } as any)
                        : null
                }
            />
        </AuthLayout>
    );
}
