/* eslint-disable @typescript-eslint/no-explicit-any */
import WidgetConfigSection from "./WidgetConfigSection";
import { useMetricOperations } from "@hooks/widget/useMetricOperations";
import type { WidgetDataConfig } from "@/application/types/widgetDataConfigType";
import MetricConfigItem from "../fields/MetricConfigItem";

export interface DefaultMetricConfigSectionProps {
    dataConfig: WidgetDataConfig;
    config: any;
    columns: string[];
    handleConfigChange: (field: string, value: any) => void;
    handleMetricAggOrFieldChange?: (idx: number, field: "agg" | "field", value: string) => void;
    allowMultipleMetrics?: boolean;
}

export default function DefaultMetricConfigSection({
    dataConfig,
    config,
    columns,
    handleConfigChange,
    handleMetricAggOrFieldChange,
    allowMultipleMetrics = true,
}: DefaultMetricConfigSectionProps) {
    if (!dataConfig.metrics.label || !config.metrics || !Array.isArray(config.metrics)) {
        return null;
    }

    const {
        handleAddMetric,
        handleDeleteMetric,
        handleMoveMetric,
        handleMetricChange: baseHandleMetricChange,
        canMoveUp,
        canMoveDown,
    } = useMetricOperations({
        metrics: config.metrics,
        onMetricsChange: (newMetrics) => handleConfigChange("metrics", newMetrics),
        defaultAgg: dataConfig.metrics.defaultAgg,
        defaultField: columns[1] || "",
    });

    const handleMetricChange = (idx: number, field: string, value: any) => {
        if (handleMetricAggOrFieldChange && (field === 'agg' || field === 'field')) {
            handleMetricAggOrFieldChange(idx, field as 'agg' | 'field', value);
        } else {
            baseHandleMetricChange(idx, field, value);
        }
    };

    const isOnlyMetric = config.metrics.length === 1;
    const canShowSettings = allowMultipleMetrics || (dataConfig.metrics.allowMultiple && !isOnlyMetric);

    return (
        <WidgetConfigSection
            title={dataConfig.metrics.label}
            addButtonText="Ajouter une métrique"
            canAdd={dataConfig.metrics.allowMultiple}
            onAdd={handleAddMetric}
        >
            <div className="space-y-3">
                {config.metrics.map((metric: any, idx: number) => (
                    <MetricConfigItem
                        key={idx}
                        metric={metric}
                        index={idx}
                        allowedAggs={Array.isArray(dataConfig.metrics.allowedAggs) ? dataConfig.metrics.allowedAggs : []}
                        columns={columns}
                        canMoveUp={(canMoveUp(idx) && canShowSettings) ?? false}
                        canMoveDown={(canMoveDown(idx) && canShowSettings) ?? false}
                        canDelete={((!isOnlyMetric && canShowSettings)) ?? false}
                        onMetricChange={handleMetricChange}
                        onDelete={canShowSettings ? handleDeleteMetric : undefined}
                        onMoveUp={canShowSettings ? () => handleMoveMetric(idx, 'up') : undefined}
                        onMoveDown={canShowSettings ? () => handleMoveMetric(idx, 'down') : undefined}
                    />
                ))}
            </div>
        </WidgetConfigSection>
    );
}
