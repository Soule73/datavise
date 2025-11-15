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
    createdAt?: string;
    updatedAt?: string;
}
