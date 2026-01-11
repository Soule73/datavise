import type { Widget } from "@/domain/entities/Widget.entity";
import type { DataSourceSummary } from "../../value-objects/DataSourceSummary.vo";

export interface GenerateWidgetsPayload {
    dataSourceId: string;
    conversationId: string;
    userPrompt?: string;
    maxWidgets?: number;
    preferredTypes?: string[];
}

export interface RefineWidgetsPayload {
    conversationId: string;
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
