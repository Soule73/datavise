import { useMemo } from 'react';
import { useWidgetFormStore } from '@stores/widgetFormStore';
import { WIDGETS } from '@/core/config/visualizations';
import { isWidgetPreviewReady } from '@utils/datasource/dataSourceUtils';

export function useWidgetForm() {
    const config = useWidgetFormStore((state) => state.config);
    const type = useWidgetFormStore((state) => state.type);
    const columns = useWidgetFormStore((state) => state.columns);
    const dataPreview = useWidgetFormStore((state) => state.dataPreview);
    const tab = useWidgetFormStore((state) => state.tab);
    const sourceId = useWidgetFormStore((state) => state.sourceId);
    const step = useWidgetFormStore((state) => state.step);
    const showSaveModal = useWidgetFormStore((state) => state.showSaveModal);
    const loading = useWidgetFormStore((state) => state.loading);
    const title = useWidgetFormStore((state) => state.title);
    const visibility = useWidgetFormStore((state) => state.visibility);
    const widgetTitle = useWidgetFormStore((state) => state.widgetTitle);
    const widgetTitleError = useWidgetFormStore((state) => state.widgetTitleError);
    const error = useWidgetFormStore((state) => state.error);
    const draggedMetric = useWidgetFormStore((state) => state.draggedMetric);

    const setStep = useWidgetFormStore((state) => state.setStep);
    const setType = useWidgetFormStore((state) => state.setType);
    const setSourceId = useWidgetFormStore((state) => state.setSourceId);
    const setColumns = useWidgetFormStore((state) => state.setColumns);
    const setDataPreview = useWidgetFormStore((state) => state.setDataPreview);
    const setConfig = useWidgetFormStore((state) => state.setConfig);
    const setTab = useWidgetFormStore((state) => state.setTab);
    const setShowSaveModal = useWidgetFormStore((state) => state.setShowSaveModal);
    const setLoading = useWidgetFormStore((state) => state.setLoading);
    const setTitle = useWidgetFormStore((state) => state.setTitle);
    const setVisibility = useWidgetFormStore((state) => state.setVisibility);
    const setWidgetTitle = useWidgetFormStore((state) => state.setWidgetTitle);
    const setWidgetTitleError = useWidgetFormStore((state) => state.setWidgetTitleError);
    const setError = useWidgetFormStore((state) => state.setError);
    const setDraggedMetric = useWidgetFormStore((state) => state.setDraggedMetric);

    const handleConfigChange = useWidgetFormStore((state) => state.handleConfigChange);
    const handleMetricAggOrFieldChange = useWidgetFormStore((state) => state.handleMetricAggOrFieldChange);
    const handleMetricStyleChange = useWidgetFormStore((state) => state.handleMetricStyleChange);
    const handleMetricReorder = useWidgetFormStore((state) => state.handleMetricReorder);
    const syncMetricStylesWithMetrics = useWidgetFormStore((state) => state.syncMetricStylesWithMetrics);
    const initializeForm = useWidgetFormStore((state) => state.initializeForm);
    const resetForm = useWidgetFormStore((state) => state.resetForm);

    const widgetDef = useMemo(() => WIDGETS[type], [type]);
    const WidgetComponent = useMemo(() => WIDGETS[type]?.component, [type]);

    const metricsWithLabels = useMemo(() => {
        return config.metrics || [];
    }, [config.metrics]);

    const isPreviewReady = useMemo(() => {
        return isWidgetPreviewReady(WidgetComponent, dataPreview as Record<string, any>[], config);
    }, [WidgetComponent, dataPreview, config]); return {
        step,
        type,
        sourceId,
        columns,
        dataPreview,
        config,
        tab,
        showSaveModal,
        loading,
        title,
        visibility,
        widgetTitle,
        widgetTitleError,
        error,
        draggedMetric,

        setStep,
        setType,
        setSourceId,
        setColumns,
        setDataPreview,
        setConfig,
        setTab,
        setShowSaveModal,
        setLoading,
        setTitle,
        setVisibility,
        setWidgetTitle,
        setWidgetTitleError,
        setError,
        setDraggedMetric,

        handleConfigChange,
        handleMetricAggOrFieldChange,
        handleMetricStyleChange,
        handleMetricReorder,
        syncMetricStylesWithMetrics,
        initializeForm,
        resetForm,

        widgetDef,
        WidgetComponent,
        metricsWithLabels,
        isPreviewReady,
    };
}
