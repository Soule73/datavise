import { AIConversationNotFoundError } from "../../errors/DomainError";
import type {
    IAIConversationRepository,
    UpdateTitlePayload,
} from "../../ports/repositories/IAIConversationRepository";
import type { AIConversation } from "../../entities/AIConversation.entity";

export class UpdateConversationTitleUseCase {
    private conversationRepository: IAIConversationRepository;

    constructor(conversationRepository: IAIConversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    async execute(conversationId: string, payload: UpdateTitlePayload): Promise<AIConversation> {
        if (!conversationId || conversationId.trim().length === 0) {
            throw new Error("conversationId est requis pour mettre à jour le titre");
        }

        if (!payload.title || payload.title.trim().length < 2) {
            throw new Error("Le titre doit contenir au moins 2 caractères");
        }

        const existingConversation = await this.conversationRepository.findById(conversationId);
        if (!existingConversation) {
            throw new AIConversationNotFoundError(conversationId);
        }

        return await this.conversationRepository.updateTitle(conversationId, payload);
    }
}
