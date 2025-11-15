import { WIDGETS } from "@/core/config/visualizations";
import { useRef, useEffect, useMemo, useState } from "react";
import type { DataSource } from "@/domain/entities/DataSource.entity";
import type { Widget } from "@/domain/entities/Widget.entity";
import type { DashboardLayoutItem } from "@/domain/value-objects";
import { getWidgetDataFields } from "@utils/widgets/widgetDataFields";
import { useQuery } from "@tanstack/react-query";
import { DataSourceRepository } from "@/infrastructure/repositories/DataSourceRepository";
import {
    getWidgetComponent,
    getDataError,
    getGridItemStyleProps,
    useGridItemResizeObserver,
} from "@utils/gridItemUtils";

const dataSourceRepository = new DataSourceRepository();

interface UseGridItemProps {
    widget?: Widget;
    sources?: DataSource[];
    idx: number;
    hydratedLayout: DashboardLayoutItem[];
    editMode?: boolean;
    onSwapLayout?: (newLayout: DashboardLayoutItem[]) => void;
    hoveredIdx: number | null;
    draggedIdx: number | null;
    handleDragStart?: (idx: number, e: React.DragEvent) => void;
    handleDragOver?: (idx: number, e: React.DragEvent) => void;
    handleDrop?: (idx: number, e?: React.DragEvent) => void;
    handleDragEnd?: () => void;
    isMobile?: boolean;
    item?: DashboardLayoutItem;
    timeRangeFrom?: string | null;
    timeRangeTo?: string | null;
    forceRefreshKey?: number;
    page?: number;
    pageSize?: number;
    shareId?: string;
    refreshMs?: number;
}

export function useGridItem({
    widget,
    sources,
    idx,
    hydratedLayout,
    editMode,
    onSwapLayout,
    hoveredIdx,
    draggedIdx,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    isMobile,
    item,
    timeRangeFrom,
    timeRangeTo,
    refreshMs,
    forceRefreshKey,
    page,
    pageSize,
    shareId,
}: UseGridItemProps) {
    const widgetRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
    useGridItemResizeObserver({
        widgetRef,
        editMode,
        hydratedLayout,
        idx,
        onSwapLayout,
    });

    function handleResize() {
        return widgetRef;
    }

    const dragProps = useMemo(() => {
        if (!editMode || isMobile) return {};

        return {
            draggable: true,
            onDragStart: (e: React.DragEvent) => {
                const target = e.target as HTMLElement;
                const rect = target.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const resizeZoneSize = 20;
                const isInResizeZone =
                    x >= rect.width - resizeZoneSize &&
                    y >= rect.height - resizeZoneSize;

                if (isInResizeZone) {
                    e.preventDefault();
                    return;
                }

                if (handleDragStart) {
                    handleDragStart(idx, e);
                }
            },
            onDragOver: (e: React.DragEvent) => {
                e.preventDefault();
                if (handleDragOver) handleDragOver(idx, e);
            },
            onDrop: (e: React.DragEvent) => {
                e.preventDefault();
                if (handleDrop) handleDrop(idx, e);
            },
            onDragEnd: () => {
                if (handleDragEnd) handleDragEnd();
            },
            onDragEnter: (e: React.DragEvent) => {
                e.preventDefault();
            },
            onDragLeave: (e: React.DragEvent) => {
                if (e.currentTarget.contains(e.relatedTarget as Node)) return;
            },
        };
    }, [
        editMode,
        isMobile,
        idx,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
        hoveredIdx,
    ]);

    const styleProps = useMemo(
        () =>
            getGridItemStyleProps({
                editMode,
                isMobile,
                draggedIdx,
                hoveredIdx,
                idx,
                item,
            }),
        [editMode, isMobile, draggedIdx, hoveredIdx, idx, item]
    );

    const source = sources?.find(
        (s: DataSource) => String(s.id) === String(widget?.dataSourceId)
    );

    const config = useMemo(() => widget?.config || {}, [widget?.config]);
    const fields = useMemo(
        () => getWidgetDataFields(config),
        [config]
    );

    const {
        data: widgetData,
        isLoading: loading,
        error,
    } = useQuery({
        queryKey: ["widgetData", source?.id, timeRangeFrom, timeRangeTo, fields, page, pageSize, shareId, forceRefreshKey],
        queryFn: () => dataSourceRepository.fetchData(source!.id, {
            from: timeRangeFrom || undefined,
            to: timeRangeTo || undefined,
            fields,
            page,
            pageSize,
            shareId,
        }),
        enabled: !!source?.id,
        refetchInterval: refreshMs || false,
        staleTime: refreshMs ? 0 : 1000 * 60 * 5,
    });

    const [lastValidData, setLastValidData] = useState<any>(undefined);
    useEffect(() => {
        if (widgetData && Array.isArray(widgetData) && widgetData.length > 0) {
            setLastValidData(widgetData);
        }
    }, [widgetData]);

    const isRefreshing = loading && !!lastValidData;

    const WidgetComponent = getWidgetComponent(widget, WIDGETS);

    const dataError = getDataError({ source, error, loading, widgetData });

    return {
        widgetData: lastValidData || widgetData,
        loading,
        isRefreshing,
        error: dataError,
        WidgetComponent,
        config,
        handleResize,
        dragProps,
        styleProps,
    };
}
