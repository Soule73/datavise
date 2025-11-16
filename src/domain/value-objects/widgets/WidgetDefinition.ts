import type { WidgetType } from "../WidgetType";
import type { ComponentType } from "react";

export interface WidgetDefinition<T extends WidgetType = WidgetType> {
    type: T;
    label: string;
    description: string;
    component: ComponentType<any>;
    icon: ComponentType<{ className?: string }>;
    allowMultipleMetrics?: boolean;
    hideBucket?: boolean;
    enableFilter?: boolean;
    configSchema?: Record<string, unknown>;
    widgetParams?: Record<string, unknown>;
    metricStyles?: Record<string, unknown>;
    globalFilters?: unknown;
}
