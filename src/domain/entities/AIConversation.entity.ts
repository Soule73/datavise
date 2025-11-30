import { AIConversationValidationError } from "../errors/DomainError";
import type { AIMessage } from "../value-objects/AIMessage.vo";
import type { DataSourceSummary } from "../value-objects/DataSourceSummary.vo";

export type { AIMessage };

export class AIConversation {
    readonly id: string;
    readonly userId: string;
    readonly dataSourceId: string;
    readonly title: string;
    readonly messages: AIMessage[];
    readonly widgetIds: string[];
    readonly dataSourceSummary?: DataSourceSummary;
    readonly suggestions?: string[];
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    constructor(
        id: string,
        userId: string,
        dataSourceId: string,
        title: string,
        messages: AIMessage[],
        widgetIds: string[],
        dataSourceSummary?: DataSourceSummary,
        suggestions?: string[],
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id;
        this.userId = userId;
        this.dataSourceId = dataSourceId;
        this.title = title;
        this.messages = messages;
        this.widgetIds = widgetIds;
        this.dataSourceSummary = dataSourceSummary;
        this.suggestions = suggestions;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.validate();
    }

    private validate(): void {
        if (!this.title || this.title.trim().length < 2) {
            throw new AIConversationValidationError(
                "Le titre doit contenir au moins 2 caractères"
            );
        }
        if (this.title.length > 200) {
            throw new AIConversationValidationError(
                "Le titre ne peut pas dépasser 200 caractères"
            );
        }
        if (!this.dataSourceId || this.dataSourceId.trim().length === 0) {
            throw new AIConversationValidationError("dataSourceId est requis");
        }
    }

    hasMessages(): boolean {
        return this.messages.length > 0;
    }

    hasWidgets(): boolean {
        return this.widgetIds.length > 0;
    }

    hasSummary(): boolean {
        return !!this.dataSourceSummary;
    }

    getMessageCount(): number {
        return this.messages.length;
    }

    getWidgetCount(): number {
        return this.widgetIds.length;
    }

    getLastMessage(): AIMessage | null {
        if (this.messages.length === 0) return null;
        return this.messages[this.messages.length - 1];
    }

    addMessage(message: AIMessage): AIConversation {
        return new AIConversation(
            this.id,
            this.userId,
            this.dataSourceId,
            this.title,
            [...this.messages, message],
            this.widgetIds,
            this.dataSourceSummary,
            this.suggestions,
            this.createdAt,
            new Date()
        );
    }

    updateTitle(newTitle: string): AIConversation {
        return new AIConversation(
            this.id,
            this.userId,
            this.dataSourceId,
            newTitle,
            this.messages,
            this.widgetIds,
            this.dataSourceSummary,
            this.suggestions,
            this.createdAt,
            new Date()
        );
    }

    clone(overrides?: Partial<Omit<AIConversation, "validate">>): AIConversation {
        return new AIConversation(
            overrides?.id ?? this.id,
            overrides?.userId ?? this.userId,
            overrides?.dataSourceId ?? this.dataSourceId,
            overrides?.title ?? this.title,
            overrides?.messages ?? this.messages,
            overrides?.widgetIds ?? this.widgetIds,
            overrides?.dataSourceSummary ?? this.dataSourceSummary,
            overrides?.suggestions ?? this.suggestions,
            overrides?.createdAt ?? this.createdAt,
            overrides?.updatedAt ?? this.updatedAt
        );
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            dataSourceId: this.dataSourceId,
            title: this.title,
            messages: this.messages,
            widgetIds: this.widgetIds,
            dataSourceSummary: this.dataSourceSummary,
            suggestions: this.suggestions,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
