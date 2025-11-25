import InputField from "@components/forms/InputField";



export interface MetricLabelInputProps {
    value: string;
    onChange: (value: string) => void;
    name: string;
    id: string;
}

export default function MetricLabelInput({
    value,
    onChange,
    name,
    id,
}: MetricLabelInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <InputField
            label="Label"
            value={value || ""}
            onChange={handleChange}
            name={name}
            id={id}
        />
    );
}
