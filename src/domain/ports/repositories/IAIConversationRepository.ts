import type { AIConversation } from "../../entities/AIConversation.entity";
import type { AIGeneratedWidget } from "../../entities/AIGeneratedWidget.entity";

export interface CreateConversationPayload {
    dataSourceId: string;
    title?: string;
    initialPrompt?: string;
}

export interface AddMessagePayload {
    role: "user" | "assistant";
    content: string;
    widgetsGenerated?: number;
}

export interface UpdateTitlePayload {
    title: string;
}

export interface RefineWidgetsDbPayload {
    dataSourceId: string;
    widgetIds: string[];
    refinementPrompt: string;
}

export interface IAIConversationRepository {
    findAll(): Promise<AIConversation[]>;
    findById(conversationId: string): Promise<AIConversation | null>;
    create(payload: CreateConversationPayload): Promise<AIConversation>;
    addMessage(conversationId: string, message: AddMessagePayload): Promise<AIConversation>;
    updateTitle(conversationId: string, payload: UpdateTitlePayload): Promise<AIConversation>;
    delete(conversationId: string): Promise<void>;
    refineWidgetsDb(payload: RefineWidgetsDbPayload): Promise<AIGeneratedWidget[]>;
}
