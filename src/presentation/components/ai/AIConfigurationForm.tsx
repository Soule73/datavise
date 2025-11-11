import Button from "@components/forms/Button";
import type { DataSource } from "@type/dataSource";

interface AIConfigurationFormProps {
    dataSources: DataSource[];
    selectedSourceId: string;
    userPrompt: string;
    maxWidgets: number;
    isLoading: boolean;
    onSourceChange: (sourceId: string) => void;
    onPromptChange: (prompt: string) => void;
    onMaxWidgetsChange: (max: number) => void;
    onGenerate: () => void;
}

export default function AIConfigurationForm({
    dataSources,
    selectedSourceId,
    userPrompt,
    maxWidgets,
    isLoading,
    onSourceChange,
    onPromptChange,
    onMaxWidgetsChange,
    onGenerate,
}: AIConfigurationFormProps) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Configuration</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Source de données *
                    </label>
                    <select
                        value={selectedSourceId}
                        onChange={(e) => onSourceChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white"
                        disabled={isLoading}
                    >
                        <option value="">-- Sélectionner une source --</option>
                        {dataSources.map((source) => (
                            <option key={source._id} value={source._id}>
                                {source.name} ({source.type})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Instructions pour l'IA (optionnel)
                    </label>
                    <textarea
                        value={userPrompt}
                        onChange={(e) => onPromptChange(e.target.value)}
                        placeholder="Ex: Je veux voir les tendances de ventes par mois et par catégorie..."
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white placeholder-gray-400"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Nombre maximum de widgets
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={maxWidgets}
                        onChange={(e) => onMaxWidgetsChange(Number(e.target.value))}
                        className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white"
                        disabled={isLoading}
                    />
                </div>

                <Button
                    onClick={onGenerate}
                    disabled={!selectedSourceId || isLoading}
                    color="indigo"
                    className=" !w-max"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg
                                className="animate-spin h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Génération en cours...
                        </span>
                    ) : (
                        "Générer les widgets"
                    )}
                </Button>
            </div>
        </div>
    );
}
