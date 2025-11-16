import type { WidgetType } from "@/domain/value-objects/widgets/widgetTypes";
import type { BubbleMetricConfig, RadarMetricConfig, ScatterMetricConfig } from "@/domain/value-objects/widgets/metricBucketTypes";

/**
 * Hook pour déterminer si un widget nécessite une configuration spécialisée
 */
export function useSpecializedWidgetConfig(type: WidgetType) {
    const specializedTypes = ['bubble', 'scatter', 'radar', 'kpiGroup'] as const;

    const isSpecialized = (specializedTypes as readonly string[]).includes(type);

    const getSpecializedMetrics = (config: Record<string, unknown>, type: WidgetType) => {
        if (!Array.isArray(config.metrics)) return [];

        switch (type) {
            case 'bubble':
                return config.metrics as BubbleMetricConfig[];
            case 'scatter':
                return config.metrics as ScatterMetricConfig[];
            case 'radar':
                return config.metrics as RadarMetricConfig[];
            default:
                return config.metrics;
        }
    };

    return {
        isSpecialized,
        getSpecializedMetrics,
    };
}
