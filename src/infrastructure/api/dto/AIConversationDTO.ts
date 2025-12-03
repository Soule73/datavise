import type { WidgetDTO } from './WidgetDTO';

export interface AIMessageDTO {
    role: "user" | "assistant";
    content: string;
    timestamp: string | Date;
    widgetsGenerated?: number;
}

export interface AIConversationDTO {
    _id: string;
    userId: string;
    dataSourceId: string | { _id: string; name: string; type: string };
    title: string;
    messages: AIMessageDTO[];
    widgets?: WidgetDTO[];
    dataSourceSummary?: {
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
    createdAt: string | Date;
    updatedAt: string | Date;
}
