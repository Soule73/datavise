import type { WidgetDTO } from "./WidgetDTO";

export interface GenerateWidgetsResponseDTO {
    conversationTitle?: string;
    widgets: WidgetDTO[];
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
