import { create } from "zustand";

interface DashboardShareState {
    shareId: string | null;
    isEnabling: boolean;
    isDisabling: boolean;
    shareError: string | null;

    setShareId: (shareId: string | null) => void;
    setIsEnabling: (loading: boolean) => void;
    setIsDisabling: (loading: boolean) => void;
    setShareError: (error: string | null) => void;

    getShareLink: (origin: string) => string | null;

    resetShare: () => void;
}

const initialState = {
    shareId: null,
    isEnabling: false,
    isDisabling: false,
    shareError: null,
};

export const useDashboardShareStore = create<DashboardShareState>((set, get) => ({
    ...initialState,

    setShareId: (shareId) => set({ shareId }),
    setIsEnabling: (isEnabling) => set({ isEnabling }),
    setIsDisabling: (isDisabling) => set({ isDisabling }),
    setShareError: (shareError) => set({ shareError }),

    getShareLink: (origin) => {
        const { shareId } = get();
        return shareId ? `${origin}/share/${shareId}` : null;
    },

    resetShare: () => set(initialState),
}));
