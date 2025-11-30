import { AIConversationNotFoundError } from "../../errors/DomainError";
import type {
    IAIConversationRepository,
    AddMessagePayload,
} from "../../ports/repositories/IAIConversationRepository";
import type { AIConversation } from "../../entities/AIConversation.entity";

export class AddMessageUseCase {
    private conversationRepository: IAIConversationRepository;

    constructor(conversationRepository: IAIConversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    async execute(conversationId: string, message: AddMessagePayload): Promise<AIConversation> {
        if (!conversationId || conversationId.trim().length === 0) {
            throw new Error("conversationId est requis pour ajouter un message");
        }

        if (!message.content || message.content.trim().length === 0) {
            throw new Error("Le contenu du message ne peut pas être vide");
        }

        const existingConversation = await this.conversationRepository.findById(conversationId);
        if (!existingConversation) {
            throw new AIConversationNotFoundError(conversationId);
        }

        return await this.conversationRepository.addMessage(conversationId, message);
    }
}
