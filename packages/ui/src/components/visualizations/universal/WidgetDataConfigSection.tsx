import type { WidgetDataConfig } from "@/application/types/widgetDataConfigType";
import { WIDGETS, WIDGET_DATA_CONFIG } from "@/core/config/visualizations";
import { useMultiBuckets } from "@hooks/useMultiBuckets";
import type { WidgetConfig, WidgetType } from "@domain/value-objects";
import UniversalDataConfigSection from "./UniversalDataConfigSection";
import BaseDataConfigSection from "../config/BaseDataConfigSection";
import MultiBucketSection from "../sections/MultiBucketSection";

export interface WidgetDataConfigSectionFixedProps {
  dataConfig: WidgetDataConfig;
  config: WidgetConfig;
  columns: string[];
  handleConfigChange: (field: string, value: any) => void;
  handleDragStart: (idx: number) => void;
  handleDragOver: (idx: number, e: React.DragEvent) => void;
  handleDrop: (idx: number) => void;
  handleMetricAggOrFieldChange?: (
    idx: number,
    field: "agg" | "field",
    value: string
  ) => void;
  type: WidgetType;
  data?: Record<string, any>[];
}

export default function WidgetDataConfigSection({
  type,
  dataConfig,
  config,
  columns,
  handleConfigChange,
  handleMetricAggOrFieldChange,
  data = [],
}: WidgetDataConfigSectionFixedProps) {
  const widgetDef = WIDGETS[type];
  const dataConfigForWidget = WIDGET_DATA_CONFIG[type];

  if (!dataConfigForWidget) {
    console.warn(`No config for widget type: ${type}`);
    return null;
  }

  const {
    buckets: currentBuckets,
    handleBucketsChange,
  } = useMultiBuckets({
    config,
    columns,
    allowMultiple: dataConfigForWidget.buckets?.allowMultiple,
    onConfigChange: handleConfigChange,
  });

  const showFilter = widgetDef?.enableFilter;
  const useWrapper = type !== "kpiGroup";

  const configComponent = (
    <UniversalDataConfigSection
      type={type}
      dataConfig={dataConfig}
      config={config}
      columns={columns}
      data={data}
      handleConfigChange={handleConfigChange}
      handleMetricAggOrFieldChange={handleMetricAggOrFieldChange}
    />
  );

  if (!useWrapper) {
    return configComponent;
  }

  return (
    <BaseDataConfigSection
      config={config}
      columns={columns}
      data={data}
      handleConfigChange={handleConfigChange}
      showGlobalFilters={showFilter}
    >
      {configComponent}

      {widgetDef && !widgetDef.hideBucket && dataConfigForWidget.buckets?.allow && (
        <MultiBucketSection
          buckets={currentBuckets}
          columns={columns}
          data={data}
          allowMultiple={dataConfigForWidget.buckets.allowMultiple}
          sectionLabel={dataConfigForWidget.buckets.label || "Buckets"}
          onBucketsChange={handleBucketsChange}
        />
      )}
    </BaseDataConfigSection>
  );
}
