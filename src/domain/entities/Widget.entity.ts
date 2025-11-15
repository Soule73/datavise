import type { WidgetType } from "@type/widgetTypes";
import { WidgetValidationError } from "../errors/DomainError";

export type Visibility = "public" | "private";

export class Widget {
    readonly id: string;
    readonly widgetId: string;
    readonly title: string;
    readonly type: WidgetType;
    readonly config: unknown;
    readonly dataSourceId: string;
    readonly visibility: Visibility;
    readonly isDraft: boolean;
    readonly isGeneratedByAI: boolean;
    readonly conversationId?: string;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    constructor(
        id: string,
        widgetId: string,
        title: string,
        type: WidgetType,
        config: unknown,
        dataSourceId: string,
        visibility: Visibility,
        isDraft: boolean,
        isGeneratedByAI: boolean,
        conversationId?: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id;
        this.widgetId = widgetId;
        this.title = title;
        this.type = type;
        this.config = config;
        this.dataSourceId = dataSourceId;
        this.visibility = visibility;
        this.isDraft = isDraft;
        this.isGeneratedByAI = isGeneratedByAI;
        this.conversationId = conversationId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

        this.validate();
    }

    private validate(): void {
        if (!this.title || this.title.trim().length < 3) {
            throw new WidgetValidationError("Le titre doit contenir au moins 3 caractères");
        }
        if (this.title.length > 100) {
            throw new WidgetValidationError("Le titre ne peut pas dépasser 100 caractères");
        }
        if (!this.dataSourceId) {
            throw new WidgetValidationError("dataSourceId est requis");
        }
        if (!this.widgetId) {
            throw new WidgetValidationError("widgetId est requis");
        }
    }

    isPublished(): boolean {
        return !this.isDraft;
    }

    canBeDeleted(): boolean {
        return true;
    }

    canBeEdited(): boolean {
        return true;
    }

    clone(overrides: Partial<Omit<Widget, "id" | "createdAt" | "updatedAt">>): Widget {
        return new Widget(
            this.id,
            overrides.widgetId ?? this.widgetId,
            overrides.title ?? this.title,
            overrides.type ?? this.type,
            overrides.config ?? this.config,
            overrides.dataSourceId ?? this.dataSourceId,
            overrides.visibility ?? this.visibility,
            overrides.isDraft ?? this.isDraft,
            overrides.isGeneratedByAI ?? this.isGeneratedByAI,
            overrides.conversationId ?? this.conversationId,
            this.createdAt,
            this.updatedAt
        );
    }

    toJSON() {
        return {
            id: this.id,
            widgetId: this.widgetId,
            title: this.title,
            type: this.type,
            config: this.config,
            dataSourceId: this.dataSourceId,
            visibility: this.visibility,
            isDraft: this.isDraft,
            isGeneratedByAI: this.isGeneratedByAI,
            conversationId: this.conversationId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
