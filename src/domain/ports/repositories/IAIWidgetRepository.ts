import type { Widget } from "../../entities/Widget.entity";
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
    currentWidgets: Widget[];
    refinementPrompt: string;
}

export interface GenerateWidgetsResult {
    conversationTitle?: string;
    widgets: Widget[];
    totalGenerated: number;
    dataSourceSummary: DataSourceSummary;
    suggestions?: string[];
}

export interface IAIWidgetRepository {
    generateWidgets(payload: GenerateWidgetsPayload): Promise<GenerateWidgetsResult>;
    refineWidgets(payload: RefineWidgetsPayload): Promise<GenerateWidgetsResult>;
    analyzeDataSource(dataSourceId: string): Promise<DataSourceSummary>;
}
