import { useAIBuilderPage } from "@hooks/ai/useAIBuilderPage";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AIBuilderHeader from "@components/ai/AIBuilderHeader";
import AIConfigurationForm from "@components/ai/AIConfigurationForm";
import AIResultsSummary from "@components/ai/AIResultsSummary";
import AILoadingOverlay from "@components/ai/AILoadingOverlay";
import AIGeneratedWidgetCard from "@components/ai/AIGeneratedWidgetCard";
import AIConversationSidebar from "@components/ai/AIConversationSidebar";
import AIMessageHistory from "@components/ai/AIMessageHistory";
import Button from "@components/forms/Button";

export default function AIBuilderPage() {
    const [searchParams] = useSearchParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const {
        dataSources,
        selectedSourceId,
        setSelectedSourceId,
        userPrompt,
        setUserPrompt,
        maxWidgets,
        setMaxWidgets,
        refinementPrompt,
        setRefinementPrompt,
        widgets,
        dataSourceSummary,
        suggestions,
        error,
        isLoading,
        handleGenerate,
        handleRefine,
        handleSaveAll,
        handleReset,
        handleNewConversation,
        removeWidget,
        saveWidget,
        handleLoadConversation,
        conversation,
    } = useAIBuilderPage();

    // Ouvrir automatiquement le sidebar si aucune conversation n'est active
    useEffect(() => {
        const currentConversationId = searchParams.get("current");
        if (!currentConversationId && !conversation.activeConversation) {
            setIsSidebarOpen(true);
        }
    }, [searchParams, conversation.activeConversation]);

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
            {/* Sidebar gauche - Conversations (avec bouton flottant) */}
            <AIConversationSidebar
                conversations={conversation.conversations}
                activeConversation={conversation.activeConversation}
                onSelectConversation={handleLoadConversation}
                onNewConversation={handleNewConversation}
                onDeleteConversation={conversation.deleteConversation}
                onUpdateTitle={conversation.updateTitle}
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* Zone principale - Widgets */}
            <div className="flex-1 overflow-y-auto relative">
                {/* Indicateur pour ouvrir le sidebar des conversations (gauche) */}
                {!isSidebarOpen && (
                    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-30">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="bg-indigo-600/90 hover:bg-indigo-700 text-white px-2 py-8 rounded-r-lg shadow-lg transition-all hover:px-3"
                            title="Ouvrir les conversations"
                        >
                            <svg
                                className="w-4 h-4"
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
                    </div>
                )}

                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 transition-all duration-300">
                    <div className="space-y-6">
                        {/* Header */}
                        <AIBuilderHeader
                            title="AI Builder"
                            description="Laissez l'intelligence artificielle analyser vos données et générer automatiquement des visualisations pertinentes."
                        />

                        {/* Message si aucune conversation active */}
                        {!conversation.activeConversation ? (
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-sm p-12 text-center border border-indigo-100 dark:border-gray-700">
                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-10 h-10 text-indigo-600 dark:text-indigo-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                    Commencez une nouvelle conversation
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                                    Créez une nouvelle conversation pour commencer à générer des visualisations avec l'IA, ou sélectionnez une conversation existante dans la barre latérale pour continuer.
                                </p>
                                <Button
                                    onClick={handleNewConversation}
                                    color="indigo"
                                    size="lg"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    Nouvelle conversation
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/* Configuration Form - Only show when no widgets */}
                                {widgets.length === 0 && (
                                    <AIConfigurationForm
                                        dataSources={dataSources}
                                        selectedSourceId={selectedSourceId}
                                        onSourceChange={setSelectedSourceId}
                                        userPrompt={userPrompt}
                                        onPromptChange={setUserPrompt}
                                        maxWidgets={maxWidgets}
                                        onMaxWidgetsChange={setMaxWidgets}
                                        onGenerate={handleGenerate}
                                        isLoading={isLoading}
                                    />
                                )}

                                {/* Results Summary - Only show when widgets exist */}
                                {widgets.length > 0 && (
                                    <>
                                        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="text-2xl font-bold dark:text-white">
                                                    {widgets.length} Visualisation{widgets.length > 1 ? "s" : ""}{" "}
                                                    générée{widgets.length > 1 ? "s" : ""}
                                                </h2>
                                                <div className="flex gap-3">
                                                    <Button
                                                        onClick={handleReset}
                                                        color="gray"
                                                        variant="outline"
                                                        className="!w-max !min-w-40"
                                                    >
                                                        Recommencer
                                                    </Button>
                                                    <Button
                                                        onClick={handleSaveAll}
                                                        color="indigo"
                                                        className="!w-max !min-w-40"
                                                    >
                                                        Sauvegarder tous
                                                    </Button>
                                                </div>
                                            </div>

                                            <AIResultsSummary
                                                dataSourceSummary={dataSourceSummary}
                                                suggestions={suggestions}
                                            />
                                        </div>

                                        {/* Widgets Grid */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {widgets.map((widget) => (
                                                <AIGeneratedWidgetCard
                                                    key={widget.id}
                                                    widget={widget}
                                                    onRemove={() => removeWidget(widget.id)}
                                                    onSave={saveWidget}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Error Display - Show only if conversation active */}
                                {conversation.activeConversation && error && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 shadow-sm">
                                        <div className="flex items-start">
                                            <svg
                                                className="w-5 h-5 mr-2 mt-0.5"
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
                                            <div>
                                                <p className="font-medium">Erreur</p>
                                                <p className="text-sm mt-1">{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Loading Overlay */}
                                <AILoadingOverlay isLoading={isLoading} />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar droite - Historique des messages (toujours visible) */}
            {conversation.activeConversation && (
                <div className=" w-96 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-l from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                        <h2 className="text-lg font-semibold dark:text-white">
                            Historique
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Conversation avec l'IA
                        </p>
                    </div>
                    <AIMessageHistory
                        messages={conversation.activeConversation.messages}
                        refinementPrompt={refinementPrompt}
                        isLoading={isLoading}
                        onPromptChange={setRefinementPrompt}
                        onRefine={handleRefine}
                        className="flex-1"
                    />
                </div>
            )}
        </div>
    );
}
