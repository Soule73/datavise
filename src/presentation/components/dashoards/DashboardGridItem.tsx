import { useMemo } from "react";
import type { DataSource } from "@/domain/entities/DataSource.entity";
import type { Widget } from "@/domain/entities/Widget.entity";
import type { DashboardLayoutItem } from "@/domain/value-objects";
import { TrashIcon, Bars3Icon, PencilIcon } from "@heroicons/react/24/outline";
import { WIDGETS } from "@/core/config/visualizations";
import { useDashboardDataStore } from "@/core/store/useDashboardDataStore";
import { Link } from "react-router-dom";
import { ROUTES } from "@constants/routes";

interface DashboardGridItemProps {
  item: DashboardLayoutItem;
  widget: Widget;
  editMode?: boolean;
  sources?: DataSource[];
  onRemove?: () => void;
}

export default function DashboardGridItem({
  widget,
  editMode,
  sources,
  onRemove,
}: DashboardGridItemProps) {
  const { getSourceData, isSourceLoading, getSourceError } = useDashboardDataStore();

  if (!widget) {
    return (
      <div className="relative h-full w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="h-full flex items-center justify-center text-center text-red-500 text-sm p-4">
          Widget non trouvé
        </div>
      </div>
    );
  }

  const widgetData = widget.dataSourceId ? getSourceData(widget.dataSourceId) : [];
  const loading = widget.dataSourceId ? isSourceLoading(widget.dataSourceId) : false;
  const error = widget.dataSourceId ? getSourceError(widget.dataSourceId) : null;

  const source = sources?.find(
    (s: DataSource) => String(s.id) === String(widget?.dataSourceId)
  );

  const config = useMemo(() => widget?.config || {}, [widget?.config]);

  const widgetDef = WIDGETS[widget.type as keyof typeof WIDGETS];
  const WidgetComponent = widgetDef?.component;

  const isRefreshing = loading && widgetData.length > 0;

  const dataError: string = !source
    ? "Source de données introuvable."
    : error
      ? String(error)
      : !loading && (!widgetData || !widgetData.length)
        ? "Aucune donnée disponible pour cette source."
        : "";

  return (
    <div className="relative h-full w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {editMode && (
        <div className="absolute top-2 left-2 right-2 z-10 flex justify-between items-center gap-2">
          <div className="drag-handle cursor-move p-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded shadow-lg transition-colors">
            <Bars3Icon className="w-4 h-4" />
          </div>
          <div className="flex gap-2">
            {widget && (
              <Link
                to={ROUTES.editWidget.replace(":id", widget.id)}
                className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded shadow-lg transition-colors"
                title="Éditer le widget"
              >
                <PencilIcon className="w-4 h-4" />
              </Link>
            )}
            {onRemove && (
              <button
                onClick={onRemove}
                className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded shadow-lg transition-colors"
                title="Supprimer le widget"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {dataError ? (
        <div className="h-full flex items-center justify-center text-center text-red-500 text-sm p-4">
          {dataError}
        </div>
      ) : loading && !widgetData.length ? (
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : !WidgetComponent ? (
        <div className="h-full flex items-center justify-center text-red-500 text-sm">
          Type de widget inconnu : {widget?.type}
        </div>
      ) : (
        <div className="relative h-full">
          {isRefreshing && (
            <div className="absolute top-2 right-2 z-10">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600" />
            </div>
          )}
          <WidgetComponent data={widgetData} config={config} />
        </div>
      )}
    </div>
  );
}
