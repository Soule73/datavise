import { useMemo } from "react";
import { WIDGETS } from "@/core/config/visualizations";
import type { WidgetType, WidgetConfig } from "@/domain/value-objects";


export interface TabConfig {
    key: string;
    label: string;
}


export function useWidgetTabs(config: WidgetConfig, widgetType?: WidgetType): TabConfig[] {
    return useMemo(() => {
        const availableTabs: TabConfig[] = [];

        availableTabs.push({ key: "data", label: "Données" });

        const hasMetrics = config?.metrics && Array.isArray(config.metrics) && config.metrics.length > 0;

        // Vérifier si le widget utilise des metricStyles dans l'adaptateur
        let hasMetricStyles = false;
        if (widgetType) {
            const widgetDef = WIDGETS[widgetType];
            const metricStylesSchema = widgetDef?.configSchema?.metricStyles;
            hasMetricStyles = Boolean(metricStylesSchema && Object.keys(metricStylesSchema).length > 0);
        }

        // N'afficher le tab "Métriques & Style" que si le widget a des métriques ET utilise des metricStyles
        if (hasMetrics && hasMetricStyles) {
            availableTabs.push({ key: "metricsAxes", label: "Métriques & Style" });
        }

        const hasConfig = config && Object.keys(config).length > 0;
        if (hasConfig) {
            availableTabs.push({ key: "params", label: "Paramètres" });
        }

        return availableTabs;
    }, [config, widgetType]);
}
