import { AIConversation } from "@/domain/entities/AIConversation.entity";
import { createAIMessage, type AIMessage } from "@/domain/value-objects/AIMessage.vo";
import { createDataSourceSummary } from "@/domain/value-objects/DataSourceSummary.vo";
import type { AIConversationDTO, AIMessageDTO } from "../api/dto/AIConversationDTO";

export const aiConversationMapper = {
    messageToDomain(dto: AIMessageDTO): AIMessage {
        return createAIMessage(
            dto.role,
            dto.content,
            dto.widgetsGenerated
        );
    },

    messageToDTO(message: AIMessage): AIMessageDTO {
        return {
            role: message.role,
            content: message.content,
            timestamp: message.timestamp,
            widgetsGenerated: message.widgetsGenerated,
        };
    },

    toDomain(dto: AIConversationDTO): AIConversation {
        const messages = dto.messages.map((m) => aiConversationMapper.messageToDomain(m));

        const widgetIds = dto.widgets?.map((w) => w._id || w.id) ?? [];

        const dataSourceId = typeof dto.dataSourceId === "string"
            ? dto.dataSourceId
            : dto.dataSourceId._id;

        const dataSourceSummary = dto.dataSourceSummary
            ? createDataSourceSummary(
                dto.dataSourceSummary.name,
                dto.dataSourceSummary.type,
                dto.dataSourceSummary.rowCount,
                dto.dataSourceSummary.columns
            )
            : undefined;

        return new AIConversation(
            dto._id,
            dto.userId,
            dataSourceId,
            dto.title,
            messages,
            widgetIds,
            dataSourceSummary,
            dto.suggestions,
            typeof dto.createdAt === "string" ? new Date(dto.createdAt) : dto.createdAt,
            typeof dto.updatedAt === "string" ? new Date(dto.updatedAt) : dto.updatedAt
        );
    },

    toDTO(conversation: AIConversation): Partial<AIConversationDTO> {
        return {
            _id: conversation.id,
            userId: conversation.userId,
            dataSourceId: conversation.dataSourceId,
            title: conversation.title,
            messages: conversation.messages.map((m) => aiConversationMapper.messageToDTO(m)),
            suggestions: conversation.suggestions,
        };
    },
};
