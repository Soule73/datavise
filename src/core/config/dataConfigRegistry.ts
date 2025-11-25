import type { WidgetType } from "@/domain/value-objects";

export type FieldType = "select" | "multiSelect" | "checkbox" | "text";

export interface DatasetFieldConfig {
    key: string;
    label: string;
    type: FieldType;
    defaultValue?: any;
    options?: string[] | ((columns: string[]) => string[]);
    required?: boolean;
}

export type DatasetType = "xy" | "xyr" | "multiAxis" | "metric";

export interface DatasetTypeConfig {
    type: DatasetType;
    fields: DatasetFieldConfig[];
    defaultFactory: (columns: string[]) => any;
    sectionTitle?: string;
}

export const DATASET_FIELD_CONFIGS: Record<DatasetType, DatasetFieldConfig[]> = {
    xy: [
        { key: "x", label: "Champ X (axe horizontal)", type: "select", required: true },
        { key: "y", label: "Champ Y (axe vertical)", type: "select", required: true },
    ],
    xyr: [
        { key: "x", label: "Champ X (axe horizontal)", type: "select", required: true },
        { key: "y", label: "Champ Y (axe vertical)", type: "select", required: true },
        { key: "r", label: "Champ Rayon (r)", type: "select", required: true },
    ],
    multiAxis: [
        { key: "fields", label: "Axes à inclure", type: "multiSelect", required: true },
    ],
    metric: [
        { key: "agg", label: "Agrégation", type: "select", required: true },
        { key: "field", label: "Champ", type: "select", required: true },
    ],
};

export const DATASET_DEFAULT_FACTORIES: Record<DatasetType, (columns: string[]) => any> = {
    xy: (columns) => ({
        agg: "none",
        field: "",
        x: columns[0] || "",
        y: columns[1] || "",
        label: "",
    }),
    xyr: (columns) => ({
        agg: "none",
        field: "",
        x: columns[0] || "",
        y: columns[1] || "",
        r: columns[2] || "",
        label: "",
    }),
    multiAxis: (columns) => ({
        agg: "count",
        field: columns[0] || "",
        label: "",
        fields: [columns[0] || ""],
    }),
    metric: (columns) => ({
        agg: "sum",
        field: columns[0] || "",
        label: "",
    }),
};

export interface WidgetDataConfigRegistryEntry {
    datasetType?: DatasetType;
    useMetricSection?: boolean;
    useDatasetSection?: boolean;
    useGlobalFilters?: boolean;
    useBuckets?: boolean;
    allowMultipleDatasets?: boolean;
    allowMultipleMetrics?: boolean;
    datasetSectionTitle?: string;
    customAxisFields?: string[];
}

export const WIDGET_DATA_CONFIG_REGISTRY: Record<WidgetType, WidgetDataConfigRegistryEntry> = {
    scatter: {
        datasetType: "xy",
        useDatasetSection: true,
        useGlobalFilters: false,
        useBuckets: true,
        allowMultipleDatasets: true,
        datasetSectionTitle: "Datasets (x, y)",
    },
    bubble: {
        datasetType: "xyr",
        useDatasetSection: true,
        useGlobalFilters: false,
        useBuckets: true,
        allowMultipleDatasets: true,
        datasetSectionTitle: "Datasets (x, y, r)",
    },
    radar: {
        datasetType: "multiAxis",
        useDatasetSection: true,
        useGlobalFilters: false,
        useBuckets: false,
        allowMultipleDatasets: true,
        datasetSectionTitle: "Datasets (axes multiples)",
    },
    kpiGroup: {
        useMetricSection: true,
        useGlobalFilters: true,
        useBuckets: false,
        allowMultipleMetrics: true,
    },
    kpi: {
        useMetricSection: true,
        useGlobalFilters: true,
        useBuckets: true,
        allowMultipleMetrics: false,
    },
    card: {
        useMetricSection: true,
        useGlobalFilters: true,
        useBuckets: true,
        allowMultipleMetrics: true,
    },
    bar: {
        useMetricSection: true,
        useGlobalFilters: true,
        useBuckets: true,
        allowMultipleMetrics: true,
    },
    line: {
        useMetricSection: true,
        useGlobalFilters: true,
        useBuckets: true,
        allowMultipleMetrics: true,
    },
    pie: {
        useMetricSection: true,
        useGlobalFilters: true,
        useBuckets: true,
        allowMultipleMetrics: true,
    },
    table: {
        useMetricSection: true,
        useGlobalFilters: true,
        useBuckets: true,
        allowMultipleMetrics: true,
    },
};
