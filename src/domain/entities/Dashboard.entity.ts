import type { DashboardLayoutItem, IntervalUnit } from "@/domain/value-objects";
import type { Widget } from "./Widget.entity";
import { DashboardValidationError } from "../errors/DomainError";
import type { TimeRange } from "../value-objects/TimeRange.vo";

export class Dashboard {
    readonly id: string;
    readonly title: string;
    readonly layout: DashboardLayoutItem[];
    readonly ownerId: string;
    readonly timeRange?: TimeRange;
    readonly visibility: "public" | "private";
    readonly autoRefreshIntervalValue?: number;
    readonly autoRefreshIntervalUnit?: IntervalUnit;
    readonly widgets: Widget[];
    readonly shareEnabled: boolean;
    readonly shareId?: string | null;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    constructor(
        id: string,
        title: string,
        layout: DashboardLayoutItem[],
        ownerId: string,
        visibility: "public" | "private",
        widgets: Widget[] = [],
        shareEnabled: boolean = false,
        timeRange?: TimeRange,
        autoRefreshIntervalValue?: number,
        autoRefreshIntervalUnit?: IntervalUnit,
        shareId?: string | null,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id;
        this.title = title;
        this.layout = layout;
        this.ownerId = ownerId;
        this.visibility = visibility;
        this.widgets = widgets;
        this.shareEnabled = shareEnabled;
        this.timeRange = timeRange;
        this.autoRefreshIntervalValue = autoRefreshIntervalValue;
        this.autoRefreshIntervalUnit = autoRefreshIntervalUnit;
        this.shareId = shareId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

        this.validate();
    }

    private validate(): void {
        if (!this.title || this.title.trim().length < 2) {
            throw new DashboardValidationError("Le titre doit contenir au moins 2 caractères");
        }

        if (this.title.length > 100) {
            throw new DashboardValidationError("Le titre ne peut pas dépasser 100 caractères");
        }

        if (this.autoRefreshIntervalValue !== undefined && this.autoRefreshIntervalValue < 1) {
            throw new DashboardValidationError("L'intervalle de rafraîchissement doit être >= 1");
        }
    }

    isPublic(): boolean {
        return this.visibility === "public";
    }

    isPrivate(): boolean {
        return this.visibility === "private";
    }

    isShared(): boolean {
        return this.shareEnabled && !!this.shareId;
    }

    canBeDeleted(): boolean {
        return true;
    }

    hasAutoRefresh(): boolean {
        return !!this.autoRefreshIntervalValue && !!this.autoRefreshIntervalUnit;
    }

    hasTimeRange(): boolean {
        return !!this.timeRange;
    }

    getRefreshIntervalMs(): number | null {
        if (!this.autoRefreshIntervalValue || !this.autoRefreshIntervalUnit) {
            return null;
        }

        const multipliers: Record<string, number> = {
            second: 1000,
            minute: 60000,
            hour: 3600000,
            day: 86400000,
            week: 604800000,
            month: 2592000000,
            year: 31536000000,
        };

        return this.autoRefreshIntervalValue * (multipliers[this.autoRefreshIntervalUnit] || 60000);
    }

    getWidgetCount(): number {
        return this.layout.length;
    }

    clone(overrides: Partial<Dashboard>): Dashboard {
        return new Dashboard(
            overrides.id ?? this.id,
            overrides.title ?? this.title,
            overrides.layout ?? this.layout,
            overrides.ownerId ?? this.ownerId,
            overrides.visibility ?? this.visibility,
            overrides.widgets ?? this.widgets,
            overrides.shareEnabled ?? this.shareEnabled,
            overrides.timeRange ?? this.timeRange,
            overrides.autoRefreshIntervalValue ?? this.autoRefreshIntervalValue,
            overrides.autoRefreshIntervalUnit ?? this.autoRefreshIntervalUnit,
            overrides.shareId ?? this.shareId,
            overrides.createdAt ?? this.createdAt,
            overrides.updatedAt ?? this.updatedAt
        );
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            layout: this.layout,
            ownerId: this.ownerId,
            visibility: this.visibility,
            widgets: this.widgets,
            shareEnabled: this.shareEnabled,
            timeRange: this.timeRange,
            autoRefreshIntervalValue: this.autoRefreshIntervalValue,
            autoRefreshIntervalUnit: this.autoRefreshIntervalUnit,
            shareId: this.shareId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
