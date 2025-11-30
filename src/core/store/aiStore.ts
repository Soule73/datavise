import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Widget } from "@/domain/entities/Widget.entity";
import type { AIConversation } from "@/domain/entities/AIConversation.entity";
import type { DataSource } from "@/domain/entities/DataSource.entity";

interface AIState {
    activeConversationId: string | null;
    activeConversation: AIConversation | null;
    conversations: AIConversation[];
    dataSources: DataSource[];
    generatedWidgets: Widget[];
    selectedSourceId: string;
    userPrompt: string;
    refinementPrompt: string;
    maxWidgets: number;
    isSidebarOpen: boolean;
    isLoading: boolean;
    error: string | null;
    suggestions: string[];
    widgetToDelete: { id: string; title: string; _id?: string } | null;
}

interface AIActions {
    setActiveConversationId: (id: string | null) => void;
    setActiveConversation: (conversation: AIConversation | null) => void;
    setConversations: (conversations: AIConversation[]) => void;
    setDataSources: (sources: DataSource[]) => void;
    setGeneratedWidgets: (widgets: Widget[]) => void;
    addWidget: (widget: Widget) => void;
    removeWidget: (widgetId: string) => void;
    updateWidget: (widgetId: string, updates: Partial<Widget>) => void;
    setSelectedSourceId: (id: string) => void;
    setUserPrompt: (prompt: string) => void;
    setRefinementPrompt: (prompt: string) => void;
    setMaxWidgets: (max: number) => void;
    setIsSidebarOpen: (isOpen: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    setSuggestions: (suggestions: string[]) => void;
    setWidgetToDelete: (widget: { id: string; title: string; _id?: string } | null) => void;
    resetState: () => void;
}

type AIStore = AIState & AIActions;

const initialState: AIState = {
    activeConversationId: null,
    activeConversation: null,
    conversations: [],
    dataSources: [],
    generatedWidgets: [],
    selectedSourceId: "",
    userPrompt: "",
    refinementPrompt: "",
    maxWidgets: 5,
    isSidebarOpen: false,
    isLoading: false,
    error: null,
    suggestions: [],
    widgetToDelete: null,
};

export const useAIStore = create<AIStore>()(
    persist(
        (set) => ({
            ...initialState,

            setActiveConversationId: (id) =>
                set({ activeConversationId: id }),

            setActiveConversation: (conversation) =>
                set({ activeConversation: conversation }),

            setConversations: (conversations) =>
                set({ conversations }),

            setDataSources: (dataSources) =>
                set({ dataSources }),

            setGeneratedWidgets: (widgets) =>
                set({ generatedWidgets: widgets }),

            addWidget: (widget) =>
                set((state) => ({
                    generatedWidgets: [...state.generatedWidgets, widget],
                })),

            removeWidget: (widgetId) =>
                set((state) => ({
                    generatedWidgets: state.generatedWidgets.filter(
                        (w) => w.widgetId !== widgetId && w.id !== widgetId
                    ),
                })),

            updateWidget: (widgetId, updates) =>
                set((state) => ({
                    generatedWidgets: state.generatedWidgets.map((w) =>
                        w.widgetId === widgetId || w.id === widgetId ? w.clone(updates) : w
                    ),
                })),

            setSelectedSourceId: (id) => set({ selectedSourceId: id }),

            setUserPrompt: (prompt) => set({ userPrompt: prompt }),

            setRefinementPrompt: (prompt) => set({ refinementPrompt: prompt }),

            setMaxWidgets: (max) => set({ maxWidgets: max }),

            setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

            setIsLoading: (isLoading) => set({ isLoading }),

            setError: (error) => set({ error }),

            setSuggestions: (suggestions) => set({ suggestions }),

            setWidgetToDelete: (widgetToDelete) => set({ widgetToDelete }),

            resetState: () => set({
                activeConversationId: null,
                activeConversation: null,
                generatedWidgets: [],
                userPrompt: "",
                refinementPrompt: "",
                error: null,
                suggestions: [],
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
