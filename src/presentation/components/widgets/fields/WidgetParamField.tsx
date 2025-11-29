import ColorField from "@/presentation/components/shared/forms/ColorField";
import InputField from "@/presentation/components/shared/forms/InputField";
import CheckboxField from "@/presentation/components/shared/forms/CheckboxField";
import SelectField from "@/presentation/components/shared/SelectField";
import * as HeroIcons from "@heroicons/react/24/outline";

interface WidgetParamFieldMeta {
    label?: string;
    default?: any;
    inputType?: "color" | "number" | "text" | "select" | "checkbox";
    options?: { value: string; label: string }[];
}

interface WidgetParamFieldProps {
    field: string;
    meta: WidgetParamFieldMeta;
    value: any;
    onChange: (value: any) => void;
}

const getIconComponent = (iconName: string) => {
    if (iconName && HeroIcons[iconName as keyof typeof HeroIcons]) {
        return HeroIcons[iconName as keyof typeof HeroIcons]({
            className: "w-6 h-6 text-indigo-500",
        });
    }
    return null;
};

export default function WidgetParamField({
    field,
    meta,
    value,
    onChange,
}: WidgetParamFieldProps) {
    const label = meta.label || field;
    const defaultValue = meta.default;
    const currentValue = value ?? defaultValue;
    const inputType = meta.inputType;
    const options = meta.options || [];

    if (inputType === "color") {
        return (
            <ColorField
                label={label}
                value={currentValue || "#2563eb"}
                onChange={onChange}
                name={`widget-param-${field}`}
                id={`widget-param-${field}`}
            />
        );
    }

    if (inputType === "checkbox" || field === "showIcon") {
        const fallback = field === "showIcon" ? true : false;
        return (
            <CheckboxField
                label={label}
                checked={currentValue ?? fallback}
                onChange={onChange}
                name={`widget-param-${field}`}
                id={`widget-param-${field}`}
            />
        );
    }

    if (inputType === "number") {
        return (
            <InputField
                label={label}
                type="number"
                value={currentValue ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChange(Number(e.target.value))
                }
                name={`widget-param-${field}`}
                id={`widget-param-${field}`}
            />
        );
    }

    if (inputType === "select" && field !== "title") {
        if (field === "icon" && options.length > 0) {
            return (
                <div className="flex flex-col gap-1">
                    <SelectField
                        label={label}
                        value={currentValue || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            onChange(e.target.value)
                        }
                        name={`widget-param-${field}`}
                        id={`widget-param-${field}`}
                        options={options}
                    />
                    {currentValue && getIconComponent(currentValue) && (
                        <div className="mt-1 flex items-center gap-2">
                            {getIconComponent(currentValue)}
                            <span className="text-xs text-gray-500">
                                {currentValue}
                            </span>
                        </div>
                    )}
                </div>
            );
        }

        if (options.length > 0) {
            return (
                <SelectField
                    label={label}
                    value={currentValue || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onChange(e.target.value)
                    }
                    name={`widget-param-${field}`}
                    id={`widget-param-${field}`}
                    options={options}
                />
            );
        }
    }

    return (
        <InputField
            label={label}
            value={currentValue ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange(e.target.value)
            }
            name={`widget-param-${field}`}
            id={`widget-param-${field}`}
        />
    );
}
