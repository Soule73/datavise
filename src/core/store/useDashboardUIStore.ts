import { create } from "zustand";

interface DashboardUIState {
    editMode: boolean;
    saving: boolean;
    selectOpen: boolean;
    saveModalOpen: boolean;
    exportPDFModalOpen: boolean;
    pendingTitle: string;

    setEditMode: (editMode: boolean) => void;
    setSaving: (saving: boolean) => void;
    setSelectOpen: (open: boolean) => void;
    setSaveModalOpen: (open: boolean) => void;
    setExportPDFModalOpen: (open: boolean) => void;
    setPendingTitle: (title: string) => void;

    resetUI: () => void;
}

const initialState = {
    editMode: false,
    saving: false,
    selectOpen: false,
    saveModalOpen: false,
    exportPDFModalOpen: false,
    pendingTitle: "",
};

export const useDashboardUIStore = create<DashboardUIState>((set) => ({
    ...initialState,

    setEditMode: (editMode) => set({ editMode }),
    setSaving: (saving) => set({ saving }),
    setSelectOpen: (selectOpen) => set({ selectOpen }),
    setSaveModalOpen: (saveModalOpen) => set({ saveModalOpen }),
    setExportPDFModalOpen: (exportPDFModalOpen) => set({ exportPDFModalOpen }),
    setPendingTitle: (pendingTitle) => set({ pendingTitle }),

    resetUI: () => set(initialState),
}));
