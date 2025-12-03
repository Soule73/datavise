export interface WidgetDTO {
    _id: string;
    widgetId: string;
    title: string;
    type: string;
    config: unknown;
    dataSourceId: string;
    ownerId: string;
    visibility: "public" | "private";
    isDraft?: boolean;
    isGeneratedByAI?: boolean;
    conversationId?: string;
    isUsed?: boolean;
    description?: string;
    reasoning?: string;
    confidence?: number;
    createdAt?: string;
    updatedAt?: string;
}
