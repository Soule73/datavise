import type {
    IAIConversationRepository,
    CreateConversationPayload,
} from "../../ports/repositories/IAIConversationRepository";
import type { AIConversation } from "../../entities/AIConversation.entity";

export class CreateConversationUseCase {
    private conversationRepository: IAIConversationRepository;

    constructor(conversationRepository: IAIConversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    async execute(payload: CreateConversationPayload): Promise<AIConversation> {
        if (!payload.dataSourceId || payload.dataSourceId.trim().length === 0) {
            throw new Error("dataSourceId est requis pour créer une conversation");
        }

        return await this.conversationRepository.create(payload);
    }
}
