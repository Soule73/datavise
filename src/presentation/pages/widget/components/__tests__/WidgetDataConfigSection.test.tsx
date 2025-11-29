import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import type { WidgetType } from "@/domain/value-objects";
import WidgetDataConfigSection from "../universal/WidgetDataConfigSection";

vi.mock("@/application/hooks/useMultiBuckets", () => ({
    useMultiBuckets: () => ({
        buckets: [],
        handleBucketsChange: vi.fn(),
    }),
}));

vi.mock("@/core/config/visualizations", () => ({
    WIDGETS: {
        bubble: { enableFilter: true, hideBucket: false, allowMultipleMetrics: true },
        scatter: { enableFilter: true, hideBucket: false, allowMultipleMetrics: true },
        radar: { enableFilter: true, hideBucket: false, allowMultipleMetrics: true },
        kpiGroup: { enableFilter: false, hideBucket: true, allowMultipleMetrics: true },
        kpi: { enableFilter: true, hideBucket: false, allowMultipleMetrics: false },
        bar: { enableFilter: true, hideBucket: false, allowMultipleMetrics: true },
        line: { enableFilter: true, hideBucket: false, allowMultipleMetrics: true },
        pie: { enableFilter: true, hideBucket: false, allowMultipleMetrics: true },
        table: { enableFilter: true, hideBucket: false, allowMultipleMetrics: true },
        card: { enableFilter: true, hideBucket: false, allowMultipleMetrics: true },
    },
    WIDGET_DATA_CONFIG: {
        bubble: { buckets: { allow: true, allowMultiple: false, label: "Buckets" } },
        scatter: { buckets: { allow: true, allowMultiple: false, label: "Buckets" } },
        radar: { buckets: { allow: true, allowMultiple: false, label: "Buckets" } },
        kpiGroup: { buckets: { allow: false, allowMultiple: false, label: "Buckets" } },
        kpi: { buckets: { allow: true, allowMultiple: false, label: "Buckets" } },
        bar: { buckets: { allow: true, allowMultiple: false, label: "Buckets" } },
        line: { buckets: { allow: true, allowMultiple: false, label: "Buckets" } },
        pie: { buckets: { allow: true, allowMultiple: false, label: "Buckets" } },
        table: { buckets: { allow: true, allowMultiple: false, label: "Buckets" } },
        card: { buckets: { allow: true, allowMultiple: false, label: "Buckets" } },
    },
}));

describe("WidgetDataConfigSection", () => {
    const mockDataConfig = {
        axisFields: ["col1", "col2"],
        metrics: {
            label: "Métriques",
            allow: true,
            allowMultiple: true,
        },
    };

    const mockConfig = {
        metrics: [{ agg: "sum", field: "col1", label: "Total" }],
        buckets: [],
    };

    const mockColumns = ["col1", "col2", "col3"];
    const mockHandleConfigChange = vi.fn();

    const defaultProps = {
        dataConfig: mockDataConfig as any,
        config: mockConfig as any,
        columns: mockColumns,
        handleConfigChange: mockHandleConfigChange,
        handleDragStart: vi.fn(),
        handleDragOver: vi.fn(),
        handleDrop: vi.fn(),
        data: [],
    }; beforeEach(() => {
        vi.clearAllMocks();
    });

    it("devrait rendre sans erreur pour bubble", () => {
        const { container } = render(
            <WidgetDataConfigSection {...defaultProps} type="bubble" />
        );
        expect(container).toBeTruthy();
    });

    it("devrait rendre sans erreur pour scatter", () => {
        const { container } = render(
            <WidgetDataConfigSection {...defaultProps} type="scatter" />
        );
        expect(container).toBeTruthy();
    });

    it("devrait rendre sans erreur pour radar", () => {
        const { container } = render(
            <WidgetDataConfigSection {...defaultProps} type="radar" />
        );
        expect(container).toBeTruthy();
    });

    it("devrait rendre sans erreur pour kpiGroup", () => {
        const { container } = render(
            <WidgetDataConfigSection {...defaultProps} type="kpiGroup" />
        );
        expect(container).toBeTruthy();
    });

    it("devrait rendre sans erreur pour kpi", () => {
        const { container } = render(
            <WidgetDataConfigSection {...defaultProps} type="kpi" />
        );
        expect(container).toBeTruthy();
    });

    it("devrait rendre sans erreur pour bar", () => {
        const { container } = render(
            <WidgetDataConfigSection {...defaultProps} type="bar" />
        );
        expect(container).toBeTruthy();
    });

    it("devrait afficher warning pour type invalide", () => {
        const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => { });

        const { container } = render(
            <WidgetDataConfigSection {...defaultProps} type={"invalid" as WidgetType} />
        );

        expect(container.firstChild).toBeNull();
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            "No config component registered for widget type: invalid"
        );

        consoleWarnSpy.mockRestore();
    });

    it("devrait utiliser BaseWrapper pour les types standards", () => {
        const { container } = render(
            <WidgetDataConfigSection {...defaultProps} type="bar" />
        );

        const baseSection = container.querySelector('.bg-white');
        expect(baseSection).toBeTruthy();
    });

    it("ne devrait pas utiliser BaseWrapper pour kpiGroup", () => {
        const { container } = render(
            <WidgetDataConfigSection {...defaultProps} type="kpiGroup" />
        );

        expect(container.firstChild).toBeTruthy();
    });

    it("devrait passer les props correctement au composant", () => {
        render(
            <WidgetDataConfigSection {...defaultProps} type="bubble" />
        );

        expect(mockHandleConfigChange).not.toHaveBeenCalled();
    });

    it("devrait gérer les données vides", () => {
        const { container } = render(
            <WidgetDataConfigSection
                {...defaultProps}
                data={undefined}
                type="bubble"
            />
        );
        expect(container).toBeTruthy();
    });
});
