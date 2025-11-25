import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWidgetForm } from '../useWidgetForm';
import { useWidgetFormStore } from '@store/widgetFormStore';

describe('useWidgetForm', () => {
    beforeEach(() => {
        const { resetForm } = useWidgetFormStore.getState();
        resetForm();
    });

    it('devrait retourner toutes les propriétés du store', () => {
        const { result } = renderHook(() => useWidgetForm());

        expect(result.current).toHaveProperty('type');
        expect(result.current).toHaveProperty('config');
        expect(result.current).toHaveProperty('columns');
        expect(result.current).toHaveProperty('handleConfigChange');
        expect(result.current).toHaveProperty('handleMetricAggOrFieldChange');
    });

    it('devrait calculer widgetDef correctement', () => {
        const { result } = renderHook(() => useWidgetForm());

        expect(result.current.widgetDef).toBeDefined();
        expect(result.current.widgetDef.type).toBe('bar');
    });

    it('devrait calculer WidgetComponent correctement', () => {
        const { result } = renderHook(() => useWidgetForm());

        expect(result.current.WidgetComponent).toBeDefined();
        expect(typeof result.current.WidgetComponent).toBe('function');
    });

    describe('metricsWithLabels', () => {
        it('devrait retourner les métriques du config directement', () => {
            const { result } = renderHook(() => useWidgetForm());

            act(() => {
                result.current.setConfig({
                    metrics: [
                        { field: 'revenue', agg: 'sum', label: 'Total Revenue' }
                    ]
                });
            });

            expect(result.current.metricsWithLabels).toHaveLength(1);
            expect(result.current.metricsWithLabels[0].field).toBe('revenue');
            expect(result.current.metricsWithLabels[0].agg).toBe('sum');
            expect(result.current.metricsWithLabels[0].label).toBe('Total Revenue');
        });

        it('devrait retourner un tableau vide si pas de métriques', () => {
            const { result } = renderHook(() => useWidgetForm());

            expect(result.current.metricsWithLabels).toEqual([]);
        });
    });

    describe('isPreviewReady', () => {
        it('devrait retourner false si pas de métriques', () => {
            const { result } = renderHook(() => useWidgetForm());

            act(() => {
                result.current.setColumns(['col1', 'col2']);
                result.current.setDataPreview([{ col1: 1, col2: 2 }]);
            });

            expect(result.current.isPreviewReady).toBe(false);
        });

        it('devrait retourner true si métriques, dataPreview et WidgetComponent présents', () => {
            const { result } = renderHook(() => useWidgetForm());

            act(() => {
                result.current.setColumns(['col1', 'col2']);
                result.current.setDataPreview([{ col1: 1, col2: 2 }]);
                result.current.setConfig({
                    metrics: [{ field: 'col1', agg: 'sum', label: 'Sum col1' }]
                });
            });

            expect(result.current.isPreviewReady).toBe(true);
        });
    });

    describe('Reactivity', () => {
        it('devrait mettre à jour metricsWithLabels quand les métriques changent', () => {
            const { result } = renderHook(() => useWidgetForm());

            act(() => {
                result.current.setConfig({
                    metrics: [{ field: 'revenue', agg: 'sum', label: 'Sum Revenue' }]
                });
            });

            const firstLabels = result.current.metricsWithLabels;
            expect(firstLabels).toHaveLength(1);

            act(() => {
                result.current.handleConfigChange('metrics', [
                    { field: 'revenue', agg: 'sum', label: 'Sum Revenue' },
                    { field: 'quantity', agg: 'count', label: 'Count Quantity' }
                ]);
            });

            expect(result.current.metricsWithLabels).toHaveLength(2);
            expect(result.current.metricsWithLabels[1].field).toBe('quantity');
        });

        it('devrait mettre à jour widgetDef quand le type change', () => {
            const { result } = renderHook(() => useWidgetForm());

            const initialType = result.current.widgetDef.type;
            expect(initialType).toBe('bar');

            act(() => {
                result.current.setType('line');
            });

            expect(result.current.widgetDef.type).toBe('line');
        });
    });

    describe('Integration with store', () => {
        it('devrait propager les changements au store', () => {
            const { result } = renderHook(() => useWidgetForm());

            act(() => {
                result.current.handleConfigChange('title', 'Test Widget');
            });

            const storeConfig = useWidgetFormStore.getState().config;
            expect(storeConfig.title).toBe('Test Widget');
        });

        it('devrait synchroniser avec le store lors de resetForm', () => {
            const { result } = renderHook(() => useWidgetForm());

            act(() => {
                result.current.setType('pie');
                result.current.setColumns(['a', 'b']);
            });

            act(() => {
                result.current.resetForm();
            });

            expect(result.current.type).toBe('bar');
            expect(result.current.columns).toEqual([]);
        });
    });
});
