export interface Metric {
    label?: string;
    field: string;
    agg: string;
    type?: string;
    filters?: Filter[];
}

export type BucketType =
    | 'terms'
    | 'histogram'
    | 'date_histogram'
    | 'range'
    | 'split_series'
    | 'split_rows'
    | 'split_chart';

export interface MultiBucketConfig {
    label?: string;
    field: string;
    type: BucketType;
    order?: 'asc' | 'desc';
    size?: number;
    minDocCount?: number;
    interval?: number;
    dateInterval?: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
    ranges?: Array<{
        from?: number;
        to?: number;
        label?: string;
    }>;
    splitType?: 'series' | 'rows' | 'chart';
}

export type FilterOperator =
    | "equals"
    | "not_equals"
    | "contains"
    | "not_contains"
    | "greater_than"
    | "less_than"
    | "greater_or_equal"
    | "less_or_equal"
    | "greater_equal"
    | "less_equal"
    | "starts_with"
    | "ends_with"
    | "in"
    | "not_in"
    | "is_null"
    | "is_not_null";

export interface Filter {
    field: string;
    operator: FilterOperator;
    value: string | number | boolean | (string | number)[];
}

export interface DatasetFilter {
    field: string;
    operator: FilterOperator;
    value: string | number | boolean | (string | number)[];
}

export interface WidgetConfig {
    metrics?: Metric[];
    buckets?: MultiBucketConfig[];
    globalFilters?: Filter[];
    datasetFilters?: DatasetFilter[];
    [key: string]: unknown;
}
