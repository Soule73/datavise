import BaseFilterConfig from "@components/widgets/BaseFilterConfig";
import type { Filter } from "@/domain/value-objects";

export interface GlobalFiltersConfigProps {
    filters: Filter[];
    columns: string[];
    data?: Record<string, any>[];
    onFiltersChange: (filters: Filter[]) => void;
}

export default function GlobalFiltersConfig({
    filters = [],
    columns,
    data = [],
    onFiltersChange,
}: GlobalFiltersConfigProps) {

    const createNewFilter = (cols: string[]): Filter => ({
        field: cols[0] || '',
        operator: 'equals',
        value: '',
    });

    return (
        <BaseFilterConfig
            filters={filters}
            columns={columns}
            data={data}
            onFiltersChange={onFiltersChange}
            title="Filtres globaux"
            description="Aucun filtre global configuré. Les filtres globaux s'appliquent à tous les datasets."
            createNewFilter={createNewFilter}
            prefix="global-filter"
        />
    );
}
