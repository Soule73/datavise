import type {
    IAIConversationRepository,
    CreateConversationPayload,
    AddMessagePayload,
    UpdateTitlePayload,
    RefineWidgetsPayload,
} from "@/domain/ports/repositories/IAIConversationRepository";
import type { AIConversation } from "@/domain/entities/AIConversation.entity";
import type { Widget } from "@/domain/entities/Widget.entity";
import { aiConversationMapper } from "../mappers/aiConversationMapper";
import { AI_CONVERSATION_ENDPOINTS, AI_WIDGET_ENDPOINTS } from "../api/endpoints/ai.endpoints";
import { apiClient } from "../api/client/apiClient";
import type { AIConversationDTO } from "../api/dto/AIConversationDTO";
import type { WidgetDTO } from "../api/dto/WidgetDTO";
import { widgetMapper } from "../mappers/widgetMapper";

export class AIConversationRepository implements IAIConversationRepository {
    async findAll(): Promise<AIConversation[]> {
        const response = await apiClient.get<AIConversationDTO[]>(
            AI_CONVERSATION_ENDPOINTS.list
        );

        if (!response.success || !response.data) {
            throw new Error(response.error?.message || "Erreur lors de la récupération des conversations");
        }

        return response.data.map((dto) => aiConversationMapper.toDomain(dto));
    }

    async findById(conversationId: string): Promise<AIConversation | null> {
        try {
            const response = await apiClient.get<AIConversationDTO>(
                AI_CONVERSATION_ENDPOINTS.byId(conversationId)
            );

            if (!response.success || !response.data) {
                return null;
            }

            return aiConversationMapper.toDomain(response.data);
        } catch (error: unknown) {
            const err = error as { response?: { status?: number } };
            if (err.response?.status === 404) {
                return null;
            }
            throw error;
        }
    }

    async getConversationWidgets(conversationId: string): Promise<Widget[]> {
        try {
            const response = await apiClient.get<AIConversationDTO>(
                AI_CONVERSATION_ENDPOINTS.byId(conversationId)
            );

            if (!response.success || !response.data) {
                return [];
            }

            return aiConversationMapper.extractWidgets(response.data);
        } catch (error: unknown) {
            const err = error as { response?: { status?: number } };
            if (err.response?.status === 404) {
                return [];
            }
            throw error;
        }
    }

    async create(payload: CreateConversationPayload): Promise<AIConversation> {
        const response = await apiClient.post<AIConversationDTO>(
            AI_CONVERSATION_ENDPOINTS.create,
            payload
        );

        if (!response.success || !response.data) {
            throw new Error(response.error?.message || "Erreur lors de la création de la conversation");
        }

        return aiConversationMapper.toDomain(response.data);
    }

    async addMessage(conversationId: string, message: AddMessagePayload): Promise<AIConversation> {
        const response = await apiClient.post<AIConversationDTO>(
            AI_CONVERSATION_ENDPOINTS.addMessage(conversationId),
            message
        );

        if (!response.success || !response.data) {
            throw new Error(response.error?.message || "Erreur lors de l'ajout du message");
        }

        return aiConversationMapper.toDomain(response.data);
    }

    async updateTitle(conversationId: string, payload: UpdateTitlePayload): Promise<AIConversation> {
        const response = await apiClient.patch<AIConversationDTO>(
            AI_CONVERSATION_ENDPOINTS.updateTitle(conversationId),
            { title: payload.title }
        );

        if (!response.success || !response.data) {
            throw new Error(response.error?.message || "Erreur lors de la mise à jour du titre");
        }

        return aiConversationMapper.toDomain(response.data);
    }

    async delete(conversationId: string): Promise<void> {
        const response = await apiClient.delete(
            AI_CONVERSATION_ENDPOINTS.delete(conversationId)
        );

        if (!response.success) {
            throw new Error(response.error?.message || "Erreur lors de la suppression de la conversation");
        }
    }

    async refineWidgets(payload: RefineWidgetsPayload): Promise<Widget[]> {
        const response = await apiClient.post<WidgetDTO[]>(
            AI_WIDGET_ENDPOINTS.refine,
            payload
        );

        if (!response.success || !response.data) {
            throw new Error(response.error?.message || "Erreur lors du raffinement des widgets en base");
        }

        return response.data.map((dto) => widgetMapper.toDomain(dto));
    }
}
