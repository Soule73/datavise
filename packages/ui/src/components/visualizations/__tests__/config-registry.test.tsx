import { describe, it, expect } from "vitest";
import type { WidgetType } from "@domain/value-objects";
import { WIDGET_DATA_CONFIG } from "@/core/config/visualizations";

describe("WIDGET_DATA_CONFIG Registry", () => {
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
            expect(WIDGET_DATA_CONFIG[type]).toBeDefined();
        });
    });

    it("devrait avoir une configuration valide pour chaque entrée", () => {
        allWidgetTypes.forEach((type) => {
            const entry = WIDGET_DATA_CONFIG[type];
            expect(entry).toBeDefined();
            expect(entry.metrics || entry.datasetType).toBeDefined();
        });
    });

    it("devrait avoir les bonnes configurations pour les widgets metrics", () => {
        expect(WIDGET_DATA_CONFIG.kpiGroup.useMetricSection).toBe(true);
        expect(WIDGET_DATA_CONFIG.kpi.useMetricSection).toBe(true);
        expect(WIDGET_DATA_CONFIG.bar.useMetricSection).toBe(true);
        expect(WIDGET_DATA_CONFIG.line.useMetricSection).toBe(true);
        expect(WIDGET_DATA_CONFIG.pie.useMetricSection).toBe(true);
    });

    it("devrait avoir les bonnes configurations pour les widgets dataset", () => {
        expect(WIDGET_DATA_CONFIG.bubble.useDatasetSection).toBe(true);
        expect(WIDGET_DATA_CONFIG.bubble.datasetType).toBe("xyr");
        expect(WIDGET_DATA_CONFIG.scatter.useDatasetSection).toBe(true);
        expect(WIDGET_DATA_CONFIG.scatter.datasetType).toBe("xy");
        expect(WIDGET_DATA_CONFIG.radar.useDatasetSection).toBe(true);
        expect(WIDGET_DATA_CONFIG.radar.datasetType).toBe("multiAxis");
    });

    it("devrait avoir allowMultipleMetrics correct", () => {
        expect(WIDGET_DATA_CONFIG.kpi.allowMultipleMetrics).toBe(false);
        expect(WIDGET_DATA_CONFIG.bar.allowMultipleMetrics).toBe(true);
        expect(WIDGET_DATA_CONFIG.kpiGroup.allowMultipleMetrics).toBe(true);
    });

    it("devrait avoir useGlobalFilters correct", () => {
        expect(WIDGET_DATA_CONFIG.bar.useGlobalFilters).toBe(true);
        expect(WIDGET_DATA_CONFIG.kpi.useGlobalFilters).toBe(true);
        expect(WIDGET_DATA_CONFIG.scatter.useGlobalFilters).toBe(false);
        expect(WIDGET_DATA_CONFIG.bubble.useGlobalFilters).toBe(false);
    });

    it("devrait avoir allowMultipleDatasets correct pour les widgets dataset", () => {
        expect(WIDGET_DATA_CONFIG.bubble.allowMultipleDatasets).toBe(true);
        expect(WIDGET_DATA_CONFIG.scatter.allowMultipleDatasets).toBe(true);
        expect(WIDGET_DATA_CONFIG.radar.allowMultipleDatasets).toBe(true);
    });

    it("devrait avoir les titres de section corrects", () => {
        expect(WIDGET_DATA_CONFIG.bubble.datasetSectionTitle).toBe("Datasets (x, y, r)");
        expect(WIDGET_DATA_CONFIG.scatter.datasetSectionTitle).toBe("Datasets (x, y)");
        expect(WIDGET_DATA_CONFIG.radar.datasetSectionTitle).toBe("Datasets (axes multiples)");
    });
});
