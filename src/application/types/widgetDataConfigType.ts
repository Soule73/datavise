interface WidgetMetricConfigSchema {
  label: string;
  allowMultiple?: boolean;
  allowedAggs?: Array<{ value: string; label: string }>;
  defaultAgg?: string;
}

interface WidgetBucketConfigSchema {
  label: string;
  allow?: boolean;
  allowMultiple?: boolean;
  allowedTypes?: Array<{ value: string; label: string }>;
  allowedAggs?: Array<{ value: string; label: string }>;
  defaultAgg?: string;
}

export interface WidgetDataConfig {
  metrics: WidgetMetricConfigSchema;
  buckets?: WidgetBucketConfigSchema;
  groupByFields?: string[];
  axisFields?: string[];
}









