import { AIWidgetValidationError } from "../errors/DomainError";
import type { WidgetConfig } from "@type/widgetTypes";

export class AIGeneratedWidget {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly type: string;
    readonly config: WidgetConfig;
    readonly dataSourceId: string;
    readonly reasoning: string;
    readonly confidence: number;
    readonly mongoId?: string;

    constructor(
        id: string,
        name: string,
        description: string,
        type: string,
        config: WidgetConfig,
        dataSourceId: string,
        reasoning: string,
        confidence: number,
        mongoId?: string
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.config = config;
        this.dataSourceId = dataSourceId;
        this.reasoning = reasoning;
        this.confidence = confidence;
        this.mongoId = mongoId;
        this.validate();
    }

    private validate(): void {
        if (!this.name || this.name.trim().length < 2) {
            throw new AIWidgetValidationError(
                "Le nom doit contenir au moins 2 caractères"
            );
        }
        if (this.name.length > 100) {
            throw new AIWidgetValidationError(
                "Le nom ne peut pas dépasser 100 caractères"
            );
        }
        if (!this.description || this.description.trim().length < 5) {
            throw new AIWidgetValidationError(
                "La description doit contenir au moins 5 caractères"
            );
        }
        if (!this.type || this.type.trim().length === 0) {
            throw new AIWidgetValidationError("Le type est requis");
        }
        if (!this.dataSourceId || this.dataSourceId.trim().length === 0) {
            throw new AIWidgetValidationError("dataSourceId est requis");
        }
        if (this.confidence < 0 || this.confidence > 1) {
            throw new AIWidgetValidationError(
                "La confiance doit être entre 0 et 1"
            );
        }
    }

    isSaved(): boolean {
        return !!this.mongoId;
    }

    isHighConfidence(): boolean {
        return this.confidence >= 0.8;
    }

    isMediumConfidence(): boolean {
        return this.confidence >= 0.5 && this.confidence < 0.8;
    }

    isLowConfidence(): boolean {
        return this.confidence < 0.5;
    }

    getConfidenceLevel(): "high" | "medium" | "low" {
        if (this.isHighConfidence()) return "high";
        if (this.isMediumConfidence()) return "medium";
        return "low";
    }

    markAsSaved(mongoId: string): AIGeneratedWidget {
        return new AIGeneratedWidget(
            this.id,
            this.name,
            this.description,
            this.type,
            this.config,
            this.dataSourceId,
            this.reasoning,
            this.confidence,
            mongoId
        );
    }

    clone(overrides?: Partial<Omit<AIGeneratedWidget, "validate">>): AIGeneratedWidget {
        return new AIGeneratedWidget(
            overrides?.id ?? this.id,
            overrides?.name ?? this.name,
            overrides?.description ?? this.description,
            overrides?.type ?? this.type,
            overrides?.config ?? this.config,
            overrides?.dataSourceId ?? this.dataSourceId,
            overrides?.reasoning ?? this.reasoning,
            overrides?.confidence ?? this.confidence,
            overrides?.mongoId ?? this.mongoId
        );
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            type: this.type,
            config: this.config,
            dataSourceId: this.dataSourceId,
            reasoning: this.reasoning,
            confidence: this.confidence,
            mongoId: this.mongoId,
        };
    }
}
