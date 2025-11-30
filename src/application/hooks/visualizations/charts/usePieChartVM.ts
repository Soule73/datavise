import { useChartLogic } from '@hooks/visualizations/charts/useChartVM';
import { createPieChartDataset } from '@utils/charts/chartDatasetUtils';
import type { PieChartConfig } from '@domain/value-objects/widgets/visualization';
import type { ChartData, ChartOptions } from "chart.js";
import type { BaseChartWidgetVM } from "@/application/types/baseChartVM";

export interface PieChartVM extends BaseChartWidgetVM {
    chartData: ChartData<"pie">;
    options: ChartOptions<"pie">;
}
export interface PieChartWidgetProps {
    data: Record<string, any>[];
    config: PieChartConfig;
}
export function usePieChartLogic({
    data,
    config,
}: PieChartWidgetProps): PieChartVM {

    const result = useChartLogic<"pie">({
        chartType: "pie",
        data,
        config,
        customDatasetCreator: (metric, _idx, values, labels, widgetParams, style) => {
            return createPieChartDataset(metric, values, labels, widgetParams, style);
        },
    });

    return {
        chartData: result.chartData,
        options: result.options,
        showNativeValues: result.showNativeValues,
        valueLabelsPlugin: result.valueLabelsPlugin,
    };
};
