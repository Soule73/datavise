import SelectField from "@components/SelectField";
import CheckboxField from "@components/forms/CheckboxField";
import type { DatasetFieldConfig } from "@/core/config/visualizations";
import { useColumnOptions } from "@hooks/widget/useColumnOptions";

interface GenericDatasetFieldProps {
    fieldConfig: DatasetFieldConfig;
    dataset: any;
    datasetIndex: number;
    columns: string[];
    onUpdate: (updated: any) => void;
    axisFields?: string[];
}

export default function GenericDatasetField({
    fieldConfig,
    dataset,
    datasetIndex,
    columns,
    onUpdate,
    axisFields,
}: GenericDatasetFieldProps) {
    const columnOptions = useColumnOptions(columns);
    const { key, label, type } = fieldConfig;

    if (type === "select") {
        return (
            <SelectField
                label={label}
                value={dataset[key] || ""}
                onChange={(e) => onUpdate({ ...dataset, [key]: e.target.value })}
                options={columnOptions}
                name={`dataset-${key}-${datasetIndex}`}
                id={`dataset-${key}-${datasetIndex}`}
            />
        );
    }

    if (type === "multiSelect" && axisFields) {
        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
                <div className="grid md:grid-cols-2 gap-2 lg:grid-cols-3">
                    {axisFields.map((field: string, colIdx: number) => (
                        <CheckboxField
                            key={colIdx}
                            label={field}
                            checked={Array.isArray(dataset[key]) && dataset[key].includes(field)}
                            onChange={(checked: boolean) => {
                                const currentFields = Array.isArray(dataset[key]) ? [...dataset[key]] : [];
                                const newFields = checked
                                    ? [...currentFields, field]
                                    : currentFields.filter((f: string) => f !== field);
                                onUpdate({ ...dataset, [key]: newFields });
                            }}
                            name={`dataset-${key}-${datasetIndex}-${field}`}
                            id={`dataset-${key}-${datasetIndex}-${field}`}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return null;
}
