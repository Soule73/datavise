import { Dashboard } from "@domain/entities/Dashboard.entity";
import type { DashboardDTO } from "../api/dto/DashboardDTO";
import { createTimeRange, type TimeRange } from "@domain/value-objects/TimeRange.vo";
import { widgetMapper } from "./widgetMapper";

export const dashboardMapper = {
    toDomain(dto: DashboardDTO): Dashboard {
        const timeRange: TimeRange | undefined = dto.timeRange
            ? createTimeRange({
                from: dto.timeRange.from,
                to: dto.timeRange.to,
                intervalValue: dto.timeRange.intervalValue,
                intervalUnit: dto.timeRange.intervalUnit,
            })
            : undefined;

        const widgets = (dto.widgets || []).map(w => widgetMapper.toDomain(w));
        const widgetMap = new Map(widgets.map(w => [w.id, w]));

        const hydratedLayout = dto.layout.map(item => ({
            ...item,
            widget: widgetMap.get(item.widgetId),
        }));

        return new Dashboard(
            dto._id,
            dto.title,
            hydratedLayout,
            dto.ownerId,
            dto.visibility,
            widgets,
            dto.shareEnabled ?? false,
            timeRange,
            dto.autoRefreshIntervalValue,
            dto.autoRefreshIntervalUnit,
            dto.shareId,
            dto.createdAt ? new Date(dto.createdAt) : undefined,
            dto.updatedAt ? new Date(dto.updatedAt) : undefined
        );
    },

    toDTO(dashboard: Dashboard): Partial<DashboardDTO> {
        return {
            _id: dashboard.id,
            title: dashboard.title,
            layout: dashboard.layout,
            ownerId: dashboard.ownerId,
            visibility: dashboard.visibility,
            timeRange: dashboard.timeRange,
            autoRefreshIntervalValue: dashboard.autoRefreshIntervalValue,
            autoRefreshIntervalUnit: dashboard.autoRefreshIntervalUnit,
            widgets: dashboard.widgets.map(w => widgetMapper.toDTO(w)),
            shareEnabled: dashboard.shareEnabled,
            shareId: dashboard.shareId,
        };
    },

    partialToDTO(partial: Partial<Dashboard>): Partial<DashboardDTO> {
        const dto: Partial<DashboardDTO> = {};

        if (partial.title !== undefined) dto.title = partial.title;
        if (partial.layout !== undefined) dto.layout = partial.layout;
        if (partial.visibility !== undefined) dto.visibility = partial.visibility;
        if (partial.timeRange !== undefined) dto.timeRange = partial.timeRange;
        if (partial.autoRefreshIntervalValue !== undefined)
            dto.autoRefreshIntervalValue = partial.autoRefreshIntervalValue;
        if (partial.autoRefreshIntervalUnit !== undefined)
            dto.autoRefreshIntervalUnit = partial.autoRefreshIntervalUnit;

        return dto;
    },
};
