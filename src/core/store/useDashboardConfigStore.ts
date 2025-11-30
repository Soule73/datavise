import { create } from "zustand";
import type { IntervalUnit } from "@/domain/value-objects";
import type { Filter } from "@/domain/value-objects/widgets/WidgetConfig";

interface DashboardConfigState {
    autoRefreshIntervalValue?: number;
    autoRefreshIntervalUnit?: IntervalUnit;
    timeRangeFrom: string | null;
    timeRangeTo: string | null;
    relativeValue?: number;
    relativeUnit?: IntervalUnit;
    timeRangeMode: "absolute" | "relative";
    forceRefreshKey: number;
    pageSize: number;
    globalFilters: Filter[];

    setAutoRefresh: (value?: number, unit?: IntervalUnit) => void;
    setTimeRangeAbsolute: (from: string | null, to: string | null) => void;
    setTimeRangeRelative: (value?: number, unit?: IntervalUnit) => void;
    setTimeRangeMode: (mode: "absolute" | "relative") => void;
    incrementForceRefreshKey: () => void;
    setPageSize: (size: number) => void;
    setGlobalFilters: (filters: Filter[]) => void;
    addGlobalFilter: (filter: Filter) => void;
    removeGlobalFilter: (index: number) => void;
    updateGlobalFilter: (index: number, filter: Filter) => void;

    resetConfig: () => void;
}

const initialState = {
    autoRefreshIntervalValue: undefined,
    autoRefreshIntervalUnit: "minute" as IntervalUnit,
    timeRangeFrom: null,
    timeRangeTo: null,
    relativeValue: undefined,
    relativeUnit: "minute" as IntervalUnit,
    timeRangeMode: "absolute" as "absolute" | "relative",
    forceRefreshKey: 0,
    pageSize: 10000,
    globalFilters: [] as Filter[],
};

export const useDashboardConfigStore = create<DashboardConfigState>((set) => ({
    ...initialState,

    setAutoRefresh: (value, unit) =>
        set({
            autoRefreshIntervalValue: value,
            autoRefreshIntervalUnit: unit || "minute"
        }),

    setTimeRangeAbsolute: (from, to) =>
        set({
            timeRangeFrom: from,
            timeRangeTo: to,
            timeRangeMode: "absolute"
        }),

    setTimeRangeRelative: (value, unit) =>
        set({
            relativeValue: value,
            relativeUnit: unit || "minute",
            timeRangeMode: "relative"
        }),

    setTimeRangeMode: (mode) => set({ timeRangeMode: mode }),

    incrementForceRefreshKey: () =>
        set((state) => ({ forceRefreshKey: state.forceRefreshKey + 1 })),

    setPageSize: (size) => set({ pageSize: Math.min(Math.max(size, 100), 10000) }),

    setGlobalFilters: (filters) => set({ globalFilters: filters }),

    addGlobalFilter: (filter) =>
        set((state) => ({ globalFilters: [...state.globalFilters, filter] })),

    removeGlobalFilter: (index) =>
        set((state) => ({
            globalFilters: state.globalFilters.filter((_, i) => i !== index)
        })),

    updateGlobalFilter: (index, filter) =>
        set((state) => ({
            globalFilters: state.globalFilters.map((f, i) => (i === index ? filter : f))
        })),

    resetConfig: () => set(initialState),
}));
