import type { DashboardLayoutItem } from "@type/dashboardTypes";
import type { Widget } from "@type/widgetTypes";

export interface DashboardDTO {
    _id: string;
    title: string;
    layout: DashboardLayoutItem[];
    ownerId: string;
    timeRange?: {
        from?: string;
        to?: string;
        intervalValue?: number;
        intervalUnit?: string;
    };
    visibility: "public" | "private";
    autoRefreshIntervalValue?: number;
    autoRefreshIntervalUnit?: string;
    widgets: Widget[];
    shareEnabled?: boolean;
    shareId?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ShareDashboardResponseDTO {
    shareId: string;
}
