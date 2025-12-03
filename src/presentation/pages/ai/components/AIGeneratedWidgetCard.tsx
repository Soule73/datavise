import { useNavigate } from "react-router-dom";
import type { Widget } from "@domain/entities/Widget.entity";
import { WIDGETS } from "@/core/config/visualizations";
import { useState, useEffect } from "react";
import { DataSourceRepository } from "@/infrastructure/repositories/DataSourceRepository";
import {
    CheckIcon,
    PencilIcon,
    TrashIcon,
    SparklesIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { Button } from "@datavise/ui";

interface Props {
    widget: Widget;
    onRemove: () => void;
    onSave: (widget: Widget) => Promise<any>;
}

export default function AIGeneratedWidgetCard({ widget, onRemove, onSave }: Props) {
    const navigate = useNavigate();
    const widgetMeta = WIDGETS[widget.type as keyof typeof WIDGETS];

    const isSaved = !!widget.id && !widget.isDraft;

    const [previewData, setPreviewData] = useState<any[]>([]);
    const [isLoadingPreview, setIsLoadingPreview] = useState(true);

    // Charger les données pour la prévisualisation
    useEffect(() => {
        const loadPreviewData = async () => {
            try {
                setIsLoadingPreview(true);
                const dataSourceRepository = new DataSourceRepository();
                const result = await dataSourceRepository.fetchData(widget.dataSourceId, {
                    page: 1,
                    pageSize: 100,
                });

                setPreviewData(result || []);
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

    const handleSave = async () => {
        try {
            await onSave(widget);
        } catch (error) {
            console.error("Erreur sauvegarde:", error);
        }
    };

    const confidenceColor =
        (widget.confidence || 0) >= 0.8
            ? "text-green-600"
            : (widget.confidence || 0) >= 0.6
                ? "text-yellow-600"
                : "text-red-600";

    const confidenceBg =
        (widget.confidence || 0) >= 0.8
            ? "bg-green-100"
            : (widget.confidence || 0) >= 0.6
                ? "bg-yellow-100"
                : "bg-red-100";

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg  p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all">
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
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg dark:text-white">{widget.title}</h3>
                            {isSaved && (
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                                    ✓ Sauvegardé
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{widgetMeta?.label}</p>
                    </div>
                </div>
                <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${confidenceBg} ${confidenceColor}`}
                >
                    {Math.round((widget.confidence || 0) * 100)}%
                </span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4">{widget.description}</p>

            {/* Prévisualisation du widget */}
            {WidgetComponent && widget.config ? (
                <>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">Aperçu</div>
                    {isLoadingPreview ? (
                        <div className="flex items-center justify-center h-48">
                            <SparklesIcon className="w-8 h-8 text-purple-500 animate-pulse" />
                        </div>
                    ) : previewData.length > 0 ? (
                        <div
                            className=" w-full h-92 mb-4"
                        >
                            <div
                                //widget-preview
                                className=" overflow-hidden w-full h-full bg-gray-50 dark:bg-gray-800 rounded-lg mb-16 border border-gray-200 dark:border-gray-700"
                            >
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
                </>
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
                {(widget.config as any)?.metrics && (widget.config as any).metrics.length > 0 && (
                    <div>
                        <span className="font-medium">Métriques:</span>{" "}
                        {(widget.config as any).metrics
                            .map((m: any) => `${m.label || m.field} (${m.agg || m.aggregation})`)
                            .join(", ")}
                    </div>
                )}
                {(widget.config as any)?.buckets && (widget.config as any).buckets.length > 0 && (
                    <div>
                        <span className="font-medium">Groupement:</span>{" "}
                        {(widget.config as any).buckets.map((b: any) => b.field || b).join(", ")}
                    </div>
                )}
                {(widget.config as any)?.globalFilters &&
                    (widget.config as any).globalFilters.length > 0 && (
                        <div>
                            <span className="font-medium">Filtres:</span>{" "}
                            {(widget.config as any).globalFilters.length}
                        </div>
                    )}

                {!widget.config && (
                    <div className="text-yellow-600 dark:text-yellow-400">
                        Configuration manquante - vérifiez les logs serveur
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                {!isSaved ? (
                    <Button
                        onClick={handleSave}
                        color="green"
                        className="flex-1"
                    >
                        <CheckIcon className="w-4 h-4 mr-1" />
                        Sauvegarder
                    </Button>
                ) : (
                    <Button
                        onClick={() => navigate(`/widgets/edit/${widget.id}`)}
                        color="indigo"
                        className="flex-1"
                    >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Modifier
                    </Button>
                )}
                <Button
                    onClick={onRemove}
                    color="red"
                    variant="outline"
                    className="w-max!"
                >
                    <TrashIcon className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
