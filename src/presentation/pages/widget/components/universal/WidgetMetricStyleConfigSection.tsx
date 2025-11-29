import { WIDGETS, WIDGET_CONFIG_FIELDS } from "@/core/config/visualizations";
import { CollapsibleSection } from "../sections";
import type {
  BubbleMetricConfig,
  Metric,
  RadarMetricConfig,
  ScatterMetricConfig,
} from "@/application/types/metricBucketTypes";
import type { WidgetType } from "@/domain/value-objects";
import MetricStyleField, { type MetricStyleFieldSchema } from "../fields/MetricStyleField";

type MetricStyleRecord = Record<string, string | number | boolean | string[]>;

export interface WidgetMetricStyleConfigSectionProps<
  TMetric =
  | Metric
  | ScatterMetricConfig
  | BubbleMetricConfig
  | RadarMetricConfig,
  TMetricStyle = any
> {
  type: WidgetType;
  metrics: TMetric[];
  metricStyles: TMetricStyle[];
  handleMetricStyleChange: (
    metricIdx: number,
    field: string,
    value: any
  ) => void;
}

export default function WidgetMetricStyleConfigSection({
  type,
  metrics,
  metricStyles,
  handleMetricStyleChange,
}: WidgetMetricStyleConfigSectionProps) {
  const widgetDef = WIDGETS[type];
  const metricStyleSchema =
    (widgetDef.configSchema as { metricStyles?: Record<string, MetricStyleFieldSchema> })
      ?.metricStyles || {};
  const safeMetricStyles = (metricStyles ?? []) as MetricStyleRecord[];
  const safeMetrics = (metrics ?? []) as { label?: string }[];

  const renderStyleFields = (metricIndex: number, styleValues: MetricStyleRecord) => {
    return Object.entries(metricStyleSchema).map(([field, metaRaw]) => {
      const meta = (metaRaw as MetricStyleFieldSchema) || WIDGET_CONFIG_FIELDS[field] || {};
      return (
        <MetricStyleField
          key={field}
          field={field}
          meta={meta}
          metricIndex={metricIndex}
          value={styleValues?.[field]}
          onChange={(f, v) => handleMetricStyleChange(metricIndex, f, v)}
        />
      );
    });
  };

  if (type === "card") {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            Style de la carte
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {renderStyleFields(0, safeMetricStyles?.[0] || {})}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {safeMetrics.map((metric, idx) => (
        <CollapsibleSection
          key={idx}
          title={metric.label || `Métrique ${idx + 1}`}
          hideSettings={true}
        >
          <div className="grid grid-cols-1 gap-4">
            {renderStyleFields(idx, safeMetricStyles[idx] || {})}
          </div>
        </CollapsibleSection>
      ))}
    </div>
  );
}
