import { useQuery } from "@tanstack/react-query";
import { GetConversationUseCase } from "@/domain/use-cases/ai/GetConversation.usecase";
import { AIConversationRepository } from "@/infrastructure/repositories/AIConversationRepository";
import type { AIConversation } from "@/domain/entities/AIConversation.entity";

const conversationRepository = new AIConversationRepository();
const getConversationUseCase = new GetConversationUseCase(conversationRepository);

export const conversationKeys = {
    all: ["ai-conversations"] as const,
    detail: (id: string) => ["ai-conversation", id] as const,
};

export function useAIConversation(conversationId: string | null) {
    return useQuery<AIConversation | null>({
        queryKey: conversationKeys.detail(conversationId!),
        queryFn: () => conversationId ? getConversationUseCase.execute(conversationId) : null,
        enabled: !!conversationId,
        staleTime: 1000 * 60 * 5,
    });
}
