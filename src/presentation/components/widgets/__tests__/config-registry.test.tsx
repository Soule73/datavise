import { describe, it, expect } from "vitest";
import type { WidgetType } from "@/domain/value-objects";
import { WIDGET_DATA_CONFIG_COMPONENTS } from "../config/config-registry";

describe("WIDGET_DATA_CONFIG_COMPONENTS Registry", () => {
    const allWidgetTypes: WidgetType[] = [
        "kpi",
        "card",
        "kpiGroup",
        "bar",
        "line",
        "pie",
        "table",
        "radar",
        "bubble",
        "scatter",
    ];

    it("devrait avoir une entrée pour chaque type de widget", () => {
        allWidgetTypes.forEach((type) => {
            expect(WIDGET_DATA_CONFIG_COMPONENTS[type]).toBeDefined();
        });
    });

    it("devrait avoir un composant valide pour chaque entrée", () => {
        allWidgetTypes.forEach((type) => {
            const entry = WIDGET_DATA_CONFIG_COMPONENTS[type];
            expect(entry.component).toBeDefined();
            expect(typeof entry.component).toBe("function");
        });
    });

    it("devrait avoir le flag useBaseWrapper correct", () => {
        expect(WIDGET_DATA_CONFIG_COMPONENTS.kpiGroup.useBaseWrapper).toBe(false);
        expect(WIDGET_DATA_CONFIG_COMPONENTS.bubble.useBaseWrapper).toBe(true);
        expect(WIDGET_DATA_CONFIG_COMPONENTS.scatter.useBaseWrapper).toBe(true);
        expect(WIDGET_DATA_CONFIG_COMPONENTS.radar.useBaseWrapper).toBe(true);
        expect(WIDGET_DATA_CONFIG_COMPONENTS.kpi.useBaseWrapper).toBe(true);
        expect(WIDGET_DATA_CONFIG_COMPONENTS.bar.useBaseWrapper).toBe(true);
    });

    it("devrait avoir une fonction props si useBaseWrapper est true", () => {
        allWidgetTypes.forEach((type) => {
            const entry = WIDGET_DATA_CONFIG_COMPONENTS[type];
            if (entry.useBaseWrapper) {
                expect(entry.props).toBeDefined();
                expect(typeof entry.props).toBe("function");
            }
        });
    });

    it("devrait transformer les props correctement pour bubble", () => {
        const entry = WIDGET_DATA_CONFIG_COMPONENTS.bubble;
        const mockBaseProps = {
            dataConfig: {} as any,
            config: { metrics: [{ x: "col1", y: "col2", r: "col3" }] } as any,
            columns: ["col1", "col2", "col3"],
            handleConfigChange: () => { },
            data: [],
        };

        const transformedProps = entry.props!(mockBaseProps);
        expect(transformedProps).toHaveProperty("metrics");
        expect(transformedProps).toHaveProperty("columns");
        expect(transformedProps).toHaveProperty("handleConfigChange");
        expect(Array.isArray(transformedProps.metrics)).toBe(true);
    });

    it("devrait transformer les props correctement pour radar", () => {
        const entry = WIDGET_DATA_CONFIG_COMPONENTS.radar;
        const mockDataConfig = { axisFields: ["col1", "col2"] };
        const mockBaseProps = {
            dataConfig: mockDataConfig as any,
            config: { metrics: [] } as any,
            columns: ["col1", "col2"],
            handleConfigChange: () => { },
            data: [],
        };

        const transformedProps = entry.props!(mockBaseProps);
        expect(transformedProps).toHaveProperty("configSchema");
        expect(transformedProps.configSchema).toEqual({ dataConfig: mockDataConfig });
    });

    it("devrait transformer les props correctement pour kpiGroup", () => {
        const entry = WIDGET_DATA_CONFIG_COMPONENTS.kpiGroup;
        const mockBaseProps = {
            dataConfig: {} as any,
            config: {} as any,
            columns: ["col1"],
            handleConfigChange: () => { },
            handleDragStart: () => { },
            handleDragOver: () => { },
            handleDrop: () => { },
            data: [],
        };

        const transformedProps = entry.props!(mockBaseProps);
        expect(transformedProps).toHaveProperty("dataConfig");
        expect(transformedProps).toHaveProperty("handleDragStart");
        expect(transformedProps).toHaveProperty("handleDragOver");
        expect(transformedProps).toHaveProperty("handleDrop");
    });

    it("devrait avoir allowMultipleMetrics=false uniquement pour kpi", () => {
        const kpiEntry = WIDGET_DATA_CONFIG_COMPONENTS.kpi;
        const mockBaseProps = {
            dataConfig: {} as any,
            config: { metrics: [] } as any,
            columns: [],
            handleConfigChange: () => { },
            data: [],
        };

        const kpiProps = kpiEntry.props!(mockBaseProps);
        expect(kpiProps.allowMultipleMetrics).toBe(false);

        const barEntry = WIDGET_DATA_CONFIG_COMPONENTS.bar;
        const barProps = barEntry.props!(mockBaseProps);
        expect(barProps.allowMultipleMetrics).toBe(true);
    });

    it("devrait gérer correctement les metrics vides", () => {
        const entry = WIDGET_DATA_CONFIG_COMPONENTS.bubble;
        const mockBaseProps = {
            dataConfig: {} as any,
            config: { metrics: undefined } as any,
            columns: [],
            handleConfigChange: () => { },
            data: [],
        };

        const transformedProps = entry.props!(mockBaseProps);
        expect(Array.isArray(transformedProps.metrics)).toBe(true);
        expect(transformedProps.metrics).toEqual([]);
    });
});
