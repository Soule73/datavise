import { useNavigate } from "react-router-dom";
import type { AIGeneratedWidget } from "@type/aiTypes";
import { WIDGETS } from "@adapters/visualizations";
import { useAIWidgetGenerator } from "@hooks/ai/useAIWidgetGenerator";
import { useState, useEffect } from "react";
import { fetchSourceData } from "@services/datasource";
import Button from "@components/forms/Button";
import {
    CheckIcon,
    PencilIcon,
    TrashIcon,
    SparklesIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

interface Props {
    widget: AIGeneratedWidget;
    onRemove: () => void;
}

export default function AIGeneratedWidgetCard({ widget, onRemove }: Props) {
    const navigate = useNavigate();
    const { saveWidget } = useAIWidgetGenerator();
    const widgetMeta = WIDGETS[widget.type as keyof typeof WIDGETS];

    // État pour les données de prévisualisation
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [isLoadingPreview, setIsLoadingPreview] = useState(true);

    // Charger les données pour la prévisualisation
    useEffect(() => {
        const loadPreviewData = async () => {
            try {
                setIsLoadingPreview(true);
                const result = await fetchSourceData({
                    sourceId: widget.dataSourceId,
                    options: {
                        page: 1,
                        pageSize: 100, // Limiter pour la preview
                    }
                });

                // Gérer les différents formats de retour
                if (Array.isArray(result)) {
                    setPreviewData(result);
                } else if (result && 'data' in result && Array.isArray(result.data)) {
                    setPreviewData(result.data);
                } else {
                    setPreviewData([]);
                }
            } catch (error) {
                console.error("Erreur chargement preview:", error);
                setPreviewData([]);
            } finally {
                setIsLoadingPreview(false);
            }
        };

        loadPreviewData();
    }, [widget.dataSourceId]);

    // Récupérer le composant de visualisation
    const WidgetComponent = widgetMeta?.component;

    const handleEdit = () => {
        // Créer une URL vers la page de création avec les données pré-remplies
        const params = new URLSearchParams({
            sourceId: widget.dataSourceId,
            type: widget.type,
            aiData: JSON.stringify(widget),
        });
        navigate(`/widgets/create?${params.toString()}`);
    };

    const handleSave = async () => {
        try {
            await saveWidget(widget);
        } catch (error) {
            console.error("Erreur sauvegarde:", error);
        }
    };

    const confidenceColor =
        widget.confidence >= 0.8
            ? "text-green-600"
            : widget.confidence >= 0.6
                ? "text-yellow-600"
                : "text-red-600";

    const confidenceBg =
        widget.confidence >= 0.8
            ? "bg-green-100"
            : widget.confidence >= 0.6
                ? "bg-yellow-100"
                : "bg-red-100";

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {widgetMeta?.icon && (
                        <div className="w-10 h-10 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded">
                            {typeof widgetMeta.icon === "string" ? (
                                <span className="text-purple-600 dark:text-purple-400 text-xl">{widgetMeta.icon}</span>
                            ) : (
                                <widgetMeta.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            )}
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-lg dark:text-white">{widget.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{widgetMeta?.label}</p>
                    </div>
                </div>
                <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${confidenceBg} ${confidenceColor}`}
                >
                    {Math.round(widget.confidence * 100)}%
                </span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4">{widget.description}</p>

            {/* Prévisualisation du widget */}
            {WidgetComponent && widget.config ? (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">Aperçu</div>
                    {isLoadingPreview ? (
                        <div className="flex items-center justify-center h-48">
                            <SparklesIcon className="w-8 h-8 text-purple-500 animate-pulse" />
                        </div>
                    ) : previewData.length > 0 ? (
                        <div
                            className="widget-preview overflow-hidden"
                            style={{
                                minHeight: '300px',
                                maxHeight: '500px',
                                position: 'relative'
                            }}
                        >
                            <div className="w-full h-full overflow-auto">
                                <WidgetComponent
                                    data={previewData}
                                    config={widget.config}
                                    editMode={false}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500">
                            <p>Aucune donnée disponible</p>
                        </div>
                    )}
                </div>
            ) : !widget.config && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-4 border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                        <ExclamationTriangleIcon className="w-5 h-5" />
                        <p className="text-sm font-medium">Configuration manquante</p>
                    </div>
                    <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-2">
                        L'IA n'a pas retourné de configuration complète. Vérifiez les logs du serveur.
                    </p>
                </div>
            )}

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-3 mb-4 text-sm border border-purple-200 dark:border-purple-800">
                <p className="font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                    <SparklesIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Pourquoi ce widget ?
                </p>
                <p className="text-gray-600 dark:text-gray-400">{widget.reasoning}</p>
            </div>

            {/* Configuration summary */}
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mb-4 border-t dark:border-gray-700 pt-3">
                {widget.config?.metrics && widget.config.metrics.length > 0 && (
                    <div>
                        <span className="font-medium">Métriques:</span>{" "}
                        {widget.config.metrics
                            .map((m: any) => `${m.label || m.field} (${m.agg || m.aggregation})`)
                            .join(", ")}
                    </div>
                )}
                {widget.config?.buckets && widget.config.buckets.length > 0 && (
                    <div>
                        <span className="font-medium">Groupement:</span>{" "}
                        {widget.config.buckets.map((b: any) => b.field || b).join(", ")}
                    </div>
                )}
                {widget.config?.globalFilters &&
                    widget.config.globalFilters.length > 0 && (
                        <div>
                            <span className="font-medium">Filtres:</span>{" "}
                            {widget.config.globalFilters.length}
                        </div>
                    )}

                {!widget.config && (
                    <div className="text-yellow-600 dark:text-yellow-400">
                        Configuration manquante - vérifiez les logs serveur
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <Button
                    onClick={handleSave}
                    color="green"
                    className="flex-1"
                >
                    <CheckIcon className="w-4 h-4 mr-1" />
                    Sauvegarder
                </Button>
                <Button
                    onClick={handleEdit}
                    color="gray"
                    variant="outline"
                >
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Éditer
                </Button>
                <Button
                    onClick={onRemove}
                    color="red"
                    variant="outline"
                >
                    <TrashIcon className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
