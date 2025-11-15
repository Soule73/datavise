export interface TimeRange {
    from?: string;
    to?: string;
    intervalValue?: number;
    intervalUnit?: "second" | "minute" | "hour" | "day" | "week" | "month" | "year";
}

export function createTimeRange(partial?: Partial<TimeRange>): TimeRange {
    return {
        from: partial?.from,
        to: partial?.to,
        intervalValue: partial?.intervalValue,
        intervalUnit: partial?.intervalUnit ?? "day",
    };
}

export function validateTimeRange(timeRange: TimeRange): boolean {
    if (timeRange.from && timeRange.to) {
        const fromDate = new Date(timeRange.from);
        const toDate = new Date(timeRange.to);
        return fromDate <= toDate;
    }
    return true;
}

export function getEffectiveTimeRange(timeRange?: TimeRange): { from: string; to: string } | null {
    if (!timeRange) return null;

    if (timeRange.from && timeRange.to) {
        return { from: timeRange.from, to: timeRange.to };
    }

    if (timeRange.intervalValue && timeRange.intervalUnit) {
        const now = new Date();
        const from = new Date();

        const multipliers: Record<string, number> = {
            second: 1000,
            minute: 60000,
            hour: 3600000,
            day: 86400000,
            week: 604800000,
            month: 2592000000,
            year: 31536000000,
        };

        const ms = timeRange.intervalValue * (multipliers[timeRange.intervalUnit] || 86400000);
        from.setTime(now.getTime() - ms);

        return {
            from: from.toISOString(),
            to: now.toISOString(),
        };
    }

    return null;
}
