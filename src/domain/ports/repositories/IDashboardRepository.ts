import type { Dashboard } from "../../entities/Dashboard.entity";
import type { DashboardLayoutItem } from "@domain/value-objects";
import type { TimeRange } from "../../value-objects/TimeRange.vo";

export interface DashboardFilters {
    visibility?: "public" | "private";
    search?: string;
    ownerId?: string;
}

export interface UpdateDashboardPayload {
    title?: string;
    layout?: DashboardLayoutItem[];
    timeRange?: TimeRange;
    autoRefreshIntervalValue?: number;
    autoRefreshIntervalUnit?: "second" | "minute" | "hour" | "day" | "week" | "month" | "year";
    visibility?: "public" | "private";
}

export interface ShareDashboardResult {
    shareId: string;
    shareEnabled: boolean;
}

export interface IDashboardRepository {
    findAll(filters?: DashboardFilters): Promise<Dashboard[]>;
    findById(id: string): Promise<Dashboard | null>;
    findByShareId(shareId: string): Promise<Dashboard | null>;
    create(dashboard: Omit<Dashboard, "id" | "ownerId" | "createdAt" | "updatedAt" | "widgets">): Promise<Dashboard>;
    update(id: string, updates: UpdateDashboardPayload): Promise<Dashboard>;
    delete(id: string): Promise<void>;
    enableShare(id: string): Promise<ShareDashboardResult>;
    disableShare(id: string): Promise<{ success: boolean }>;
}
