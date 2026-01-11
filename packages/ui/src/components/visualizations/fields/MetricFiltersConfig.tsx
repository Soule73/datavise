import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import type { Filter } from "@domain/value-objects";
import { InputField, SelectField } from "@datavise/ui";

export const OPERATOR_OPTIONS = [
    { value: "equals", label: "Égal à" },
    { value: "not_equals", label: "Différent de" },
    { value: "contains", label: "Contient" },
    { value: "not_contains", label: "Ne contient pas" },
    { value: "greater_than", label: "Supérieur à" },
    { value: "less_than", label: "Inférieur à" },
    { value: "greater_equal", label: "Supérieur ou égal" },
    { value: "less_equal", label: "Inférieur ou égal" },
    { value: "starts_with", label: "Commence par" },
    { value: "ends_with", label: "Finit par" },
];

interface MetricFiltersConfigProps {
    filters: Filter[];
    columns: string[];
    data?: Record<string, any>[];
    onFiltersChange: (filters: Filter[]) => void;
    metricIndex: number;
}

export default function MetricFiltersConfig({
    filters = [],
    columns,
    data = [],
    onFiltersChange,
    metricIndex,
}: MetricFiltersConfigProps) {
    const handleAddFilter = () => {
        const newFilter: Filter = {
            field: columns[0] || '',
            operator: 'equals',
            value: '',
        };
        onFiltersChange([...filters, newFilter]);
    };

    const handleRemoveFilter = (index: number) => {
        const newFilters = filters.filter((_, i) => i !== index);
        onFiltersChange(newFilters);
    };

    const handleFilterChange = (index: number, field: keyof Filter, value: string | number) => {
        const newFilters = [...filters];
        newFilters[index] = { ...newFilters[index], [field]: value } as Filter;

        if (field === 'field' || field === 'operator') {
            newFilters[index] = { ...newFilters[index], value: '' } as Filter;
        }

        onFiltersChange(newFilters);
    };

    const getFieldValues = (fieldName: string) => {
        if (!fieldName || !data.length) {
            return [{ value: "", label: "-- Choisir --" }];
        }

        const uniqueValues = Array.from(
            new Set(
                data
                    .map((row) => row[fieldName])
                    .filter((v) => v !== undefined && v !== null && v !== "")
            )
        );

        return [
            { value: "", label: "- Toutes -" },
            ...uniqueValues.map((v) => ({ value: String(v), label: String(v) }))
        ];
    };

    return (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Filtres de cette métrique
                </span>
                <button
                    type="button"
                    onClick={handleAddFilter}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors"
                >
                    <PlusIcon className="w-3 h-3" />
                    Ajouter
                </button>
            </div>

            {filters.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    Aucun filtre. Cette métrique utilisera toutes les données.
                </p>
            ) : (
                <div className="space-y-2">
                    {filters.map((filter, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-2"
                        >
                            <div className="grid grid-cols-1 gap-2">
                                <SelectField
                                    label="Champ"
                                    textSize="sm"
                                    value={filter.field}
                                    onChange={(e) => handleFilterChange(index, 'field', e.target.value)}
                                    options={[
                                        { value: "", label: "-- Aucun --" },
                                        ...columns.map((col) => ({ value: col, label: col }))
                                    ]}
                                    name={`metric-${metricIndex}-filter-field-${index}`}
                                    id={`metric-${metricIndex}-filter-field-${index}`}
                                />

                                <SelectField
                                    label="Opérateur"
                                    textSize="sm"
                                    value={filter.operator || 'equals'}
                                    onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
                                    options={OPERATOR_OPTIONS}
                                    name={`metric-${metricIndex}-filter-operator-${index}`}
                                    id={`metric-${metricIndex}-filter-operator-${index}`}
                                    disabled={!filter.field}
                                />

                                {(filter.operator === 'equals' || !filter.operator) ? (
                                    <SelectField
                                        label="Valeur"
                                        textSize="sm"
                                        value={String(filter.value || "")}
                                        onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                                        options={getFieldValues(filter.field)}
                                        name={`metric-${metricIndex}-filter-value-${index}`}
                                        id={`metric-${metricIndex}-filter-value-${index}`}
                                        disabled={!filter.field}
                                    />
                                ) : (
                                    <InputField
                                        label="Valeur"
                                        textSize="sm"
                                        value={String(filter.value || "")}
                                        onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                                        name={`metric-${metricIndex}-filter-value-${index}`}
                                        id={`metric-${metricIndex}-filter-value-${index}`}
                                        disabled={!filter.field}
                                        placeholder="Saisir la valeur..."
                                    />
                                )}

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFilter(index)}
                                        className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                        title="Supprimer ce filtre"
                                    >
                                        <TrashIcon className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
