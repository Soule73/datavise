import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AIGeneratedWidget } from "@type/aiTypes";

interface AIState {
    activeConversationId: string | null;
    generatedWidgets: AIGeneratedWidget[];
    selectedSourceId: string;
    userPrompt: string;
    refinementPrompt: string;
    maxWidgets: number;
    isSidebarOpen: boolean;
}

interface AIActions {
    setActiveConversationId: (id: string | null) => void;
    setGeneratedWidgets: (widgets: AIGeneratedWidget[]) => void;
    addWidget: (widget: AIGeneratedWidget) => void;
    removeWidget: (widgetId: string) => void;
    updateWidget: (widgetId: string, updates: Partial<AIGeneratedWidget>) => void;
    setSelectedSourceId: (id: string) => void;
    setUserPrompt: (prompt: string) => void;
    setRefinementPrompt: (prompt: string) => void;
    setMaxWidgets: (max: number) => void;
    setIsSidebarOpen: (isOpen: boolean) => void;
    resetState: () => void;
}

type AIStore = AIState & AIActions;

const initialState: AIState = {
    activeConversationId: null,
    generatedWidgets: [],
    selectedSourceId: "",
    userPrompt: "",
    refinementPrompt: "",
    maxWidgets: 5,
    isSidebarOpen: false,
};

export const useAIStore = create<AIStore>()(
    persist(
        (set) => ({
            ...initialState,

            setActiveConversationId: (id) =>
                set({ activeConversationId: id }),

            setGeneratedWidgets: (widgets) =>
                set({ generatedWidgets: widgets }),

            addWidget: (widget) =>
                set((state) => ({
                    generatedWidgets: [...state.generatedWidgets, widget],
                })),

            removeWidget: (widgetId) =>
                set((state) => ({
                    generatedWidgets: state.generatedWidgets.filter(
                        (w) => w.id !== widgetId
                    ),
                })),

            updateWidget: (widgetId, updates) =>
                set((state) => ({
                    generatedWidgets: state.generatedWidgets.map((w) =>
                        w.id === widgetId ? { ...w, ...updates } : w
                    ),
                })),

            setSelectedSourceId: (id) => set({ selectedSourceId: id }),

            setUserPrompt: (prompt) => set({ userPrompt: prompt }),

            setRefinementPrompt: (prompt) => set({ refinementPrompt: prompt }),

            setMaxWidgets: (max) => set({ maxWidgets: max }),

            setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

            resetState: () => set({ 
                generatedWidgets: [],
                userPrompt: "",
                refinementPrompt: "",
            }),
        }),
        {
            name: "ai-builder-storage",
            partialize: (state) => ({
                activeConversationId: state.activeConversationId,
                selectedSourceId: state.selectedSourceId,
                maxWidgets: state.maxWidgets,
            }),
        }
    )
);
