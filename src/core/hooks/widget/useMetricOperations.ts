import { useCallback } from "react";

export interface UseMetricOperationsProps {
    metrics: any[];
    onMetricsChange: (metrics: any[]) => void;
    defaultAgg?: string;
    defaultField?: string;
}

export function useMetricOperations({
    metrics,
    onMetricsChange,
    defaultAgg = "sum",
    defaultField = "",
}: UseMetricOperationsProps) {
    const handleAddMetric = useCallback(() => {
        const newMetric = {
            agg: defaultAgg,
            field: defaultField,
            label: "",
        };
        onMetricsChange([...metrics, newMetric]);
    }, [metrics, defaultAgg, defaultField, onMetricsChange]);

    const handleDeleteMetric = useCallback(
        (idx: number) => {
            const newMetrics = [...metrics];
            newMetrics.splice(idx, 1);
            onMetricsChange(newMetrics);
        },
        [metrics, onMetricsChange]
    );

    const handleMoveMetric = useCallback(
        (idx: number, direction: "up" | "down") => {
            const targetIdx = direction === "up" ? idx - 1 : idx + 1;
            if (targetIdx < 0 || targetIdx >= metrics.length) return;

            const newMetrics = [...metrics];
            [newMetrics[idx], newMetrics[targetIdx]] = [
                newMetrics[targetIdx],
                newMetrics[idx],
            ];
            onMetricsChange(newMetrics);
        },
        [metrics, onMetricsChange]
    );

    const handleMetricChange = useCallback(
        (idx: number, field: string, value: any) => {
            const newMetrics = [...metrics];
            if (!newMetrics[idx]) return;

            newMetrics[idx] = { ...newMetrics[idx], [field]: value };
            onMetricsChange(newMetrics);
        },
        [metrics, onMetricsChange]
    );

    const canMoveUp = useCallback((idx: number) => idx > 0, []);

    const canMoveDown = useCallback(
        (idx: number) => idx < metrics.length - 1,
        [metrics.length]
    );

    return {
        handleAddMetric,
        handleDeleteMetric,
        handleMoveMetric,
        handleMetricChange,
        canMoveUp,
        canMoveDown,
    };
}
