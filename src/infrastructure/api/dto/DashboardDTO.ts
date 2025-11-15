import type { DashboardLayoutItem, IntervalUnit } from "@/domain/value-objects";
import type { Widget } from "@/domain/entities/Widget.entity";

export interface DashboardDTO {
    _id: string;
    title: string;
    layout: DashboardLayoutItem[];
    ownerId: string;
    timeRange?: {
        from?: string;
        to?: string;
        intervalValue?: number;
        intervalUnit?: IntervalUnit;
    };
    visibility: "public" | "private";
    autoRefreshIntervalValue?: number;
    autoRefreshIntervalUnit?: IntervalUnit;
    widgets: Widget[];
    shareEnabled?: boolean;
    shareId?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ShareDashboardResponseDTO {
    shareId: string;
}
