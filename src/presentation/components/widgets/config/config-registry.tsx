import type { ComponentType } from "react";
import type { WidgetType } from "@/domain/value-objects";
import type { WidgetDataConfig } from "@/application/types/widgetDataConfigType";
import type { WidgetConfig } from "@/domain/value-objects";
import UniversalDataConfigSection from "../universal/UniversalDataConfigSection";

export interface DataConfigSectionProps {
    dataConfig: WidgetDataConfig;
    config: WidgetConfig;
    columns: string[];
    handleConfigChange: (field: string, value: any) => void;
    handleDragStart?: (idx: number) => void;
    handleDragOver?: (idx: number, e: React.DragEvent) => void;
    handleDrop?: (idx: number) => void;
    handleMetricAggOrFieldChange?: (
        idx: number,
        field: "agg" | "field",
        value: string
    ) => void;
    data?: Record<string, any>[];
}

export interface ConfigSectionRegistryEntry {
    component: ComponentType<any>;
    useBaseWrapper: boolean;
    props?: (baseProps: DataConfigSectionProps) => Record<string, any>;
}

export const WIDGET_DATA_CONFIG_COMPONENTS: Record<
    WidgetType,
    ConfigSectionRegistryEntry
> = {
    bubble: {
        component: UniversalDataConfigSection,
        useBaseWrapper: true,
        props: (baseProps) => ({
            type: "bubble",
            dataConfig: baseProps.dataConfig,
            config: baseProps.config,
            columns: baseProps.columns,
            data: baseProps.data,
            handleConfigChange: baseProps.handleConfigChange,
        }),
    },
    scatter: {
        component: UniversalDataConfigSection,
        useBaseWrapper: true,
        props: (baseProps) => ({
            type: "scatter",
            dataConfig: baseProps.dataConfig,
            config: baseProps.config,
            columns: baseProps.columns,
            data: baseProps.data,
            handleConfigChange: baseProps.handleConfigChange,
        }),
    },
    radar: {
        component: UniversalDataConfigSection,
        useBaseWrapper: true,
        props: (baseProps) => ({
            type: "radar",
            dataConfig: baseProps.dataConfig,
            config: baseProps.config,
            columns: baseProps.columns,
            data: baseProps.data,
            handleConfigChange: baseProps.handleConfigChange,
        }),
    },
    kpiGroup: {
        component: UniversalDataConfigSection,
        useBaseWrapper: false,
        props: (baseProps) => ({
            type: "kpiGroup",
            dataConfig: baseProps.dataConfig,
            config: baseProps.config,
            columns: baseProps.columns,
            data: baseProps.data,
            handleConfigChange: baseProps.handleConfigChange,
            handleMetricAggOrFieldChange: baseProps.handleMetricAggOrFieldChange,
        }),
    },
    kpi: {
        component: UniversalDataConfigSection,
        useBaseWrapper: true,
        props: (baseProps) => ({
            type: "kpi",
            dataConfig: baseProps.dataConfig,
            config: baseProps.config,
            columns: baseProps.columns,
            data: baseProps.data,
            handleConfigChange: baseProps.handleConfigChange,
            handleMetricAggOrFieldChange: baseProps.handleMetricAggOrFieldChange,
        }),
    },
    card: {
        component: UniversalDataConfigSection,
        useBaseWrapper: true,
        props: (baseProps) => ({
            type: "card",
            dataConfig: baseProps.dataConfig,
            config: baseProps.config,
            columns: baseProps.columns,
            data: baseProps.data,
            handleConfigChange: baseProps.handleConfigChange,
            handleMetricAggOrFieldChange: baseProps.handleMetricAggOrFieldChange,
        }),
    },
    bar: {
        component: UniversalDataConfigSection,
        useBaseWrapper: true,
        props: (baseProps) => ({
            type: "bar",
            dataConfig: baseProps.dataConfig,
            config: baseProps.config,
            columns: baseProps.columns,
            data: baseProps.data,
            handleConfigChange: baseProps.handleConfigChange,
            handleMetricAggOrFieldChange: baseProps.handleMetricAggOrFieldChange,
        }),
    },
    line: {
        component: UniversalDataConfigSection,
        useBaseWrapper: true,
        props: (baseProps) => ({
            type: "line",
            dataConfig: baseProps.dataConfig,
            config: baseProps.config,
            columns: baseProps.columns,
            data: baseProps.data,
            handleConfigChange: baseProps.handleConfigChange,
            handleMetricAggOrFieldChange: baseProps.handleMetricAggOrFieldChange,
        }),
    },
    pie: {
        component: UniversalDataConfigSection,
        useBaseWrapper: true,
        props: (baseProps) => ({
            type: "pie",
            dataConfig: baseProps.dataConfig,
            config: baseProps.config,
            columns: baseProps.columns,
            data: baseProps.data,
            handleConfigChange: baseProps.handleConfigChange,
            handleMetricAggOrFieldChange: baseProps.handleMetricAggOrFieldChange,
        }),
    },
    table: {
        component: UniversalDataConfigSection,
        useBaseWrapper: true,
        props: (baseProps) => ({
            type: "table",
            dataConfig: baseProps.dataConfig,
            config: baseProps.config,
            columns: baseProps.columns,
            data: baseProps.data,
            handleConfigChange: baseProps.handleConfigChange,
            handleMetricAggOrFieldChange: baseProps.handleMetricAggOrFieldChange,
        }),
    },
};
