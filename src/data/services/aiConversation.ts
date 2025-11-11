import axios from "axios";
import type {
    AIConversation,
    CreateConversationRequest,
    AddMessageRequest,
    UpdateTitleRequest,
    RefineWidgetsDbRequest,
} from "@type/aiConversationTypes";
import type { ApiResponse } from "@type/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7000/api";

/**
 * Service pour gérer les conversations AI Builder
 */
export const aiConversationApi = {
    /**
     * Crée une nouvelle conversation
     */
    async createConversation(
        data: CreateConversationRequest
    ): Promise<ApiResponse<AIConversation>> {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${API_URL}/ai-conversations`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            console.error("[aiConversationApi] Erreur création:", error);
            throw error;
        }
    },

    /**
     * Récupère toutes les conversations de l'utilisateur
     */
    async getConversations(): Promise<ApiResponse<AIConversation[]>> {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/ai-conversations`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            console.error("[aiConversationApi] Erreur récupération:", error);
            throw error;
        }
    },

    /**
     * Récupère une conversation spécifique avec widgets
     */
    async getConversationById(
        conversationId: string
    ): Promise<ApiResponse<AIConversation>> {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${API_URL}/ai-conversations/${conversationId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            console.error("[aiConversationApi] Erreur chargement:", error);
            throw error;
        }
    },

    /**
     * Ajoute un message à une conversation
     */
    async addMessage(
        data: AddMessageRequest
    ): Promise<ApiResponse<AIConversation>> {
        try {
            const token = localStorage.getItem("token");
            const { conversationId, ...messageData } = data;
            const response = await axios.post(
                `${API_URL}/ai-conversations/${conversationId}/messages`,
                messageData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            console.error("[aiConversationApi] Erreur ajout message:", error);
            throw error;
        }
    },

    /**
     * Met à jour le titre d'une conversation
     */
    async updateTitle(
        data: UpdateTitleRequest
    ): Promise<ApiResponse<AIConversation>> {
        try {
            const token = localStorage.getItem("token");
            const { conversationId, title } = data;
            const response = await axios.patch(
                `${API_URL}/ai-conversations/${conversationId}`,
                { title },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            console.error("[aiConversationApi] Erreur mise à jour titre:", error);
            throw error;
        }
    },

    /**
     * Supprime une conversation
     */
    async deleteConversation(
        conversationId: string
    ): Promise<ApiResponse<{ deletedId: string }>> {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(
                `${API_URL}/ai-conversations/${conversationId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            console.error("[aiConversationApi] Erreur suppression:", error);
            throw error;
        }
    },

    /**
     * Raffine des widgets sauvegardés dans MongoDB
     */
    async refineWidgetsDb(
        data: RefineWidgetsDbRequest
    ): Promise<ApiResponse<any>> {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${API_URL}/ai/refine-widgets-db`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            console.error(
                "[aiConversationApi] Erreur raffinement widgets DB:",
                error
            );
            throw error;
        }
    },
};
