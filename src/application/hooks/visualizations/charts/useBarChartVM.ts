import { useChartLogic } from "./useChartVM";
import { createBarChartDataset } from "@utils/charts/chartDatasetUtils";
import type { BarChartConfig } from "@domain/value-objects/widgets/visualization";
import type { ChartData, ChartOptions } from "chart.js";
import type { BaseChartWidgetVM } from "@/application/types/baseChartVM";

export interface BarChartVM extends BaseChartWidgetVM {
    chartData: ChartData<"bar">;
    options: ChartOptions<"bar">;
}

export interface BarChartWidgetProps {
    data: Record<string, any>[];
    config: BarChartConfig;
}


export function useBarChartLogic({
    data,
    config,
}: BarChartWidgetProps): BarChartVM {
    const result = useChartLogic<"bar">({
        chartType: "bar",
        data,
        config,
        customDatasetCreator: (metric, idx, values, labels, widgetParams, style) => {
            return createBarChartDataset(metric, idx, values, labels, widgetParams, style);
        },
    });

    return {
        chartData: result.chartData,
        options: result.options,
        showNativeValues: result.showNativeValues,
        valueLabelsPlugin: result.valueLabelsPlugin,
    };
}
