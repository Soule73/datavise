import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMetricOperations } from "../useMetricOperations";

describe("useMetricOperations", () => {
    const mockMetrics = [
        { agg: "sum", field: "revenue", label: "Revenue" },
        { agg: "count", field: "orders", label: "Orders" },
        { agg: "avg", field: "price", label: "Price" },
    ];

    it("devrait ajouter une nouvelle métrique", () => {
        const onMetricsChange = vi.fn();
        const { result } = renderHook(() =>
            useMetricOperations({
                metrics: mockMetrics,
                onMetricsChange,
                defaultAgg: "sum",
                defaultField: "test",
            })
        );

        act(() => {
            result.current.handleAddMetric();
        });

        expect(onMetricsChange).toHaveBeenCalledWith([
            ...mockMetrics,
            { agg: "sum", field: "test", label: "" },
        ]);
    });

    it("devrait supprimer une métrique", () => {
        const onMetricsChange = vi.fn();
        const { result } = renderHook(() =>
            useMetricOperations({
                metrics: mockMetrics,
                onMetricsChange,
            })
        );

        act(() => {
            result.current.handleDeleteMetric(1);
        });

        expect(onMetricsChange).toHaveBeenCalledWith([
            mockMetrics[0],
            mockMetrics[2],
        ]);
    });

    it("devrait déplacer une métrique vers le haut", () => {
        const onMetricsChange = vi.fn();
        const { result } = renderHook(() =>
            useMetricOperations({
                metrics: mockMetrics,
                onMetricsChange,
            })
        );

        act(() => {
            result.current.handleMoveMetric(1, "up");
        });

        expect(onMetricsChange).toHaveBeenCalledWith([
            mockMetrics[1],
            mockMetrics[0],
            mockMetrics[2],
        ]);
    });

    it("devrait déplacer une métrique vers le bas", () => {
        const onMetricsChange = vi.fn();
        const { result } = renderHook(() =>
            useMetricOperations({
                metrics: mockMetrics,
                onMetricsChange,
            })
        );

        act(() => {
            result.current.handleMoveMetric(0, "down");
        });

        expect(onMetricsChange).toHaveBeenCalledWith([
            mockMetrics[1],
            mockMetrics[0],
            mockMetrics[2],
        ]);
    });

    it("ne devrait pas déplacer une métrique hors limites", () => {
        const onMetricsChange = vi.fn();
        const { result } = renderHook(() =>
            useMetricOperations({
                metrics: mockMetrics,
                onMetricsChange,
            })
        );

        act(() => {
            result.current.handleMoveMetric(0, "up");
        });

        expect(onMetricsChange).not.toHaveBeenCalled();

        act(() => {
            result.current.handleMoveMetric(2, "down");
        });

        expect(onMetricsChange).not.toHaveBeenCalled();
    });

    it("devrait modifier un champ de métrique", () => {
        const onMetricsChange = vi.fn();
        const { result } = renderHook(() =>
            useMetricOperations({
                metrics: mockMetrics,
                onMetricsChange,
            })
        );

        act(() => {
            result.current.handleMetricChange(1, "label", "New Label");
        });

        expect(onMetricsChange).toHaveBeenCalledWith([
            mockMetrics[0],
            { ...mockMetrics[1], label: "New Label" },
            mockMetrics[2],
        ]);
    });

    it("devrait calculer canMoveUp correctement", () => {
        const { result } = renderHook(() =>
            useMetricOperations({
                metrics: mockMetrics,
                onMetricsChange: vi.fn(),
            })
        );

        expect(result.current.canMoveUp(0)).toBe(false);
        expect(result.current.canMoveUp(1)).toBe(true);
        expect(result.current.canMoveUp(2)).toBe(true);
    });

    it("devrait calculer canMoveDown correctement", () => {
        const { result } = renderHook(() =>
            useMetricOperations({
                metrics: mockMetrics,
                onMetricsChange: vi.fn(),
            })
        );

        expect(result.current.canMoveDown(0)).toBe(true);
        expect(result.current.canMoveDown(1)).toBe(true);
        expect(result.current.canMoveDown(2)).toBe(false);
    });

    it("devrait gérer une liste vide", () => {
        const onMetricsChange = vi.fn();
        const { result } = renderHook(() =>
            useMetricOperations({
                metrics: [],
                onMetricsChange,
                defaultAgg: "count",
            })
        );

        act(() => {
            result.current.handleAddMetric();
        });

        expect(onMetricsChange).toHaveBeenCalledWith([
            { agg: "count", field: "", label: "" },
        ]);
    });

    it("ne devrait pas modifier si l'index est invalide", () => {
        const onMetricsChange = vi.fn();
        const { result } = renderHook(() =>
            useMetricOperations({
                metrics: mockMetrics,
                onMetricsChange,
            })
        );

        act(() => {
            result.current.handleMetricChange(10, "label", "Test");
        });

        expect(onMetricsChange).not.toHaveBeenCalled();
    });
});
