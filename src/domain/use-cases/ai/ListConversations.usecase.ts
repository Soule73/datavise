import type { IAIConversationRepository } from "../../ports/repositories/IAIConversationRepository";
import type { AIConversation } from "../../entities/AIConversation.entity";

export class ListConversationsUseCase {
    private conversationRepository: IAIConversationRepository;

    constructor(conversationRepository: IAIConversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    async execute(): Promise<AIConversation[]> {
        return await this.conversationRepository.findAll();
    }
}
