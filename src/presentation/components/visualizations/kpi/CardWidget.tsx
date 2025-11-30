import { useCardWidgetVM } from "@/application/hooks/visualizations/kpi/useCardWidgetVM";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { InvalideConfigWidget, NoDataWidget } from "@/presentation/pages/widget/components/states";
import type { CardWidgetProps } from "@/application/hooks/visualizations/kpi/useCardWidgetVM";

export default function CardWidget({
  data,
  config,
}: CardWidgetProps) {
  const {
    formattedValue,
    title,
    description,
    iconColor,
    valueColor,
    descriptionColor,
    showIcon,
    IconComponent,
  } = useCardWidgetVM({ data, config });

  if (
    !data ||
    !config.metrics ||
    !Array.isArray(config.metrics) ||
    !config.metrics[0]
  ) {
    return <InvalideConfigWidget />;
  }
  if (data.length === 0) {
    return (
      <NoDataWidget
        icon={
          <ChartBarIcon className="w-12 h-12 stroke-gray-300 dark:stroke-gray-700" />
        }
      />
    );
  }


  return (
    <div className="flex flex-col h-full shadow items-center justify-center  max-h-full bg-white dark:bg-gray-900 w-full max-w-full rounded-lg ">
      {showIcon && IconComponent && (
        <span className="mb-2">
          <IconComponent className="w-8 h-8" style={{ color: iconColor }} />
        </span>
      )}
      <span className="text-2xl font-bold">{title}</span>
      <span
        className="text-3xl font-extrabold mt-1"
        style={{ color: valueColor }}
      >
        {formattedValue}
      </span>
      {description && (
        <span className="text-xs mt-1" style={{ color: descriptionColor }}>
          {description}
        </span>
      )}
    </div>
  );
}
