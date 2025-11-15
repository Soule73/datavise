import { AIConversationNotFoundError } from "../../errors/DomainError";
import type { IAIConversationRepository } from "../../ports/repositories/IAIConversationRepository";

export class DeleteConversationUseCase {
    private conversationRepository: IAIConversationRepository;

    constructor(conversationRepository: IAIConversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    async execute(conversationId: string): Promise<void> {
        if (!conversationId || conversationId.trim().length === 0) {
            throw new Error("conversationId est requis pour supprimer une conversation");
        }

        const existingConversation = await this.conversationRepository.findById(conversationId);
        if (!existingConversation) {
            throw new AIConversationNotFoundError(conversationId);
        }

        await this.conversationRepository.delete(conversationId);
    }
}
