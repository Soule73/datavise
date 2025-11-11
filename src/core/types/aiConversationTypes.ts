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
 * Conversation AI Builder
 */
export interface AIConversation {
    _id: string;
    userId: string;
    dataSourceId: string;
    dataSource?: DataSource; // Populated
    title: string;
    widgets?: Widget[]; // Widgets chargés depuis Widget collection (via conversationId)
    messages: AIMessage[];
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
