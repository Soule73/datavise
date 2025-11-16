import BaseFilterConfig from "@components/widgets/BaseFilterConfig";
import type { Filter } from "@/domain/value-objects";

export interface DatasetFiltersConfigProps {
    filters: Filter[];
    columns: string[];
    data?: Record<string, any>[];
    onFiltersChange: (filters: Filter[]) => void;
    datasetIndex: number;
}

export default function DatasetFiltersConfig({
    filters = [],
    columns,
    data = [],
    onFiltersChange,
    datasetIndex,
}: DatasetFiltersConfigProps) {
    const createNewFilter = (cols: string[]): Filter => ({
        field: cols[0] || '',
        value: '',
        operator: 'equals',
    });

    return (
        <BaseFilterConfig
            filters={filters}
            columns={columns}
            data={data}
            onFiltersChange={onFiltersChange}
            title={`Filtres Dataset ${datasetIndex + 1}`}
            description="Aucun filtre configuré pour ce dataset. Les filtres de dataset s'appliquent uniquement à ce dataset spécifique."
            createNewFilter={createNewFilter}
            prefix={`filter-${datasetIndex}`}
            className="mt-3"
        />
    );
}
