import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchConversationWidgets, publishWidget } from "@services/widget";
import { useNotificationStore } from "@store/notification";
import { isValidObjectId } from "@utils/validation";

export const widgetKeys = {
    all: ["widgets"] as const,
    conversation: (id: string) => [...widgetKeys.all, "conversation", id] as const,
};

export function useConversationWidgetsQuery(conversationId: string | null) {
    return useQuery({
        queryKey: widgetKeys.conversation(conversationId!),
        queryFn: () => fetchConversationWidgets(conversationId!),
        enabled: isValidObjectId(conversationId),
        staleTime: 1 * 60 * 1000,
    });
}

export function usePublishWidgetMutation() {
    const queryClient = useQueryClient();
    const { showNotification } = useNotificationStore();

    return useMutation({
        mutationFn: publishWidget,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: widgetKeys.all,
            });
            showNotification({
                open: true,
                type: "success",
                title: "Widget publié",
            });
        },
        onError: () => {
            showNotification({
                open: true,
                type: "error",
                title: "Erreur publication",
            });
        },
    });
}

export function usePublishAllWidgetsMutation() {
    const queryClient = useQueryClient();
    const { showNotification } = useNotificationStore();

    return useMutation({
        mutationFn: async (widgetIds: string[]) => {
            await Promise.all(widgetIds.map((id) => publishWidget(id)));
            return widgetIds;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: widgetKeys.all,
            });
            showNotification({
                open: true,
                type: "success",
                title: "Tous les widgets publiés",
            });
        },
        onError: () => {
            showNotification({
                open: true,
                type: "error",
                title: "Erreur publication",
            });
        },
    });
}
