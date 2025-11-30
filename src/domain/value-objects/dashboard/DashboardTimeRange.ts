import type { IntervalUnit } from "./IntervalUnit";

export interface DashboardTimeRange {
    from?: string;
    to?: string;
    intervalValue?: number;
    intervalUnit?: IntervalUnit;
}
