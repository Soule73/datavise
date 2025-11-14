import { useState, useCallback } from "react";
import { aiConversationApi } from "@services/aiConversation";
import type {
    AIConversation,
    CreateConversationRequest,
    AddMessageRequest,
} from "@type/aiConversationTypes";
import type { ApiResponse } from "@type/api";
import { useNotificationStore } from "@store/notification";

function extractData<T>(response: ApiResponse<T>): T {
    if (response.success && "data" in response) {
        return response.data;
    }
    const error = response as any;
    throw new Error(error.error?.message || "Erreur inconnue");
}

interface UseAIConversationState {
    conversations: AIConversation[];
    activeConversation: AIConversation | null;
    isLoading: boolean;
    error: string | null;
}

export function useAIConversation() {
    const { showNotification } = useNotificationStore();

    const [state, setState] = useState<UseAIConversationState>({
        conversations: [],
        activeConversation: null,
        isLoading: false,
        error: null,
    });

    const loadConversations = useCallback(async () => {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await aiConversationApi.getConversations();
            const conversations = extractData(response);
            setState((prev) => ({ ...prev, conversations, isLoading: false }));
        } catch (error: any) {
            setState((prev) => ({ ...prev, error: error.message, isLoading: false }));
        }
    }, []);

    const loadConversation = useCallback(async (conversationId: string) => {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await aiConversationApi.getConversationById(conversationId);
            const conversation = extractData(response);
            setState((prev) => ({ ...prev, activeConversation: conversation, isLoading: false }));
            return conversation;
        } catch (error: any) {
            setState((prev) => ({ ...prev, error: error.message, isLoading: false }));
            throw error;
        }
    }, []);

    const createConversation = useCallback(async (data: CreateConversationRequest) => {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await aiConversationApi.createConversation(data);
            const newConversation = extractData(response);
            setState((prev) => ({
                ...prev,
                conversations: [newConversation, ...prev.conversations],
                activeConversation: newConversation,
                isLoading: false,
            }));
            showNotification({ open: true, type: "success", title: "Conversation créée" });
            return newConversation;
        } catch (error: any) {
            setState((prev) => ({ ...prev, error: error.message, isLoading: false }));
            showNotification({ open: true, type: "error", title: "Erreur création" });
            throw error;
        }
    }, [showNotification]);

    const addMessage = useCallback(async (data: Omit<AddMessageRequest, "conversationId">) => {
        if (!state.activeConversation) return;
        try {
            const response = await aiConversationApi.addMessage({
                conversationId: state.activeConversation._id,
                ...data,
            });
            const updatedConversation = extractData(response);
            setState((prev) => ({ ...prev, activeConversation: updatedConversation }));
        } catch (error: any) {
            console.error("[useAIConversation] Erreur message:", error);
        }
    }, [state.activeConversation]);

    const updateTitle = useCallback(async (title: string) => {
        if (!state.activeConversation) return;
        try {
            const response = await aiConversationApi.updateTitle({
                conversationId: state.activeConversation._id,
                title,
            });
            const updatedConversation = extractData(response);
            setState((prev) => ({
                ...prev,
                activeConversation: updatedConversation,
                conversations: prev.conversations.map((c) =>
                    c._id === updatedConversation._id ? updatedConversation : c
                ),
            }));
            showNotification({ open: true, type: "success", title: "Titre mis à jour" });
        } catch (error: any) {
            console.error("[useAIConversation] Erreur titre:", error);
        }
    }, [state.activeConversation, showNotification]);

    const deleteConversation = useCallback(async (conversationId: string) => {
        try {
            const response = await aiConversationApi.deleteConversation(conversationId);
            extractData(response);
            setState((prev) => ({
                ...prev,
                conversations: prev.conversations.filter((c) => c._id !== conversationId),
                activeConversation: prev.activeConversation?._id === conversationId ? null : prev.activeConversation,
            }));
            showNotification({ open: true, type: "success", title: "Conversation supprimée" });
        } catch (error: any) {
            showNotification({ open: true, type: "error", title: "Erreur suppression" });
        }
    }, [showNotification]);

    const setActiveConversation = useCallback((conversation: AIConversation | null) => {
        setState((prev) => ({ ...prev, activeConversation: conversation }));
    }, []);

    return {
        ...state,
        loadConversations,
        loadConversation,
        createConversation,
        addMessage,
        updateTitle,
        deleteConversation,
        setActiveConversation,
    };
}
