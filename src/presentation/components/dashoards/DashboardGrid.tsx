import { useMemo, useState, useEffect, useRef } from "react";
import GridLayout from "react-grid-layout";
import type { DataSource } from "@/domain/entities/DataSource.entity";
import type { DashboardLayoutItem } from "@/domain/value-objects";
import { PlusIcon } from "@heroicons/react/24/outline";
import DashboardGridItem from "@components/dashoards/DashboardGridItem";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

interface DashboardGridProps {
  layout: DashboardLayoutItem[];
  onSwapLayout?: (newLayout: DashboardLayoutItem[]) => void;
  sources: DataSource[];
  editMode?: boolean;
  hasUnsavedChanges?: boolean;
  handleAddWidget: (e: React.MouseEvent) => void;
}

export default function DashboardGrid({
  layout,
  onSwapLayout,
  sources,
  editMode = false,
  handleAddWidget,
}: DashboardGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        setIsMobile(window.innerWidth < 768);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [editMode]);

  const gridLayout = useMemo(() => {
    return layout.map((item, index) => ({
      i: item.widgetId,
      x: isMobile ? 0 : (item.x || 0),
      y: isMobile ? index * 4 : (item.y || 0),
      w: isMobile ? 12 : (item.w || 6),
      h: item.h || 4,
      minW: isMobile ? 12 : 2,
      minH: 2,
      static: isMobile,
    }));
  }, [layout, isMobile]);

  const handleLayoutChange = (newLayout: GridLayout.Layout[]) => {
    if (!onSwapLayout || !editMode) return;

    const updatedLayout = layout.map((item) => {
      const gridItem = newLayout.find((l) => l.i === item.widgetId);
      if (!gridItem) return item;

      return {
        ...item,
        i: item.widgetId,
        x: gridItem.x,
        y: gridItem.y,
        w: gridItem.w,
        h: gridItem.h,
      };
    });

    onSwapLayout(updatedLayout);
  };

  const handleRemove = (widgetId: string) => {
    if (!onSwapLayout) return;
    const newLayout = layout.filter((item) => item.widgetId !== widgetId);
    onSwapLayout(newLayout);
  };

  return (
    <div ref={containerRef} className="dashboard-grid-container w-full">
      <GridLayout
        className={`layout ${editMode ? "edit-mode" : ""}`}
        layout={gridLayout}
        cols={12}
        rowHeight={60}
        width={containerWidth}
        isDraggable={editMode && !isMobile}
        isResizable={editMode && !isMobile}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        compactType="vertical"
        preventCollision={false}
        margin={[8, 8]}
      >
        {layout.map((item) => {
          if (!item.widget) {
            return null;
          }

          return (
            <div key={item.widgetId} className="grid-item">
              <DashboardGridItem
                item={item}
                widget={item.widget}
                editMode={editMode}
                sources={sources}
                onRemove={editMode ? () => handleRemove(item.widgetId) : undefined}
              />
            </div>
          );
        })}
      </GridLayout>

      {editMode && (
        <div
          className="mt-4 p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 cursor-pointer transition-all duration-200 group max-w-sm h-32"
          onClick={handleAddWidget}
        >
          <div className="flex flex-col items-center gap-2">
            <PlusIcon className="w-8 h-8 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            <span className="text-sm font-medium group-hover:text-indigo-600">Ajouter un widget</span>
          </div>
        </div>
      )}
    </div>
  );
}
