import type { IAIConversationRepository } from "@domain/ports/repositories/IAIConversationRepository";
import type { AIConversation } from "@domain/entities/AIConversation.entity";

export class GetConversationUseCase {
    private conversationRepository: IAIConversationRepository;

    constructor(conversationRepository: IAIConversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    async execute(conversationId: string): Promise<AIConversation | null> {
        return await this.conversationRepository.findById(conversationId);
    }
}
