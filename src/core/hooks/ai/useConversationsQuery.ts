import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiConversationApi } from "@services/aiConversation";
import type {
    AIConversation,
    CreateConversationRequest,
    UpdateTitleRequest,
} from "@type/aiConversationTypes";
import type { ApiResponse } from "@type/api";
import { useNotificationStore } from "@store/notification";

function extractData<T>(response: ApiResponse<T>): T {
    if ('data' in response && response.data) {
        return response.data;
    }
    throw new Error("Invalid response format");
}

export const conversationKeys = {
    all: ["conversations"] as const,
    lists: () => [...conversationKeys.all, "list"] as const,
    list: () => [...conversationKeys.lists()] as const,
    details: () => [...conversationKeys.all, "detail"] as const,
    detail: (id: string) => [...conversationKeys.details(), id] as const,
};

export function useConversationsQuery() {
    return useQuery({
        queryKey: conversationKeys.list(),
        queryFn: async () => {
            const response = await aiConversationApi.getConversations();
            return extractData(response);
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}

export function useConversationQuery(conversationId: string | null) {
    return useQuery({
        queryKey: conversationKeys.detail(conversationId!),
        queryFn: async () => {
            const response = await aiConversationApi.getConversationById(conversationId!);
            return extractData(response);
        },
        enabled: !!conversationId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

export function useCreateConversationMutation() {
    const queryClient = useQueryClient();
    const { showNotification } = useNotificationStore();

    return useMutation({
        mutationFn: async (data: CreateConversationRequest) => {
            const response = await aiConversationApi.createConversation(data);
            return extractData(response);
        },
        onSuccess: (newConversation) => {
            queryClient.setQueryData<AIConversation[]>(
                conversationKeys.list(),
                (old) => [newConversation, ...(old || [])]
            );
            showNotification({
                open: true,
                type: "success",
                title: "Conversation créée",
            });
        },
        onError: () => {
            showNotification({
                open: true,
                type: "error",
                title: "Erreur création",
            });
        },
    });
}

export function useUpdateConversationTitleMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateTitleRequest) => {
            const response = await aiConversationApi.updateTitle(data);
            return extractData(response);
        },
        onSuccess: (updatedConversation) => {
            queryClient.setQueryData<AIConversation[]>(
                conversationKeys.list(),
                (old) =>
                    old?.map((c) =>
                        c._id === updatedConversation._id ? updatedConversation : c
                    ) || []
            );
            queryClient.setQueryData(
                conversationKeys.detail(updatedConversation._id),
                updatedConversation
            );
        },
    });
}

export function useDeleteConversationMutation() {
    const queryClient = useQueryClient();
    const { showNotification } = useNotificationStore();

    return useMutation({
        mutationFn: async (conversationId: string) => {
            await aiConversationApi.deleteConversation(conversationId);
            return conversationId;
        },
        onSuccess: (conversationId) => {
            queryClient.setQueryData<AIConversation[]>(
                conversationKeys.list(),
                (old) => old?.filter((c) => c._id !== conversationId) || []
            );
            queryClient.removeQueries({
                queryKey: conversationKeys.detail(conversationId),
            });
            showNotification({
                open: true,
                type: "success",
                title: "Conversation supprimée",
            });
        },
        onError: () => {
            showNotification({
                open: true,
                type: "error",
                title: "Erreur suppression",
            });
        },
    });
}
