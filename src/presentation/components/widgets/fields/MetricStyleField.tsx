import ColorField from "@/presentation/components/shared/forms/ColorField";
import InputField from "@/presentation/components/shared/forms/InputField";
import SelectField from "@/presentation/components/shared/SelectField";
import CheckboxField from "@/presentation/components/shared/forms/CheckboxField";
import Button from "@/presentation/components/shared/forms/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";

export interface MetricStyleFieldSchema {
    label?: string;
    default?: string | number | boolean | string[];
    inputType?: "color" | "number" | "text" | "color-array" | "select" | "checkbox";
    options?: { value: string; label: string }[];
}

interface MetricStyleFieldProps {
    field: string;
    meta: MetricStyleFieldSchema;
    metricIndex: number;
    value: any;
    onChange: (field: string, value: any) => void;
}

export default function MetricStyleField({
    field,
    meta,
    metricIndex,
    value,
    onChange,
}: MetricStyleFieldProps) {
    const label = meta.label || field;
    const defaultValue = meta.default;
    const currentValue = value ?? defaultValue;

    if (meta.inputType === "color-array" || field === "colors") {
        const colorArray = (currentValue || ["#2563eb"]) as string[];

        return (
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                    {label}
                </label>
                <div className="flex flex-wrap items-end gap-2">
                    {colorArray.map((color: string, colorIdx: number) => (
                        <div key={colorIdx} className="flex items-center gap-1">
                            <ColorField
                                value={color || "#2563eb"}
                                onChange={(val) => {
                                    const newArray = [...colorArray];
                                    newArray[colorIdx] = val;
                                    onChange(field, newArray);
                                }}
                                name={`metric-style-${metricIndex}-${field}-${colorIdx}`}
                                id={`metric-style-${metricIndex}-${field}-${colorIdx}`}
                            />
                            <button
                                type="button"
                                className="text-xs text-red-500 hover:underline"
                                onClick={() => {
                                    const newArray = [...colorArray];
                                    newArray.splice(colorIdx, 1);
                                    onChange(field, newArray.length > 0 ? newArray : ["#2563eb"]);
                                }}
                                title="Supprimer cette couleur"
                            >
                                <XMarkIcon className="w-5 h-5 inline-block" />
                            </button>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        type="button"
                        className="w-max text-xs h-max text-indigo-600 border border-indigo-300 rounded px-2 py-1 hover:bg-indigo-50"
                        onClick={() => {
                            const newArray = [...colorArray, "#2563eb"];
                            onChange(field, newArray);
                        }}
                    >
                        + Couleur
                    </Button>
                </div>
            </div>
        );
    }

    if (meta.inputType === "color" || field === "color" || field === "borderColor") {
        const fallbackColor = field === "borderColor" ? "#000000" : "#2563eb";
        return (
            <ColorField
                label={label}
                value={String(currentValue ?? fallbackColor)}
                onChange={(val) => onChange(field, val)}
                name={`metric-style-${metricIndex}-${field}`}
                id={`metric-style-${metricIndex}-${field}`}
            />
        );
    }

    if (meta.inputType === "number") {
        return (
            <InputField
                label={label}
                type="number"
                value={String(currentValue ?? "")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChange(field, Number(e.target.value))
                }
                name={`metric-style-${metricIndex}-${field}`}
                id={`metric-style-${metricIndex}-${field}`}
            />
        );
    }

    if (meta.inputType === "select" && meta.options) {
        return (
            <SelectField
                label={label}
                value={String(currentValue ?? "")}
                options={meta.options}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChange(field, e.target.value)
                }
                name={`metric-style-${metricIndex}-${field}`}
                id={`metric-style-${metricIndex}-${field}`}
            />
        );
    }

    if (meta.inputType === "checkbox") {
        return (
            <CheckboxField
                label={label}
                checked={Boolean(currentValue ?? false)}
                onChange={(checked) => onChange(field, checked)}
                name={`metric-style-${metricIndex}-${field}`}
                id={`metric-style-${metricIndex}-${field}`}
            />
        );
    }

    return null;
}
