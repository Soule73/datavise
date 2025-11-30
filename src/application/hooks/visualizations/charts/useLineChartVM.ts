import { useChartLogic } from "@hooks/visualizations/charts/useChartVM";
import { createLineChartDataset } from "@utils/charts/chartDatasetUtils";
import type { LineChartConfig } from "@domain/value-objects/widgets/visualization";
import type { ChartData, ChartOptions } from "chart.js";
import type { BaseChartWidgetVM } from "@/application/types/baseChartVM";

export interface LineChartVM extends BaseChartWidgetVM {
    chartData: ChartData<"line">;
    options: ChartOptions<"line">;
}


export interface LineChartWidgetProps {
    data: Record<string, any>[];
    config: LineChartConfig;
}

export function useLineChartLogic({
    data,
    config,
}: LineChartWidgetProps): LineChartVM {

    const result = useChartLogic<"line">({
        chartType: "line",
        data,
        config,
        customDatasetCreator: (metric, idx, values, labels, widgetParams, style) => {
            return createLineChartDataset(metric, idx, values, labels, widgetParams, style);
        },
    });

    return {
        chartData: result.chartData,
        options: result.options,
        showNativeValues: result.showNativeValues,
        valueLabelsPlugin: result.valueLabelsPlugin,
    };
}
