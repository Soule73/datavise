import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWidgetFormStore } from '../widgetFormStore';

describe('widgetFormStore', () => {
    beforeEach(() => {
        const { resetForm } = useWidgetFormStore.getState();
        resetForm();
    });

    describe('State initialization', () => {
        it('devrait avoir les valeurs initiales par défaut', () => {
            const { result } = renderHook(() => useWidgetFormStore());

            expect(result.current.step).toBe(1);
            expect(result.current.type).toBe('bar');
            expect(result.current.sourceId).toBe('');
            expect(result.current.columns).toEqual([]);
            expect(result.current.dataPreview).toEqual([]);
            expect(result.current.config).toEqual({});
            expect(result.current.tab).toBe('data');
            expect(result.current.visibility).toBe('private');
        });
    });

    describe('Basic setters', () => {
        it('devrait mettre à jour le type', () => {
            const { result } = renderHook(() => useWidgetFormStore());

            act(() => {
                result.current.setType('line');
            });

            expect(result.current.type).toBe('line');
        });

        it('devrait mettre à jour le sourceId', () => {
            const { result } = renderHook(() => useWidgetFormStore());

            act(() => {
                result.current.setSourceId('source-123');
            });

            expect(result.current.sourceId).toBe('source-123');
        });

        it('devrait mettre à jour les colonnes', () => {
            const { result } = renderHook(() => useWidgetFormStore());
            const columns = ['col1', 'col2', 'col3'];

            act(() => {
                result.current.setColumns(columns);
            });

            expect(result.current.columns).toEqual(columns);
        });

        it('devrait mettre à jour le tab', () => {
            const { result } = renderHook(() => useWidgetFormStore());

            act(() => {
                result.current.setTab('params');
            });

            expect(result.current.tab).toBe('params');
        });
    });

    describe('Config management', () => {
        it('devrait mettre à jour la config avec un objet', () => {
            const { result } = renderHook(() => useWidgetFormStore());
            const newConfig = { title: 'Test Widget', metrics: [] };

            act(() => {
                result.current.setConfig(newConfig);
            });

            expect(result.current.config).toEqual(newConfig);
        });

        it('devrait mettre à jour la config avec une fonction', () => {
            const { result } = renderHook(() => useWidgetFormStore());

            act(() => {
                result.current.setConfig({ title: 'Initial' });
            });

            act(() => {
                result.current.setConfig((prev) => ({ ...prev, subtitle: 'Added' }));
            });

            expect(result.current.config).toEqual({
                title: 'Initial',
                subtitle: 'Added'
            });
        });

        it('devrait mettre à jour un champ de config via handleConfigChange', () => {
            const { result } = renderHook(() => useWidgetFormStore());

            act(() => {
                result.current.handleConfigChange('title', 'New Title');
            });

            expect(result.current.config.title).toBe('New Title');
        });

        it('devrait préserver les autres champs lors de handleConfigChange', () => {
            const { result } = renderHook(() => useWidgetFormStore());

            act(() => {
                result.current.setConfig({ title: 'Title', subtitle: 'Subtitle' });
            });

            act(() => {
                result.current.handleConfigChange('title', 'Updated Title');
            });

            expect(result.current.config).toEqual({
                title: 'Updated Title',
                subtitle: 'Subtitle'
            });
        });
    });

    describe('Metric operations', () => {
        it('devrait mettre à jour une métrique avec handleMetricAggOrFieldChange', () => {
            const { result } = renderHook(() => useWidgetFormStore());

            act(() => {
                result.current.setConfig({
                    metrics: [
                        { field: 'revenue', agg: 'sum', label: 'sum de revenue' }
                    ]
                });
            });

            act(() => {
                result.current.handleMetricAggOrFieldChange(0, 'agg', 'avg');
            });

            const metrics = result.current.config.metrics as any[];
            expect(metrics).toBeDefined();
            expect(metrics[0].agg).toBe('avg');
            expect(metrics[0].label).toBeDefined();
            expect(metrics[0].label.length).toBeGreaterThan(0);
        });

        it('devrait mettre à jour le style d\'une métrique', () => {
            const { result } = renderHook(() => useWidgetFormStore());

            act(() => {
                result.current.setConfig({
                    metrics: [{ field: 'revenue', agg: 'sum' }],
                    metricStyles: [{ color: 'blue' }]
                });
            });

            act(() => {
                result.current.handleMetricStyleChange(0, 'color', 'red');
            });

            const metricStyles = result.current.config.metricStyles as any[];
            expect(metricStyles[0].color).toBe('red');
        });

        it('devrait créer un nouveau style si inexistant', () => {
            const { result } = renderHook(() => useWidgetFormStore());

            act(() => {
                result.current.setConfig({
                    metrics: [{ field: 'revenue', agg: 'sum' }],
                    metricStyles: []
                });
            });

            act(() => {
                result.current.handleMetricStyleChange(0, 'color', 'green');
            });

            const metricStyles = result.current.config.metricStyles as any[];
            expect(metricStyles[0]).toEqual({ color: 'green' });
        });

        it('devrait réordonner les métriques', () => {
            const { result } = renderHook(() => useWidgetFormStore());

            act(() => {
                result.current.setConfig({
                    metrics: [
                        { field: 'a', agg: 'sum' },
                        { field: 'b', agg: 'avg' },
                        { field: 'c', agg: 'count' }
                    ]
                });
            });

            act(() => {
                result.current.handleMetricReorder(0, 2);
            });

            const metrics = result.current.config.metrics as any[];
            expect(metrics[0].field).toBe('b');
            expect(metrics[1].field).toBe('c');
            expect(metrics[2].field).toBe('a');
        });
    });

    describe('Modal and UI state', () => {
        it('devrait gérer showSaveModal', () => {
            const { result } = renderHook(() => useWidgetFormStore());

            act(() => {
                result.current.setShowSaveModal(true);
            });

            expect(result.current.showSaveModal).toBe(true);

            act(() => {
                result.current.setShowSaveModal(false);
            });

            expect(result.current.showSaveModal).toBe(false);
        });

        it('devrait gérer le titre du widget', () => {
            const { result } = renderHook(() => useWidgetFormStore());

            act(() => {
                result.current.setWidgetTitle('Mon Widget');
            });

            expect(result.current.widgetTitle).toBe('Mon Widget');
        });

        it('devrait gérer les erreurs de titre', () => {
            const { result } = renderHook(() => useWidgetFormStore());

            act(() => {
                result.current.setWidgetTitleError('Titre requis');
            });

            expect(result.current.widgetTitleError).toBe('Titre requis');
        });

        it('devrait gérer la visibilité', () => {
            const { result } = renderHook(() => useWidgetFormStore());

            act(() => {
                result.current.setVisibility('public');
            });

            expect(result.current.visibility).toBe('public');
        });
    });

    describe('Drag and drop state', () => {
        it('devrait gérer draggedMetric', () => {
            const { result } = renderHook(() => useWidgetFormStore());

            act(() => {
                result.current.setDraggedMetric(2);
            });

            expect(result.current.draggedMetric).toBe(2);

            act(() => {
                result.current.setDraggedMetric(null);
            });

            expect(result.current.draggedMetric).toBeNull();
        });
    });

    describe('Form lifecycle', () => {
        it('devrait initialiser le formulaire avec des valeurs partielles', () => {
            const { result } = renderHook(() => useWidgetFormStore());

            act(() => {
                result.current.initializeForm({
                    type: 'pie',
                    sourceId: 'source-456',
                    columns: ['col1', 'col2']
                });
            });

            expect(result.current.type).toBe('pie');
            expect(result.current.sourceId).toBe('source-456');
            expect(result.current.columns).toEqual(['col1', 'col2']);
            expect(result.current.tab).toBe('data');
        });

        it('devrait réinitialiser le formulaire', () => {
            const { result } = renderHook(() => useWidgetFormStore());

            act(() => {
                result.current.setType('line');
                result.current.setSourceId('source-789');
                result.current.setColumns(['a', 'b', 'c']);
                result.current.setConfig({ title: 'Test' });
            });

            act(() => {
                result.current.resetForm();
            });

            expect(result.current.type).toBe('bar');
            expect(result.current.sourceId).toBe('');
            expect(result.current.columns).toEqual([]);
            expect(result.current.config).toEqual({});
        });
    });

    describe('Loading and error states', () => {
        it('devrait gérer l\'état de chargement', () => {
            const { result } = renderHook(() => useWidgetFormStore());

            act(() => {
                result.current.setLoading(true);
            });

            expect(result.current.loading).toBe(true);
        });

        it('devrait gérer les erreurs', () => {
            const { result } = renderHook(() => useWidgetFormStore());

            act(() => {
                result.current.setError('Une erreur est survenue');
            });

            expect(result.current.error).toBe('Une erreur est survenue');
        });
    });
});
