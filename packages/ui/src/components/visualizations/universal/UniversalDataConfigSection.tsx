import { GlobalFiltersConfig } from "../sections";
import type { WidgetDataConfig } from "@/application/types/widgetDataConfigType";
import type { WidgetConfig } from "@domain/value-objects";
import {
    WIDGET_DATA_CONFIG,
    DATASET_FIELD_CONFIGS,
    DATASET_DEFAULT_FACTORIES,
} from "@/core/config/visualizations";
import GenericDatasetField from "../fields/GenericDatasetField";
import DatasetLabelSection from "../sections/DatasetLabelSection";
import DatasetSection from "../sections/DatasetSection";
import DefaultMetricConfigSection from "../sections/DefaultMetricConfigSection";

export interface UniversalDataConfigSectionProps {
    type: string;
    dataConfig: WidgetDataConfig;
    config: WidgetConfig;
    columns: string[];
    data?: Record<string, any>[];
    handleConfigChange: (field: string, value: any) => void;
    handleMetricAggOrFieldChange?: (idx: number, field: "agg" | "field", value: string) => void;
}

export default function UniversalDataConfigSection({
    type,
    dataConfig,
    config,
    columns,
    data = [],
    handleConfigChange,
    handleMetricAggOrFieldChange,
}: UniversalDataConfigSectionProps) {
    const registryEntry = WIDGET_DATA_CONFIG[type as keyof typeof WIDGET_DATA_CONFIG];

    if (!registryEntry) {
        console.warn(`No registry entry for widget type: ${type}`);
        return null;
    }

    const axisFields = dataConfig?.axisFields || columns;

    if (registryEntry.useMetricSection) {
        return (
            <div className="space-y-6">
                {registryEntry.useGlobalFilters && (
                    <GlobalFiltersConfig
                        filters={config.globalFilters || []}
                        columns={columns}
                        data={data}
                        onFiltersChange={(filters) => handleConfigChange("globalFilters", filters)}
                    />
                )}
                <DefaultMetricConfigSection
                    dataConfig={dataConfig}
                    config={config}
                    columns={columns}
                    handleConfigChange={handleConfigChange}
                    handleMetricAggOrFieldChange={handleMetricAggOrFieldChange}
                    allowMultipleMetrics={registryEntry.allowMultipleMetrics}
                />
            </div>
        );
    }

    if (registryEntry.useDatasetSection && registryEntry.datasetType) {
        const fieldConfigs = DATASET_FIELD_CONFIGS[registryEntry.datasetType];
        const defaultFactory = DATASET_DEFAULT_FACTORIES[registryEntry.datasetType];

        const renderDatasetContent = (dataset: any, idx: number, onUpdate: (updated: any) => void) => (
            <div className="grid gap-2 mt-2">
                {fieldConfigs.map((fieldConfig) => (
                    <GenericDatasetField
                        key={fieldConfig.key}
                        fieldConfig={fieldConfig}
                        dataset={dataset}
                        datasetIndex={idx}
                        columns={columns}
                        onUpdate={onUpdate}
                        axisFields={registryEntry.datasetType === "multiAxis" ? axisFields : undefined}
                    />
                ))}
                <DatasetLabelSection
                    dataset={dataset}
                    datasetIndex={idx}
                    onUpdate={onUpdate}
                    columns={columns}
                    data={data}
                />
            </div>
        );

        return (
            <div className="space-y-6">
                <DatasetSection
                    title={registryEntry.datasetSectionTitle || "Datasets"}
                    datasets={config.metrics || []}
                    onDatasetsChange={(datasets) => handleConfigChange("metrics", datasets)}
                    createNewDataset={() => defaultFactory(columns)}
                    renderDatasetContent={renderDatasetContent}
                />
            </div>
        );
    }

    return null;
}
