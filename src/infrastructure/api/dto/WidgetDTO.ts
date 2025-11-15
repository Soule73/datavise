export interface WidgetDTO {
    _id: string;
    widgetId: string;
    title: string;
    type: string;
    config: unknown;
    dataSourceId: string;
    visibility: "public" | "private";
    isDraft?: boolean;
    isGeneratedByAI?: boolean;
    conversationId?: string;
    isUsed?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
