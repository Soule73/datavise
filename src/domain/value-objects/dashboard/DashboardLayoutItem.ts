import type { Widget } from "@/domain/entities/Widget.entity";
import type { Layout } from "react-grid-layout";

export interface DashboardLayoutItem extends Omit<Layout, 'i'> {
    i: string;
    widgetId: string;
    widget?: Widget;
}
