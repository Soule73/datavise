import type { Widget } from "@/domain/entities/Widget.entity";

export interface DashboardLayoutItem {
    widgetId: string;
    width: string;
    height: number;
    x: number;
    y: number;
    widget?: Widget;
}
