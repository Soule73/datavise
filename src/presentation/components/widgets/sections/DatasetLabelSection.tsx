import InputField from "@/presentation/components/shared/forms/InputField";
import { DatasetFiltersConfig } from "@components/widgets/sections";

interface DatasetLabelSectionProps {
    dataset: any;
    datasetIndex: number;
    onUpdate: (updated: any) => void;
    columns: string[];
    data: Record<string, any>[];
}

/**
 * Section réutilisable pour le label et les filtres d'un dataset
 * Élimine la duplication dans Bubble, Scatter et Radar
 */
export default function DatasetLabelSection({
    dataset,
    datasetIndex,
    onUpdate,
    columns,
    data,
}: DatasetLabelSectionProps) {
    return (
        <>
            <InputField
                label="Label du dataset"
                type="text"
                value={dataset.label || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onUpdate({ ...dataset, label: e.target.value })
                }
                name={`dataset-label-${datasetIndex}`}
                id={`dataset-label-${datasetIndex}`}
            />
            <DatasetFiltersConfig
                filters={dataset.datasetFilters || []}
                columns={columns}
                data={data}
                onFiltersChange={(filters) =>
                    onUpdate({ ...dataset, datasetFilters: filters })
                }
                datasetIndex={datasetIndex}
            />
        </>
    );
}
