import type { WidgetConfig } from "@domain/value-objects";

export interface AIGeneratedWidgetDTO {
    id: string;
    _id?: string;
    name: string;
    description?: string;
    type: string;
    config: WidgetConfig;
    dataSourceId: string;
    reasoning?: string;
    confidence?: number;
}

export interface GenerateWidgetsResponseDTO {
    conversationTitle?: string;
    widgets: AIGeneratedWidgetDTO[];
    totalGenerated: number;
    dataSourceSummary: {
        name: string;
        type: string;
        rowCount: number;
        columns: Array<{
            name: string;
            type: string;
            uniqueValues?: number;
            sampleValues?: unknown[];
        }>;
    };
    suggestions?: string[];
}

export interface AnalyzeDataSourceResponseDTO {
    name: string;
    type: string;
    rowCount: number;
    columns: Array<{
        name: string;
        type: string;
        uniqueValues?: number;
        sampleValues?: unknown[];
    }>;
}
