import WidgetConfigTabs from "./WidgetConfigTabs";
import { WIDGET_DATA_CONFIG } from "@/core/config/visualizations";
import type { WidgetType } from "@/domain/value-objects";
import { useWidgetTabs } from "@/application/hooks/widget/useWidgetTabs";
import { useWidgetForm } from "@hooks/widget/useWidgetForm";
import Button from "@/presentation/components/shared/forms/Button";
import type { ReactNode } from "react";
import { WidgetDataConfigSection, WidgetMetricStyleConfigSection, WidgetParamsConfigSection } from "../universal";
import { WidgetSaveTitleModal } from "../modals";

interface WidgetFormLayoutProps {
    title: string;
    isLoading: boolean;
    onSave: () => void;
    onCancel?: () => void;
    saveButtonText?: string;
    showCancelButton?: boolean;
    error?: string;
    additionalHeaderContent?: ReactNode;
    onModalConfirm?: () => void;
}

export default function WidgetFormLayout({
    title,
    isLoading,
    onSave,
    onCancel,
    saveButtonText = "Enregistrer",
    showCancelButton = false,
    error,
    additionalHeaderContent,
    onModalConfirm: customOnModalConfirm
}: WidgetFormLayoutProps) {
    const {
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
        draggedMetric,
        setDraggedMetric,
        handleMetricReorder,
    } = useWidgetForm();

    const availableTabs = useWidgetTabs(config, type);

    const handleDragStart = (idx: number) => {
        setDraggedMetric(idx);
    };

    const handleDragOver = () => { };

    const handleDrop = (targetIdx: number) => {
        if (draggedMetric !== null && draggedMetric !== targetIdx) {
            handleMetricReorder(draggedMetric, targetIdx);
        }
        setDraggedMetric(null);
    };

    const onModalConfirm = customOnModalConfirm || (() => {
        setShowSaveModal(false);
        onSave();
    });

    const hasMetrics = config?.metrics && Array.isArray(config.metrics) && config.metrics.length > 0;
    const hasConfig = config && Object.keys(config).length > 0;

    const previewConfig = {
        ...config,
        metrics: metricsWithLabels,
    };

    return (
        <>
            <div className="lg:h-[95vh] h-full flex flex-col min-h-0 overflow-hidden p-4">

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
                                        data={dataPreview as Record<string, any>[]}
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
                                        metricStyles={Array.isArray(config.metricStyles) ? config.metricStyles : []}
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
