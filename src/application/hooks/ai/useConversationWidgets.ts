import { useQuery } from "@tanstack/react-query";
import { AIConversationRepository } from "@/infrastructure/repositories/AIConversationRepository";
import { widgetMapper } from "@/infrastructure/mappers/widgetMapper";
import type { Widget } from "@/domain/entities/Widget.entity";
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

            const conversation = await conversationRepository.findById(conversationId);
            if (!conversation) return [];

            const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/ai/conversations/${conversationId}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) return [];

            const data = await response.json();
            if (data.success && data.data?.widgets) {
                return data.data.widgets.map((w: any) => widgetMapper.toDomain(w));
            }

            return [];
        },
        enabled: isValidObjectId(conversationId),
        staleTime: 1 * 60 * 1000,
    });
}
