import { useMemo } from "react";
import { SelectField } from "@datavise/ui";
import MetricLabelInput from "./MetricLabelInput";
import { CollapsibleSection } from "../sections";

export interface MetricConfigItemProps {
    metric: any;
    index: number;
    allowedAggs: Array<{ value: string; label: string }>;
    columns: string[];
    canMoveUp: boolean;
    canMoveDown: boolean;
    canDelete: boolean;
    onMetricChange: (idx: number, field: string, value: any) => void;
    onDelete?: (idx: number) => void;
    onMoveUp?: (idx: number) => void;
    onMoveDown?: (idx: number) => void;
}

export default function MetricConfigItem({
    metric,
    index,
    allowedAggs,
    columns,
    canMoveUp,
    canMoveDown,
    canDelete,
    onMetricChange,
    onDelete,
    onMoveUp,
    onMoveDown,
}: MetricConfigItemProps) {
    const headerLabel = useMemo(() => {
        const aggLabel =
            allowedAggs.find((a) => a.value === metric.agg)?.label || metric.agg || "";
        const fieldLabel = metric.field || "";
        return `${aggLabel}${fieldLabel ? " · " + fieldLabel : ""}`;
    }, [metric.agg, metric.field, allowedAggs]);

    const columnOptions = useMemo(
        () => columns.map((col) => ({ value: col, label: col })),
        [columns]
    );

    return (
        <CollapsibleSection
            title={headerLabel}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            onDelete={canDelete && onDelete ? () => onDelete(index) : undefined}
            onMoveUp={onMoveUp ? () => onMoveUp(index) : undefined}
            onMoveDown={onMoveDown ? () => onMoveDown(index) : undefined}
        >
            <div className="flex flex-col gap-2 mt-2">
                <SelectField
                    label="Agrégation"
                    value={metric.agg}
                    onChange={(e) => onMetricChange(index, "agg", e.target.value)}
                    options={allowedAggs}
                    name={`metric-agg-${index}`}
                    id={`metric-agg-${index}`}
                />
                <SelectField
                    label="Champ"
                    value={metric.field}
                    onChange={(e) => onMetricChange(index, "field", e.target.value)}
                    options={columnOptions}
                    name={`metric-field-${index}`}
                    id={`metric-field-${index}`}
                />
                <MetricLabelInput
                    value={metric.label || ""}
                    onChange={(val) => onMetricChange(index, "label", val)}
                    name={`metric-label-${index}`}
                    id={`metric-label-${index}`}
                />
            </div>
        </CollapsibleSection>
    );
}
