import type { WidgetDataConfig } from "@/application/types/widgetDataConfigType";
import { WIDGETS, WIDGET_DATA_CONFIG } from "@/core/config/visualizations";
import { useMultiBuckets } from "@/application/hooks/useMultiBuckets";
import type { WidgetConfig, WidgetType } from "@/domain/value-objects";
import { WIDGET_DATA_CONFIG_COMPONENTS } from "../config/config-registry";
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
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleMetricAggOrFieldChange,
  data = [],
}: WidgetDataConfigSectionFixedProps) {
  const widgetDef = WIDGETS[type];
  const dataConfigForWidget = WIDGET_DATA_CONFIG[type];
  const configEntry = WIDGET_DATA_CONFIG_COMPONENTS[type];

  if (!configEntry || !dataConfigForWidget) {
    console.warn(`No config component registered for widget type: ${type}`);
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

  const baseProps = {
    dataConfig,
    config,
    columns,
    handleConfigChange,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleMetricAggOrFieldChange,
    data,
  };

  const ConfigComponent = configEntry.component;
  const componentProps = configEntry.props ? configEntry.props(baseProps) : baseProps;

  if (!configEntry.useBaseWrapper) {
    return <ConfigComponent {...componentProps} />;
  }

  const showFilter = widgetDef?.enableFilter;

  return (
    <BaseDataConfigSection
      config={config}
      columns={columns}
      data={data}
      handleConfigChange={handleConfigChange}
      showGlobalFilters={showFilter}
    >
      <ConfigComponent {...componentProps} />

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
