import { create } from "zustand";

interface DashboardDataState {
    dataBySource: Map<string, Record<string, unknown>[]>;
    loadingBySource: Map<string, boolean>;
    errorsBySource: Map<string, Error | null>;
    timeRangeFrom: string | null;
    timeRangeTo: string | null;
    forceRefreshKey: number;

    setSourceData: (sourceId: string, data: Record<string, unknown>[]) => void;
    setSourceLoading: (sourceId: string, loading: boolean) => void;
    setSourceError: (sourceId: string, error: Error | null) => void;
    setTimeRange: (from: string | null, to: string | null) => void;
    incrementRefreshKey: () => void;
    clearSourceData: (sourceId: string) => void;
    clearAllData: () => void;

    getSourceData: (sourceId: string) => Record<string, unknown>[];
    isSourceLoading: (sourceId: string) => boolean;
    getSourceError: (sourceId: string) => Error | null;
}

export const useDashboardDataStore = create<DashboardDataState>((set, get) => ({
    dataBySource: new Map(),
    loadingBySource: new Map(),
    errorsBySource: new Map(),
    timeRangeFrom: null,
    timeRangeTo: null,
    forceRefreshKey: 0,

    setSourceData: (sourceId, data) => {
        set((state) => {
            const newMap = new Map(state.dataBySource);
            newMap.set(sourceId, data);
            return { dataBySource: newMap };
        });
    },

    setSourceLoading: (sourceId, loading) => {
        set((state) => {
            const newMap = new Map(state.loadingBySource);
            newMap.set(sourceId, loading);
            return { loadingBySource: newMap };
        });
    },

    setSourceError: (sourceId, error) => {
        set((state) => {
            const newMap = new Map(state.errorsBySource);
            newMap.set(sourceId, error);
            return { errorsBySource: newMap };
        });
    },

    setTimeRange: (from, to) => {
        set({ timeRangeFrom: from, timeRangeTo: to });
    },

    incrementRefreshKey: () => {
        set((state) => ({ forceRefreshKey: state.forceRefreshKey + 1 }));
    },

    clearSourceData: (sourceId) => {
        set((state) => {
            const dataMap = new Map(state.dataBySource);
            const loadingMap = new Map(state.loadingBySource);
            const errorsMap = new Map(state.errorsBySource);

            dataMap.delete(sourceId);
            loadingMap.delete(sourceId);
            errorsMap.delete(sourceId);

            return {
                dataBySource: dataMap,
                loadingBySource: loadingMap,
                errorsBySource: errorsMap,
            };
        });
    },

    clearAllData: () => {
        set({
            dataBySource: new Map(),
            loadingBySource: new Map(),
            errorsBySource: new Map(),
        });
    },

    getSourceData: (sourceId) => {
        return get().dataBySource.get(sourceId) || [];
    },

    isSourceLoading: (sourceId) => {
        return get().loadingBySource.get(sourceId) || false;
    },

    getSourceError: (sourceId) => {
        return get().errorsBySource.get(sourceId) || null;
    },
}));
