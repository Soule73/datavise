import type { AIGeneratedWidget } from "../../entities/AIGeneratedWidget.entity";
import type { DataSourceSummary } from "../../value-objects/DataSourceSummary.vo";

export interface GenerateWidgetsPayload {
    dataSourceId: string;
    conversationId: string;
    userPrompt?: string;
    maxWidgets?: number;
    preferredTypes?: string[];
}

export interface RefineWidgetsPayload {
    dataSourceId: string;
    currentWidgets: AIGeneratedWidget[];
    refinementPrompt: string;
}

export interface GenerateWidgetsResult {
    conversationTitle?: string;
    widgets: AIGeneratedWidget[];
    totalGenerated: number;
    dataSourceSummary: DataSourceSummary;
    suggestions?: string[];
}

export interface IAIWidgetRepository {
    generateWidgets(payload: GenerateWidgetsPayload): Promise<GenerateWidgetsResult>;
    refineWidgets(payload: RefineWidgetsPayload): Promise<GenerateWidgetsResult>;
    analyzeDataSource(dataSourceId: string): Promise<DataSourceSummary>;
}
