import { ChartBarIcon } from "@heroicons/react/24/outline";
import { InvalideConfigWidget, NoDataWidget } from "@/presentation/pages/widget/components/states";
import KPIWidget from "@components/visualizations/kpi/KPIWidget";
import { useKPIGroupVM } from "@/application/hooks/visualizations/kpi/useKPIGroupVM";
import type { Metric } from "@/application/types/metricBucketTypes";
import type { KPIGroupWidgetConfig } from "@/domain/value-objects/widgets/visualization";

export interface KPIGroupWidgetProps {
  data: Record<string, any>[];
  config: KPIGroupWidgetConfig;
}

export default function KPIGroupWidget({
  data,
  config,
}: KPIGroupWidgetProps) {
  const { metrics, gridColumns, widgetParamsList } =
    useKPIGroupVM(config);

  if (
    !data ||
    !config.metrics ||
    !Array.isArray(config.metrics) ||
    !config.metrics[0]
  ) {
    return <InvalideConfigWidget />;
  }

  if (data.length === 0) {
    return (
      <NoDataWidget
        icon={
          <ChartBarIcon className="w-12 h-12 stroke-gray-300 dark:stroke-gray-700" />
        }
      />
    );
  }


  return (
    <div
      className="grid gap-4 w-full h-full"
      style={{
        gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
      }}
    >
      {metrics.map((metric: Metric, idx: number) => (
        <KPIWidget
          key={idx}
          data={data}
          config={{
            metrics: [metric],
            globalFilters: config.globalFilters,
            widgetParams: widgetParamsList[idx],
            buckets: config.buckets,
          }}
        />
      ))}
    </div>
  );
}
