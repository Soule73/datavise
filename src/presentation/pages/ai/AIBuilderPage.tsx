import { useAIBuilderPage } from "@hooks/ai/useAIBuilderPage";
import AILoadingOverlay from "@components/ai/AILoadingOverlay";
import AIGeneratedWidgetCard from "@components/ai/AIGeneratedWidgetCard";
import AIConversationSidebar from "@components/ai/AIConversationSidebar";
import AIMessageHistory from "@components/ai/AIMessageHistory";
import { DeleteWidgetModal } from "@components/widgets/DeleteWidgetModal";
import AuthLayout from "@/presentation/components/layouts/AuthLayout";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { ROUTES } from "@/core/constants/routes";
import type { BreadcrumbItem } from "@/presentation/components/layouts/Breadcrumb";
import AIBuilderHeader from "@/presentation/components/ai/AIBuilderHeader";

const aiBuilder = (conversationName?: string): BreadcrumbItem[] => [
    { label: "AI Builder", href: ROUTES.aiBuilder, icon: <SparklesIcon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" /> },
    ...(conversationName ? [{ label: conversationName }] : []),
];

export default function AIBuilderPage() {


    const {
        dataSources,
        conversations,
        activeConversation,
        widgets,
        suggestions,
        error,
        selectedSourceId,
        userPrompt,
        refinementPrompt,
        maxWidgets,
        isLoading,
        isSidebarOpen,
        setSelectedSourceId,
        setUserPrompt,
        setRefinementPrompt,
        setMaxWidgets,
        setIsSidebarOpen,
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
        handleSaveWidget,
        handleConfirmDelete,
    } = useAIBuilderPage();

    const dataSourceSummary = activeConversation?.dataSourceSummary;


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
                            {widgets.map((widget) => (
                                <AIGeneratedWidgetCard
                                    key={widget.id}
                                    widget={widget}
                                    onRemove={() =>
                                        setWidgetToDelete({
                                            id: widget.id,
                                            title: widget.name,
                                            _id: widget._id,
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
                <div className="w-96 rounded-r-lg border-l border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {activeConversation ? "Historique" : "Nouvelle conversation"}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {activeConversation ? "Conversation avec l'IA" : "Configurez et démarrez"}
                        </p>
                    </div>
                    <AIMessageHistory
                        messages={activeConversation?.messages || []}
                        refinementPrompt={refinementPrompt}
                        isLoading={isLoading}
                        suggestions={suggestions}
                        hasActiveConversation={!!activeConversation}
                        dataSources={dataSources}
                        selectedSourceId={selectedSourceId}
                        maxWidgets={maxWidgets}
                        userPrompt={userPrompt}
                        onPromptChange={setRefinementPrompt}
                        onRefine={handleRefine}
                        onSuggestionClick={handleSuggestionClick}
                        onSourceChange={setSelectedSourceId}
                        onMaxWidgetsChange={setMaxWidgets}
                        onUserPromptChange={setUserPrompt}
                        onGenerate={handleGenerate}
                        className="flex-1"
                    />
                </div>
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
