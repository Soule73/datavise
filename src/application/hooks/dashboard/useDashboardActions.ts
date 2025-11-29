import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardRepository } from "@/infrastructure/repositories/DashboardRepository";
import { GetDashboardUseCase } from "@/domain/use-cases/dashboard/GetDashboard.usecase";
import { CreateDashboardUseCase } from "@/domain/use-cases/dashboard/CreateDashboard.usecase";
import { UpdateDashboardUseCase } from "@/domain/use-cases/dashboard/UpdateDashboard.usecase";
import { useDashboardStore } from "@/core/store/dashboard";
import { useNotificationStore } from "@/core/store/notification";
import { useUserStore } from "@/core/store/user";
import { useDashboardUIStore } from "@/core/store/useDashboardUIStore";
import { useDashboardConfigStore } from "@/core/store/useDashboardConfigStore";
import { useDataSourceList } from "../datasource/useDataSourceList";
import type { DashboardLayoutItem, IntervalUnit } from "@/domain/value-objects";
import type { Widget } from "@/domain/entities/Widget.entity";
import {
    getEffectiveTimeRange,
    buildTimeRange,
    getAutoRefreshMs,
    initDashboardTimeConfig,
    getDashboardPDFFileName,
} from "@/core/utils/dashboard/dashboardUtils";
import { exportDashboardToPDF } from "@/core/utils/dashboard/dashboardExportUtils";

const dashboardRepository = new DashboardRepository();
const getDashboardUseCase = new GetDashboardUseCase(dashboardRepository);
const createDashboardUseCase = new CreateDashboardUseCase(dashboardRepository);
const updateDashboardUseCase = new UpdateDashboardUseCase(dashboardRepository);

export function useDashboardActions(onSaveCallback?: (success: boolean) => void) {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const isCreate = location.pathname.includes("/dashboards/create");
    const dashboardId = params.id;

    const { data: dashboard } = useQuery({
        queryKey: ["dashboard", dashboardId],
        queryFn: () => getDashboardUseCase.execute(dashboardId!),
        enabled: !isCreate && !!dashboardId,
    });

    const { dataSources: sources } = useDataSourceList();

    const layout = useDashboardStore((s) => s.layout);
    const setLayout = useDashboardStore((s) => s.setLayout);
    const setHasUnsavedChanges = useDashboardStore((s) => s.setHasUnsavedChanges);
    const showNotification = useNotificationStore((s) => s.showNotification);
    const hasPermission = useUserStore((s) => s.hasPermission);

    const setEditMode = useDashboardUIStore((s) => s.setEditMode);
    const setSaving = useDashboardUIStore((s) => s.setSaving);
    const setSelectOpen = useDashboardUIStore((s) => s.setSelectOpen);
    const saveModalOpen = useDashboardUIStore((s) => s.saveModalOpen);
    const setSaveModalOpen = useDashboardUIStore((s) => s.setSaveModalOpen);
    const pendingTitle = useDashboardUIStore((s) => s.pendingTitle);
    const setPendingTitle = useDashboardUIStore((s) => s.setPendingTitle);
    const setExportPDFModalOpen = useDashboardUIStore((s) => s.setExportPDFModalOpen);

    const autoRefreshIntervalValue = useDashboardConfigStore((s) => s.autoRefreshIntervalValue);
    const autoRefreshIntervalUnit = useDashboardConfigStore((s) => s.autoRefreshIntervalUnit);
    const timeRangeFrom = useDashboardConfigStore((s) => s.timeRangeFrom);
    const timeRangeTo = useDashboardConfigStore((s) => s.timeRangeTo);
    const relativeValue = useDashboardConfigStore((s) => s.relativeValue);
    const relativeUnit = useDashboardConfigStore((s) => s.relativeUnit);
    const timeRangeMode = useDashboardConfigStore((s) => s.timeRangeMode);
    const forceRefreshKey = useDashboardConfigStore((s) => s.forceRefreshKey);
    const setAutoRefresh = useDashboardConfigStore((s) => s.setAutoRefresh);
    const setTimeRangeAbsolute = useDashboardConfigStore((s) => s.setTimeRangeAbsolute);
    const setTimeRangeRelative = useDashboardConfigStore((s) => s.setTimeRangeRelative);

    const [localDashboard, setLocalDashboard] = useState<{
        _id?: string;
        title: string;
        layout: DashboardLayoutItem[];
    }>({ title: "", layout: [] });

    const [visibility, setVisibility] = useState<"public" | "private">("private");

    const [effectiveTimeRange, setEffectiveTimeRange] = useState(() =>
        getEffectiveTimeRange({
            timeRangeMode,
            relativeValue,
            relativeUnit,
            timeRangeFrom,
            timeRangeTo,
        })
    );

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const createMutation = useMutation({
        mutationFn: (payload: {
            title: string;
            layout: DashboardLayoutItem[];
            visibility: "public" | "private";
            autoRefreshIntervalValue?: number;
            autoRefreshIntervalUnit?: IntervalUnit;
            timeRange?: any;
        }) => createDashboardUseCase.execute(payload as any),
        onSuccess: (newDashboard) => {
            queryClient.invalidateQueries({ queryKey: ["dashboards"] });
            showNotification({
                open: true,
                type: "success",
                title: "Tableau de bord créé",
                description: "Votre tableau de bord a bien été créé.",
            });
            navigate(`/dashboards/${newDashboard.id}`);
        },
        onError: (error: Error) => {
            showNotification({
                open: true,
                type: "error",
                title: "Erreur",
                description: error.message || "La création du tableau de bord a échoué.",
            });
            if (onSaveCallback) onSaveCallback(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: (payload: { id: string; updates: any }) =>
            updateDashboardUseCase.execute(payload.id, payload.updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboards"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", dashboardId] });
            setHasUnsavedChanges(false);
            showNotification({
                open: true,
                type: "success",
                title: "Sauvegradé",
                description: "Les modifications ont bien été sauvegardé !",
            });
            if (onSaveCallback) onSaveCallback(true);
        },
        onError: (error: Error) => {
            showNotification({
                open: true,
                type: "error",
                title: "Erreur",
                description: error.message || "Erreur lors de la sauvegarde",
            });
            if (onSaveCallback) onSaveCallback(false);
        },
    });

    const handleExportPDFConfirm = async (options: {
        orientation: "portrait" | "landscape";
    }) => {
        setExportPDFModalOpen(false);
        const filename = getDashboardPDFFileName(dashboard?.title);
        await exportDashboardToPDF({
            gridSelector: ".dashboard-grid",
            filename,
            orientation: options.orientation,
        });
    };

    const openAddWidgetModal = (e: React.MouseEvent) => {
        e.preventDefault();
        setSelectOpen(true);
    };

    const handleAddWidget = (widget: Widget) => {
        const newItem: DashboardLayoutItem = {
            i: widget.id,
            widgetId: widget.id,
            w: 6,
            h: 4,
            x: 0,
            y: isCreate ? localDashboard.layout.length * 4 : layout.length * 4,
            widget: widget as any,
        };
        if (isCreate) {
            setLocalDashboard((ld) => ({ ...ld, layout: [...ld.layout, newItem] }));
        } else {
            setLayout([...layout, newItem]);
        }
        setHasUnsavedChanges(true);
    };

    const setLocalTitle = (title: string) => {
        if (isCreate) setLocalDashboard((ld) => ({ ...ld, title }));
        setPendingTitle(title);
    };

    const handleSaveDashboard = async (updates?: Partial<{
        title: string;
        visibility: "public" | "private";
    }>) => {
        setSaving(true);
        try {
            const layoutToSave = isCreate
                ? localDashboard.layout
                : useDashboardStore.getState().layout;

            await updateMutation.mutateAsync({
                id: dashboardId!,
                updates: {
                    ...updates,
                    layout: layoutToSave,
                    autoRefreshIntervalValue,
                    autoRefreshIntervalUnit,
                    timeRange: buildTimeRange({
                        timeRangeMode,
                        relativeValue,
                        relativeUnit,
                        timeRangeFrom,
                        timeRangeTo,
                    }),
                    visibility: updates?.visibility ?? visibility,
                },
            });
        } catch {
            // Errors handled by mutation
        } finally {
            setSaving(false);
        }
    };

    const handleCreateDashboard = async (
        title: string,
        customVisibility?: "public" | "private"
    ) => {
        setSaving(true);
        try {
            await createMutation.mutateAsync({
                title,
                layout: localDashboard.layout,
                visibility: customVisibility ?? visibility,
                autoRefreshIntervalValue,
                autoRefreshIntervalUnit,
                timeRange: buildTimeRange({
                    timeRangeMode,
                    relativeValue,
                    relativeUnit,
                    timeRangeFrom,
                    timeRangeTo,
                }),
            });
        } catch {
            // Errors handled by mutation
        } finally {
            setSaving(false);
        }
    };

    const handleConfirmSave = async (customVisibility?: "public" | "private") => {
        if (isCreate) {
            await handleCreateDashboard(pendingTitle, customVisibility);
            setSaveModalOpen(false);
            return;
        }

        await handleSaveDashboard({
            title: pendingTitle,
            visibility: customVisibility ?? visibility,
        });

        setEditMode(false);
        setSaveModalOpen(false);
    };

    const handleSwapLayout = (newLayout: DashboardLayoutItem[]) => {
        if (isCreate) {
            setLocalDashboard((ld) => ({ ...ld, layout: newLayout }));
        } else {
            setLayout(newLayout);
        }
        setHasUnsavedChanges(true);
    };

    const handleSave = () => setSaveModalOpen(true);

    const handleCancelEdit = () => {
        if (dashboard && dashboard.layout) {
            handleSwapLayout(dashboard.layout);
        }
        if (dashboard && dashboard.title) {
            setPendingTitle(dashboard.title);
        }
        setEditMode(false);
    };

    const handleSaveConfig = async () => {
        const tr = getEffectiveTimeRange({
            timeRangeMode,
            relativeValue,
            relativeUnit,
            timeRangeFrom,
            timeRangeTo,
        });
        if (isCreate) {
            setLocalDashboard((ld) => ({
                ...ld,
                autoRefreshIntervalValue,
                autoRefreshIntervalUnit,
                timeRange: tr,
            } as any));
        } else {
            await handleSaveDashboard({
                autoRefreshIntervalValue,
                autoRefreshIntervalUnit,
                timeRange: tr,
            } as any);
        }
    };

    useEffect(() => {
        if (isCreate && layout.length === 0 && localDashboard.layout.length > 0) {
            setLayout(localDashboard.layout);
        }
    }, [isCreate, layout.length, localDashboard.layout, setLayout]);

    useEffect(() => {
        if (!isCreate && dashboard && dashboard.layout) {
            setLayout(dashboard.layout);
        }
    }, [dashboard, isCreate, setLayout]);

    useEffect(() => {
        if (dashboard && dashboard.title) {
            setPendingTitle(dashboard.title);
        } else if (isCreate) {
            setPendingTitle("Nouveau tableau de bord");
        }
    }, [dashboard, isCreate, setPendingTitle]);

    useEffect(() => {
        if (dashboard) {
            const cfg = initDashboardTimeConfig(dashboard as any);
            setAutoRefresh(cfg.autoRefreshIntervalValue, cfg.autoRefreshIntervalUnit);
            if (cfg.timeRangeMode === "absolute") {
                setTimeRangeAbsolute(cfg.timeRangeFrom, cfg.timeRangeTo);
            } else {
                setTimeRangeRelative(cfg.relativeValue, cfg.relativeUnit);
            }
        }
    }, [dashboard, setAutoRefresh, setTimeRangeAbsolute, setTimeRangeRelative]);

    useEffect(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        if (
            timeRangeMode === "relative" &&
            relativeValue &&
            relativeUnit &&
            autoRefreshIntervalValue &&
            autoRefreshIntervalUnit
        ) {
            const ms = getAutoRefreshMs(autoRefreshIntervalValue, autoRefreshIntervalUnit);
            setEffectiveTimeRange(
                getEffectiveTimeRange({
                    timeRangeMode,
                    relativeValue,
                    relativeUnit,
                    timeRangeFrom,
                    timeRangeTo,
                })
            );
            timerRef.current = setInterval(() => {
                setEffectiveTimeRange(
                    getEffectiveTimeRange({
                        timeRangeMode,
                        relativeValue,
                        relativeUnit,
                        timeRangeFrom,
                        timeRangeTo,
                    })
                );
            }, ms);
        } else {
            setEffectiveTimeRange(
                getEffectiveTimeRange({
                    timeRangeMode,
                    relativeValue,
                    relativeUnit,
                    timeRangeFrom,
                    timeRangeTo,
                })
            );
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [
        timeRangeMode,
        relativeValue,
        relativeUnit,
        autoRefreshIntervalValue,
        autoRefreshIntervalUnit,
        timeRangeFrom,
        timeRangeTo,
    ]);

    useEffect(() => {
        if (!isCreate && dashboard && dashboard.visibility) {
            setVisibility(dashboard.visibility);
        } else if (isCreate) {
            setVisibility("private");
        }
    }, [isCreate, dashboard]);

    const { from: effectiveFrom, to: effectiveTo } = effectiveTimeRange;
    const refreshMs = getAutoRefreshMs(autoRefreshIntervalValue, autoRefreshIntervalUnit);

    return {
        dashboardId,
        sources,
        layout: isCreate ? localDashboard.layout : layout,
        hasPermission,
        openAddWidgetModal,
        handleAddWidget,
        handleSwapLayout,
        setLocalTitle,
        saveModalOpen,
        setSaveModalOpen,
        pendingTitle,
        setPendingTitle,
        handleSave,
        handleConfirmSave,
        handleCancelEdit,
        isCreate,
        visibility,
        setVisibility,
        handleSaveConfig,
        effectiveFrom,
        effectiveTo,
        refreshMs,
        forceRefreshKey,
        handleExportPDF: handleExportPDFConfirm,
    };
}
