// import { useState, useEffect } from "react";
// import { getSlotStyleUtil } from "@utils/dashboard/dashboardGridUtils";
// import type { DashboardLayoutItem } from "@/domain/value-objects";

// interface UseDashboardGridProps {
//     layout: DashboardLayoutItem[];
//     editMode: boolean;
//     hasUnsavedChanges: boolean;
//     onSwapLayout?: (newLayout: DashboardLayoutItem[]) => void;
// }

// export function useDashboardGrid({
//     layout,
//     editMode,
//     hasUnsavedChanges,
//     onSwapLayout,
// }: UseDashboardGridProps) {
//     const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
//     const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
//     const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

//     const slots = [...layout, null];

//     function getSlotStyle() {
//         return getSlotStyleUtil(isMobile);
//     }

//     const [, setDummyState] = useState(0);
//     useEffect(() => {
//         const handleResize = () => setDummyState((v) => v + 1);
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     const handleDragStart = (idx: number, e?: React.DragEvent) => {
//         setDraggedIdx(idx);
//         if (e) {
//             e.dataTransfer.effectAllowed = 'move';
//             e.dataTransfer.setData('text/plain', idx.toString());
//         }
//     };

//     const handleDragOver = (idx: number, e?: React.DragEvent) => {
//         if (e) {
//             e.preventDefault();
//             e.dataTransfer.dropEffect = 'move';
//         }
//         setHoveredIdx(idx);
//     };

//     const handleDragEnd = () => {
//         setDraggedIdx(null);
//         setHoveredIdx(null);
//     };

//     const handleDrop = (slotIdx: number, e?: React.DragEvent) => {
//         if (e) {
//             e.preventDefault();
//         }

//         if (draggedIdx === null || draggedIdx === slotIdx) {
//             setDraggedIdx(null);
//             setHoveredIdx(null);
//             return;
//         }

//         if (draggedIdx === -1 || slotIdx === -1 || draggedIdx >= layout.length || slotIdx >= layout.length) {
//             setDraggedIdx(null);
//             setHoveredIdx(null);
//             return;
//         }

//         const newLayout = layout.map((item) => ({ ...item }));
//         const temp = { ...newLayout[draggedIdx] };
//         newLayout[draggedIdx] = { ...newLayout[slotIdx] };
//         newLayout[slotIdx] = temp;

//         if (onSwapLayout) {
//             onSwapLayout(newLayout);
//         }

//         setDraggedIdx(null);
//         setHoveredIdx(null);
//     };

//     const handleRemove = (idx: number) => {
//         const newLayout = layout
//             .filter((_, lidx) => lidx !== idx)
//             .map((item) => ({ ...item }));
//         if (onSwapLayout) onSwapLayout(newLayout);
//     };

//     useEffect(() => {
//         if (!editMode || !hasUnsavedChanges) return;
//         const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//             e.preventDefault();
//         };
//         window.addEventListener("beforeunload", handleBeforeUnload);
//         return () => {
//             window.removeEventListener("beforeunload", handleBeforeUnload);
//         };
//     }, [editMode, hasUnsavedChanges]);

//     return {
//         draggedIdx,
//         hoveredIdx,
//         isMobile,
//         slots,
//         getSlotStyle,
//         handleDragStart,
//         handleDragOver,
//         handleDragEnd,
//         handleDrop,
//         handleRemove,
//     };
// }
