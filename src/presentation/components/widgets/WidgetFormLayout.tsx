import WidgetConfigTabs from "@components/widgets/WidgetConfigTabs";
import WidgetDataConfigSection from "@components/widgets/WidgetDataConfigSection";
import WidgetSaveTitleModal from "@components/widgets/WidgetSaveTitleModal";
import WidgetMetricStyleConfigSection from "@components/widgets/WidgetMetricStyleConfigSection";
import WidgetParamsConfigSection from "@components/widgets/WidgetParamsConfigSection";
import { WIDGET_DATA_CONFIG } from "@/core/config/visualizations";
import type { WidgetType } from "@/domain/value-objects";
import { useWidgetTabs } from "@/application/hooks/widget/useWidgetTabs";
import Button from "@components/forms/Button";
import type { ReactNode } from "react";

interface WidgetFormLayoutProps {
    title: string;
    isLoading: boolean;
    onSave: () => void;
    onCancel?: () => void;
    saveButtonText?: string;
    showCancelButton?: boolean;
    WidgetComponent: React.ComponentType<any>;
    dataPreview: any[];
    config: any;
    metricsWithLabels: any[];
    isPreviewReady: boolean;
    type: WidgetType;
    tab: "data" | "params" | "metricsAxes";
    setTab: (tab: "data" | "params" | "metricsAxes") => void;
    columns: string[];
    handleConfigChange: (field: string, value: unknown) => void;
    handleDragStart: (idx: number) => void;
    handleDragOver: (idx: number, e: React.DragEvent) => void;
    handleDrop: (idx: number) => void;
    handleMetricAggOrFieldChange: (idx: number, field: "agg" | "field", value: string) => void;
    handleMetricStyleChange: (idx: number, style: string, value: unknown) => void;
    showSaveModal: boolean;
    setShowSaveModal: (show: boolean) => void;
    widgetTitle: string;
    setWidgetTitle: (title: string) => void;
    visibility: "public" | "private";
    setVisibility: (visibility: "public" | "private") => void;
    widgetTitleError: string;
    setWidgetTitleError: (error: string) => void;
    onModalConfirm: () => void;
    error?: string;
    additionalHeaderContent?: ReactNode;
}

export default function WidgetFormLayout({
    title,
    isLoading,
    onSave,
    onCancel,
    saveButtonText = "Enregistrer",
    showCancelButton = false,
    WidgetComponent,
    dataPreview,
    config,
    metricsWithLabels,
    isPreviewReady,
    type,
    tab,
    setTab,
    columns,
    handleConfigChange,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleMetricAggOrFieldChange,
    handleMetricStyleChange,
    showSaveModal,
    setShowSaveModal,
    widgetTitle,
    setWidgetTitle,
    visibility,
    setVisibility,
    widgetTitleError,
    setWidgetTitleError,
    onModalConfirm,
    error,
    additionalHeaderContent
}: WidgetFormLayoutProps) {

    const availableTabs = useWidgetTabs(config, type);

    const hasMetrics = config?.metrics && Array.isArray(config.metrics) && config.metrics.length > 0;
    const hasConfig = config && Object.keys(config).length > 0;

    const previewConfig = {
        ...config,
        metrics: metricsWithLabels,
    };

    return (
        <>
            <div className="lg:h-[90vh] h-full flex flex-col min-h-0 overflow-hidden">

                <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-4">
                        <h1>
                            {title}
                        </h1>
                        {additionalHeaderContent}
                    </div>
                    <div className="flex gap-3">
                        {showCancelButton && onCancel && (
                            <Button
                                variant="outline"
                                color="gray"
                                className=" w-max!"

                                onClick={onCancel}
                                disabled={isLoading}
                            >
                                Annuler
                            </Button>
                        )}
                        <Button
                            variant="solid"
                            color="indigo"
                            className=" w-max!"
                            onClick={onSave}
                            disabled={isLoading || !isPreviewReady}
                        >
                            {isLoading ? "Sauvegarde..." : saveButtonText}
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row lg:flex-row h-full min-h-0 gap-6">
                    {/* Colonne aperçu (preview): sticky/fixée, jamais scrollable */}
                    <div className="order-1 md:w-1/2 lg:w-2/3 shrink-0 flex flex-col lg:sticky lg:top-0 h-full">
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg h-full">
                            <WidgetComponent
                                data={dataPreview}
                                config={previewConfig}
                            />
                        </div>
                    </div>

                    {/* Colonne config (droite): scrollable indépendamment */}
                    <div className="order-2 md:w-1/2 lg:w-1/3 flex flex-col h-full">
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg h-full flex flex-col">
                            {/* Tabs conditionnels */}
                            {availableTabs.length > 1 && (
                                <div className="border-b border-gray-200 dark:border-gray-800">
                                    <WidgetConfigTabs
                                        tab={tab}
                                        setTab={setTab}
                                        availableTabs={availableTabs}
                                    />
                                </div>
                            )}

                            {/* Contenu scrollable */}
                            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 config-scrollbar">
                                {error && (
                                    <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                                        {error}
                                    </div>
                                )}

                                {tab === "data" && (
                                    <WidgetDataConfigSection
                                        type={type}
                                        dataConfig={WIDGET_DATA_CONFIG[type as WidgetType]}
                                        config={previewConfig}
                                        columns={columns}
                                        data={dataPreview}
                                        handleConfigChange={handleConfigChange}
                                        handleDragStart={handleDragStart}
                                        handleDragOver={handleDragOver}
                                        handleDrop={handleDrop}
                                        handleMetricAggOrFieldChange={handleMetricAggOrFieldChange}
                                    />
                                )}

                                {tab === "metricsAxes" && hasMetrics && (
                                    <WidgetMetricStyleConfigSection
                                        type={type}
                                        metrics={metricsWithLabels}
                                        metricStyles={config.metricStyles || []}
                                        handleMetricStyleChange={handleMetricStyleChange}
                                    />
                                )}

                                {tab === "params" && hasConfig && (
                                    <WidgetParamsConfigSection
                                        type={type}
                                        config={config}
                                        handleConfigChange={handleConfigChange}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de confirmation pour le titre du widget */}
            <WidgetSaveTitleModal
                open={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                title={widgetTitle}
                setTitle={setWidgetTitle}
                visibility={visibility}
                setVisibility={setVisibility}
                error={widgetTitleError}
                setError={setWidgetTitleError}
                loading={isLoading}
                onConfirm={onModalConfirm}
            />
        </>
    );
}
