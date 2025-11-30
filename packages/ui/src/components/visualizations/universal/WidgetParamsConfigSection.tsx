import { WIDGETS, WIDGET_CONFIG_FIELDS } from "@/core/config/visualizations";
import type { WidgetType } from "@domain/value-objects";
import WidgetParamField from "../fields/WidgetParamField";

export interface WidgetParamsConfigSectionProps<TConfig = any> {
  type: WidgetType;
  config: TConfig;
  handleConfigChange: (field: string, value: any) => void;
}

export default function WidgetParamsConfigSection({
  type,
  config,
  handleConfigChange,
}: WidgetParamsConfigSectionProps) {
  const widgetDef = WIDGETS[type];

  if (!widgetDef?.configSchema?.widgetParams) {
    return null;
  }

  const getFieldMeta = (field: string) => {
    const widgetParams = widgetDef.configSchema?.widgetParams as Record<string, any> | undefined;
    const paramMeta = widgetParams?.[field] || {};
    const globalMeta = WIDGET_CONFIG_FIELDS[field] || {};

    return {
      label: paramMeta.label || globalMeta.label || field,
      default: paramMeta.default ?? globalMeta.default,
      inputType: paramMeta.inputType || globalMeta.inputType,
      options: paramMeta.options || globalMeta.options || [],
    };
  };

  const handleFieldChange = (field: string, value: any) => {
    handleConfigChange("widgetParams", {
      ...config.widgetParams,
      [field]: value,
    });
  };

  return (
    <div className="space-y-2 grid grid-cols-2 place-items-stretch items-end gap-2">
      {Object.keys(widgetDef.configSchema.widgetParams).map((field) => (
        <WidgetParamField
          key={field}
          field={field}
          meta={getFieldMeta(field)}
          value={config.widgetParams?.[field]}
          onChange={(value) => handleFieldChange(field, value)}
        />
      ))}
    </div>
  );
}
