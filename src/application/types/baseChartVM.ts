import type { ChartData, ChartOptions } from "chart.js";

export interface BaseChartWidgetVM {
    chartData: ChartData;
    options: ChartOptions;
    showNativeValues: boolean;
    valueLabelsPlugin: any;
}