export class DomainError extends Error {
    readonly code?: string;

    constructor(message: string, code?: string) {
        super(message);
        this.code = code;
        this.name = "DomainError";
        Object.setPrototypeOf(this, DomainError.prototype);
    }
}

export class WidgetNotFoundError extends DomainError {
    constructor(widgetId: string) {
        super(`Widget avec l'ID ${widgetId} introuvable`, "WIDGET_NOT_FOUND");
        this.name = "WidgetNotFoundError";
    }
}

export class WidgetValidationError extends DomainError {
    constructor(message: string) {
        super(message, "WIDGET_VALIDATION_ERROR");
        this.name = "WidgetValidationError";
    }
}

export class DashboardNotFoundError extends DomainError {
    constructor(dashboardId: string) {
        super(`Dashboard avec l'ID ${dashboardId} introuvable`, "DASHBOARD_NOT_FOUND");
        this.name = "DashboardNotFoundError";
    }
}

export class DataSourceNotFoundError extends DomainError {
    constructor(dataSourceId: string) {
        super(`DataSource avec l'ID ${dataSourceId} introuvable`, "DATASOURCE_NOT_FOUND");
        this.name = "DataSourceNotFoundError";
    }
}

export class DataSourceValidationError extends DomainError {
    constructor(message: string) {
        super(message, "DATASOURCE_VALIDATION_ERROR");
        this.name = "DataSourceValidationError";
    }
}

export class DashboardValidationError extends DomainError {
    constructor(message: string) {
        super(message, "DASHBOARD_VALIDATION_ERROR");
        this.name = "DashboardValidationError";
    }
}

export class AIConversationNotFoundError extends DomainError {
    constructor(conversationId: string) {
        super(`Conversation AI avec l'ID ${conversationId} introuvable`, "AI_CONVERSATION_NOT_FOUND");
        this.name = "AIConversationNotFoundError";
    }
}

export class AIConversationValidationError extends DomainError {
    constructor(message: string) {
        super(message, "AI_CONVERSATION_VALIDATION_ERROR");
        this.name = "AIConversationValidationError";
    }
}

export class AIWidgetValidationError extends DomainError {
    constructor(message: string) {
        super(message, "AI_WIDGET_VALIDATION_ERROR");
        this.name = "AIWidgetValidationError";
    }
}

export class AIGenerationError extends DomainError {
    constructor(message: string) {
        super(message, "AI_GENERATION_ERROR");
        this.name = "AIGenerationError";
    }
}
