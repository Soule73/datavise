import type { Widget } from "./widgetTypes";
import type { DataSource } from "./dataSource";

/**
 * Message dans une conversation AI
 */
export interface AIMessage {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    widgetsGenerated?: number;
}

/**
 * Résumé de la source de données analysée
 */
export interface DataSourceSummary {
    name: string;
    type: string;
    rowCount: number;
    columns: Array<{
        name: string;
        type: string;
        uniqueValues?: number;
        sampleValues?: any[];
    }>;
}

/**
 * Conversation AI Builder
 */
export interface AIConversation {
    _id: string;
    userId: string;
    dataSourceId: string;
    dataSource?: DataSource;
    title: string;
    widgets?: Widget[];
    messages: AIMessage[];
    dataSourceSummary?: DataSourceSummary;
    suggestions?: string[];
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Requête pour créer une conversation
 */
export interface CreateConversationRequest {
    dataSourceId: string;
    title?: string;
    initialPrompt?: string;
}

/**
 * Requête pour ajouter un message
 */
export interface AddMessageRequest {
    conversationId: string;
    role: "user" | "assistant";
    content: string;
    widgetsGenerated?: number;
}

/**
 * Requête pour mettre à jour le titre
 */
export interface UpdateTitleRequest {
    conversationId: string;
    title: string;
}

/**
 * Requête pour raffiner des widgets sauvegardés
 */
export interface RefineWidgetsDbRequest {
    dataSourceId: string;
    widgetIds: string[];
    refinementPrompt: string;
}
