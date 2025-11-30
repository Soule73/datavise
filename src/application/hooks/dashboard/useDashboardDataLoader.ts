/**
 * Hook de chargement centralisé des données pour les dashboards
 * 
 * Ce hook optimise les requêtes de données en :
 * 1. Groupant les widgets par source de données
 * 2. Agrégeant tous les champs nécessaires de chaque widget (metrics, buckets, filters, columns)
 * 3. Effectuant une seule requête par source au lieu d'une par widget
 * 
 * Exemple : 10 widgets utilisant 2 sources → 2 requêtes au lieu de 10
 * 
 * Les données sont stockées dans useDashboardDataStore et accessibles par tous les widgets.
 */
import { useEffect, useMemo, useRef } from "react";
import { useQueries } from "@tanstack/react-query";
import type { DashboardLayoutItem } from "@/domain/value-objects";
import { getWidgetDataFields } from "@utils/widgets/widgetDataFields";
import { DataSourceRepository } from "@/infrastructure/repositories/DataSourceRepository";
import { useDashboardDataStore } from "@/core/store/useDashboardDataStore";

const dataSourceRepository = new DataSourceRepository();

interface UseDashboardDataLoaderProps {
    layout: DashboardLayoutItem[];
    timeRangeFrom?: string | null;
    timeRangeTo?: string | null;
    refreshMs?: number;
    forceRefreshKey?: number;
    shareId?: string;
    pageSize?: number;
    globalFilters?: any[];
}

export function useDashboardDataLoader({
    layout,
    timeRangeFrom,
    timeRangeTo,
    refreshMs,
    forceRefreshKey,
    shareId,
    pageSize = 10000,
}: UseDashboardDataLoaderProps) {
    const {
        setSourceData,
        setSourceLoading,
        setSourceError,
        setTimeRange,
        clearAllData,
    } = useDashboardDataStore();

    useEffect(() => {
        setTimeRange(timeRangeFrom || null, timeRangeTo || null);
    }, [timeRangeFrom, timeRangeTo, setTimeRange]);

    useEffect(() => {
        return () => {
            clearAllData();
        };
    }, [clearAllData]);

    const widgetsBySource = useMemo(() => {
        const grouped = new Map<string, DashboardLayoutItem[]>();
        layout.forEach((item) => {
            const sourceId = item.widget?.dataSourceId;
            if (sourceId && item.widget) {
                if (!grouped.has(sourceId)) {
                    grouped.set(sourceId, []);
                }
                grouped.get(sourceId)!.push(item);
            }
        });
        return grouped;
    }, [layout]);

    const fieldsBySource = useMemo(() => {
        const fields = new Map<string, string[]>();
        widgetsBySource.forEach((items, sourceId) => {
            const allFields = new Set<string>();
            items.forEach((item) => {
                if (item.widget?.config) {
                    const widgetFields = getWidgetDataFields(item.widget.config);
                    widgetFields.forEach((f) => allFields.add(f));
                }
            });
            const fieldsArray = Array.from(allFields);
            fields.set(sourceId, fieldsArray);

            if (process.env.NODE_ENV === 'development') {
                console.log(`[DashboardDataLoader] Source ${sourceId}: ${items.length} widgets, ${fieldsArray.length} champs uniques:`, fieldsArray);
            }
        });
        return fields;
    }, [widgetsBySource]);

    const sourceIds = Array.from(widgetsBySource.keys());

    const queries = sourceIds.map((sourceId) => ({
        queryKey: [
            "dashboardSourceData",
            sourceId,
            timeRangeFrom,
            timeRangeTo,
            fieldsBySource.get(sourceId),
            forceRefreshKey,
            shareId,
            pageSize,
        ],
        queryFn: async () => {
            const fields = fieldsBySource.get(sourceId) || [];
            return dataSourceRepository.fetchData(sourceId, {
                from: timeRangeFrom || undefined,
                to: timeRangeTo || undefined,
                fields,
                pageSize,
                shareId,
            });
        },
        enabled: !!sourceId,
        refetchInterval: (refreshMs || false) as number | false,
        staleTime: refreshMs ? 0 : 1000 * 60 * 5,
    }));

    const results = useQueries({ queries });

    const prevResultsRef = useRef<typeof results>([]);
    const settersRef = useRef({ setSourceData, setSourceLoading, setSourceError });

    useEffect(() => {
        settersRef.current = { setSourceData, setSourceLoading, setSourceError };
    }, [setSourceData, setSourceLoading, setSourceError]);

    useEffect(() => {
        const { setSourceData, setSourceLoading, setSourceError } = settersRef.current;

        sourceIds.forEach((sourceId, idx) => {
            const result = results[idx];
            const prevResult = prevResultsRef.current[idx];

            if (prevResult?.isLoading !== result.isLoading) {
                setSourceLoading(sourceId, result.isLoading);
            }

            if (result.data && result.data !== prevResult?.data) {
                setSourceData(sourceId, result.data);
            }

            if (result.error !== prevResult?.error) {
                setSourceError(sourceId, result.error ? (result.error as Error) : null);
            }
        });

        prevResultsRef.current = results;
    }, [results, sourceIds]);

    const isLoading = results.some((r) => r.isLoading);
    const hasErrors = results.some((r) => r.error);

    return {
        isLoading,
        hasErrors,
        sourceIds,
    };
}
