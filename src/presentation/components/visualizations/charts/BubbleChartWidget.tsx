import { Bubble } from "react-chartjs-2";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { InvalideConfigWidget, NoDataWidget } from "@/presentation/pages/widget/components/states";
import { useBubbleChartLogic } from "@/application/hooks/visualizations/charts";
import type { BubbleChartWidgetProps } from "@/application/hooks/visualizations/charts/useBubbleChartVM";

export default function BubbleChartWidget({
  data,
  config,
}: BubbleChartWidgetProps) {
  const { chartData, options, validDatasets } = useBubbleChartLogic(
    {
      data,
      config
    });
  if (
    !data ||
    !config.metrics ||
    !Array.isArray(config.metrics) ||
    validDatasets.length === 0
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
    <div className="shadow bg-white dark:bg-gray-900 rounded w-full max-w-full h-full flex items-center justify-center overflow-hidden">
      <Bubble
        className="max-w-full max-h-full p-1 md:p-2"
        data={chartData}
        options={options}
        style={{ width: "100%", maxWidth: "100%", height: "auto", minWidth: 0 }}
      />
    </div>
  );
}
