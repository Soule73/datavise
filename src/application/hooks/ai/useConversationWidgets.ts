import { useQuery } from "@tanstack/react-query";
import { AIConversationRepository } from "@/infrastructure/repositories/AIConversationRepository";
import type { Widget } from "@domain/entities/Widget.entity";
import { isValidObjectId } from "@utils/validation";

const conversationRepository = new AIConversationRepository();

export const widgetKeys = {
    all: ["widgets"] as const,
    conversation: (id: string) => [...widgetKeys.all, "conversation", id] as const,
};

export function useConversationWidgets(conversationId: string | null) {
    return useQuery<Widget[]>({
        queryKey: widgetKeys.conversation(conversationId!),
        queryFn: async () => {
            if (!conversationId) return [];

            return conversationRepository.getConversationWidgets(conversationId);
        },
        enabled: isValidObjectId(conversationId),
        staleTime: 1 * 60 * 1000,
    });
}
