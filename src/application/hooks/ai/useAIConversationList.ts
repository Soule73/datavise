import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ListConversationsUseCase } from "@/domain/use-cases/ai/ListConversations.usecase";
import { AIConversationRepository } from "@/infrastructure/repositories/AIConversationRepository";
import type { AIConversation } from "@/domain/entities/AIConversation.entity";

const conversationRepository = new AIConversationRepository();
const listConversationsUseCase = new ListConversationsUseCase(conversationRepository);

export function useAIConversationList() {
    const queryClient = useQueryClient();

    const { data: conversations, isLoading, error } = useQuery<AIConversation[]>({
        queryKey: ["ai-conversations"],
        queryFn: () => listConversationsUseCase.execute(),
        staleTime: 1000 * 60 * 5,
    });

    const refetch = () => {
        queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
    };

    return {
        conversations: conversations ?? [],
        isLoading,
        error,
        refetch,
    };
}
