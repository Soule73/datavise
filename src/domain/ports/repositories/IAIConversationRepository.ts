import type { AIConversation } from "../../entities/AIConversation.entity";
import type { Widget } from "../../entities/Widget.entity";

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

export interface RefineWidgetsPayload {
    dataSourceId: string;
    widgetIds: string[];
    refinementPrompt: string;
}

export interface IAIConversationRepository {
    findAll(): Promise<AIConversation[]>;
    findById(conversationId: string): Promise<AIConversation | null>;
    getConversationWidgets(conversationId: string): Promise<Widget[]>;
    create(payload: CreateConversationPayload): Promise<AIConversation>;
    addMessage(conversationId: string, message: AddMessagePayload): Promise<AIConversation>;
    updateTitle(conversationId: string, payload: UpdateTitlePayload): Promise<AIConversation>;
    delete(conversationId: string): Promise<void>;
    refineWidgets(payload: RefineWidgetsPayload): Promise<Widget[]>;
}
