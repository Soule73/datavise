import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WidgetType, WidgetConfig } from '@/domain/value-objects';
import { reorderMetrics, updateMetricWithAutoLabel } from '@utils/bucketMetrics/metricUtils';
import { syncMetricStyles } from '@utils/widgets/widgetConfigUtils';
import { DataSourceRepository } from '@/infrastructure/repositories/DataSourceRepository';
import { extractColumnsFromData } from '@/core/utils/datasource/dataSourceUtils';
import { WIDGETS } from '@/core/config/visualizations';

function generateDefaultConfig(type: WidgetType): WidgetConfig {
    const widgetDef = WIDGETS[type];
    if (!widgetDef?.configSchema) return {};

    const config: WidgetConfig = {
        metrics: [],
        metricStyles: [],
    };

    if (widgetDef.configSchema.widgetParams) {
        const params = widgetDef.configSchema.widgetParams as Record<string, { default?: unknown }>;
        Object.keys(params).forEach((key) => {
            const param = params[key];
            if (param && 'default' in param) {
                config[key] = param.default;
            }
        });
    }

    if (widgetDef.configSchema.globalFilters) {
        config.globalFilters = [];
    }

    return config;
}

interface WidgetFormState {
    step: number;
    type: WidgetType;
    sourceId: string;
    columns: string[];
    dataPreview: unknown[];
    config: WidgetConfig;
    tab: 'data' | 'metricsAxes' | 'params';
    showSaveModal: boolean;
    loading: boolean;
    title: string;
    visibility: 'public' | 'private';
    widgetTitle: string;
    widgetTitleError: string;
    error: string;
    draggedMetric: number | null;
}

interface WidgetFormActions {
    setStep: (step: number) => void;
    setType: (type: WidgetType) => void;
    setSourceId: (sourceId: string) => void;
    setColumns: (columns: string[]) => void;
    setDataPreview: (dataPreview: unknown[]) => void;
    setConfig: (config: WidgetConfig | ((prev: WidgetConfig) => WidgetConfig)) => void;
    setTab: (tab: 'data' | 'metricsAxes' | 'params') => void;
    setShowSaveModal: (show: boolean) => void;
    setLoading: (loading: boolean) => void;
    setTitle: (title: string) => void;
    setVisibility: (visibility: 'public' | 'private') => void;
    setWidgetTitle: (widgetTitle: string) => void;
    setWidgetTitleError: (widgetTitleError: string) => void;
    setError: (error: string) => void;
    setDraggedMetric: (draggedMetric: number | null) => void;

    handleConfigChange: (field: string, value: unknown) => void;
    handleMetricAggOrFieldChange: (idx: number, field: 'agg' | 'field', value: string) => void;
    handleMetricStyleChange: (idx: number, field: string, value: unknown) => void;
    handleMetricReorder: (fromIndex: number, toIndex: number) => void;
    syncMetricStylesWithMetrics: () => void;
    loadSourceData: (sourceId: string) => Promise<void>;

    initializeForm: (initialState: Partial<WidgetFormState>) => void;
    resetForm: () => void;
}

type WidgetFormStore = WidgetFormState & WidgetFormActions;

const initialState: WidgetFormState = {
    step: 1,
    type: 'bar',
    sourceId: '',
    columns: [],
    dataPreview: [],
    config: {},
    tab: 'data',
    showSaveModal: false,
    loading: false,
    title: '',
    visibility: 'private',
    widgetTitle: '',
    widgetTitleError: '',
    error: '',
    draggedMetric: null,
};

export const useWidgetFormStore = create<WidgetFormStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            setStep: (step) => set({ step }),
            setType: (type) => set({ type }),
            setSourceId: (sourceId) => set({ sourceId }),
            setColumns: (columns) => set({ columns }),
            setDataPreview: (dataPreview) => set({ dataPreview }),

            setConfig: (config) => set((state) => ({
                config: typeof config === 'function' ? config(state.config) : config
            })),

            setTab: (tab) => set({ tab }),
            setShowSaveModal: (show) => set({ showSaveModal: show }),
            setLoading: (loading) => set({ loading }),
            setTitle: (title) => set({ title }),
            setVisibility: (visibility) => set({ visibility }),
            setWidgetTitle: (widgetTitle) => set({ widgetTitle }),
            setWidgetTitleError: (widgetTitleError) => set({ widgetTitleError }),
            setError: (error) => set({ error }),
            setDraggedMetric: (draggedMetric) => set({ draggedMetric }),

            handleConfigChange: (field, value) => {
                set((state) => ({
                    config: { ...state.config, [field]: value }
                }));
            },

            handleMetricAggOrFieldChange: (idx, field, value) => {
                const { config, type } = get();
                const newMetrics = updateMetricWithAutoLabel(
                    config.metrics || [],
                    idx,
                    field,
                    value,
                    type
                );

                set((state) => ({
                    config: { ...state.config, metrics: newMetrics }
                }));
            },

            handleMetricStyleChange: (idx, field, value) => {
                set((state) => {
                    const currentStyles = Array.isArray(state.config.metricStyles) ? state.config.metricStyles : [];
                    const newStyles = [...currentStyles];
                    newStyles[idx] = { ...newStyles[idx], [field]: value };

                    return {
                        config: { ...state.config, metricStyles: newStyles }
                    };
                });
            }, handleMetricReorder: (fromIndex, toIndex) => {
                const { config } = get();
                const newMetrics = reorderMetrics(config.metrics || [], fromIndex, toIndex);

                set((state) => ({
                    config: { ...state.config, metrics: newMetrics }
                }));
            },

            syncMetricStylesWithMetrics: () => {
                const { config, type } = get();
                const metrics = Array.isArray(config.metrics) ? config.metrics : [];
                const currentStyles = Array.isArray(config.metricStyles) ? config.metricStyles : [];

                const updatedStyles = syncMetricStyles(metrics, currentStyles, type); if (updatedStyles !== undefined) {
                    set((state) => ({
                        config: { ...state.config, metricStyles: updatedStyles }
                    }));
                }
            },

            loadSourceData: async (sourceId: string) => {
                if (!sourceId) return;

                set({ loading: true, error: '' });

                try {
                    const dataSourceRepository = new DataSourceRepository();
                    const data = await dataSourceRepository.fetchData(sourceId, {
                        page: 1,
                        pageSize: 100,
                    });

                    const typedData = data as Record<string, unknown>[];
                    const columns = extractColumnsFromData(typedData);

                    const currentConfig = get().config;
                    const type = get().type;
                    const shouldAutoConfig = !currentConfig.metrics || currentConfig.metrics.length === 0;

                    if (shouldAutoConfig && columns.length > 0) {
                        const firstNumericColumn = columns.find((col) => {
                            const sampleValue = typedData[0]?.[col];
                            return typeof sampleValue === 'number';
                        }) || columns[0];

                        const updatedConfig: WidgetConfig = {
                            ...currentConfig,
                            metrics: [{
                                field: firstNumericColumn,
                                agg: 'sum' as const,
                                label: firstNumericColumn,
                            }],
                        };

                        const widgetDef = WIDGETS[type];
                        if (widgetDef?.configSchema?.widgetParams) {
                            const params = widgetDef.configSchema.widgetParams as Record<string, { default?: unknown }>;
                            Object.keys(params).forEach((key) => {
                                const param = params[key];
                                if (param && 'default' in param && !(key in updatedConfig)) {
                                    updatedConfig[key] = param.default;
                                }
                            });
                        }

                        const shouldAddBucket = !updatedConfig.buckets || updatedConfig.buckets.length === 0;
                        if (shouldAddBucket && columns.length > 1 && !widgetDef?.hideBucket) {
                            updatedConfig.buckets = [{
                                field: columns[1] || columns[0],
                                label: columns[1] || columns[0],
                                type: 'terms' as const,
                                order: 'desc' as const,
                                size: 10,
                                minDocCount: 1
                            }];
                        }

                        set({
                            dataPreview: typedData,
                            columns,
                            config: updatedConfig,
                            loading: false,
                        });
                    } else {
                        set({
                            dataPreview: typedData,
                            columns,
                            loading: false,
                        });
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des données';
                    set({
                        error: errorMessage,
                        loading: false,
                        dataPreview: [],
                        columns: [],
                    });
                }
            },

            initializeForm: (initialState) => {
                const type = initialState.type || get().type;
                const config = initialState.config || generateDefaultConfig(type);

                set((state) => ({
                    ...state,
                    ...initialState,
                    config,
                }));
            },

            resetForm: () => set(initialState),
        }),
        {
            name: 'widget-form-storage',
            partialize: (state) => ({
                type: state.type,
                sourceId: state.sourceId,
                columns: state.columns,
                dataPreview: state.dataPreview,
                config: state.config,
                tab: state.tab,
                visibility: state.visibility,
                widgetTitle: state.widgetTitle,
            }),
        }
    )
);
