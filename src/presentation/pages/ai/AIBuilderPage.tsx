import { useAIBuilderPage } from "@hooks/ai/useAIBuilderPage";
import AIBuilderHeader from "@components/ai/AIBuilderHeader";
import AIConfigurationForm from "@components/ai/AIConfigurationForm";
import AIResultsSummary from "@components/ai/AIResultsSummary";
import AIRefinementPanel from "@components/ai/AIRefinementPanel";
import AILoadingOverlay from "@components/ai/AILoadingOverlay";
import AIGeneratedWidgetCard from "@components/ai/AIGeneratedWidgetCard";
import Button from "@components/forms/Button";

export default function AIBuilderPage() {
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
        removeWidget,
    } = useAIBuilderPage();

    return (
        <div className=" max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
                {/* Header */}
                <AIBuilderHeader
                    title="AI Builder"
                    description="Laissez l'intelligence artificielle analyser vos données et générer automatiquement des visualisations pertinentes. Sélectionnez une source de données et décrivez ce que vous souhaitez voir (optionnel)."
                />

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
                                    >
                                        Recommencer
                                    </Button>
                                    <Button
                                        onClick={handleSaveAll}
                                        color="indigo"
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
                                />
                            ))}
                        </div>

                        {/* Refinement Panel */}
                        <AIRefinementPanel
                            refinementPrompt={refinementPrompt}
                            onPromptChange={setRefinementPrompt}
                            onRefine={handleRefine}
                            isLoading={isLoading}
                        />
                    </>
                )}

                {/* Error Display */}
                {error && (
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
            </div>
        </div>
    );
}
