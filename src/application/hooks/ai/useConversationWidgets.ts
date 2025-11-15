import { useQuery } from "@tanstack/react-query";
import { WidgetRepository } from "@/infrastructure/repositories/WidgetRepository";
import type { Widget } from "@/domain/entities/Widget.entity";
import { isValidObjectId } from "@utils/validation";

const widgetRepository = new WidgetRepository();

export const widgetKeys = {
    all: ["widgets"] as const,
    conversation: (id: string) => [...widgetKeys.all, "conversation", id] as const,
};

export function useConversationWidgets(conversationId: string | null) {
    return useQuery<Widget[]>({
        queryKey: widgetKeys.conversation(conversationId!),
        queryFn: () => conversationId ? widgetRepository.findByConversation(conversationId!) : [],
        enabled: isValidObjectId(conversationId),
        staleTime: 1 * 60 * 1000,
    });
}
