import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateConversationUseCase } from "@/domain/use-cases/ai/CreateConversation.usecase";
import { AddMessageUseCase } from "@/domain/use-cases/ai/AddMessage.usecase";
import { UpdateConversationTitleUseCase } from "@/domain/use-cases/ai/UpdateConversationTitle.usecase";
import { DeleteConversationUseCase } from "@/domain/use-cases/ai/DeleteConversation.usecase";
import { AIConversationRepository } from "@/infrastructure/repositories/AIConversationRepository";
import type { CreateConversationPayload, AddMessagePayload, UpdateTitlePayload } from "@/domain/ports/repositories/IAIConversationRepository";
import { useNotificationStore } from "@store/notification";

const conversationRepository = new AIConversationRepository();
const createConversationUseCase = new CreateConversationUseCase(conversationRepository);
const addMessageUseCase = new AddMessageUseCase(conversationRepository);
const updateTitleUseCase = new UpdateConversationTitleUseCase(conversationRepository);
const deleteConversationUseCase = new DeleteConversationUseCase(conversationRepository);

export function useAIConversationActions() {
    const { showNotification } = useNotificationStore();
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (payload: CreateConversationPayload) => createConversationUseCase.execute(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
            showNotification({
                open: true,
                type: "success",
                title: "Conversation créée avec succès",
            });
        },
        onError: (error: Error) => {
            showNotification({
                open: true,
                type: "error",
                title: error.message || "Erreur création conversation",
            });
        },
    });

    const addMessageMutation = useMutation({
        mutationFn: ({ conversationId, message }: { conversationId: string; message: AddMessagePayload }) =>
            addMessageUseCase.execute(conversationId, message),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["ai-conversation", variables.conversationId] });
        },
        onError: (error: Error) => {
            showNotification({
                open: true,
                type: "error",
                title: error.message || "Erreur ajout message",
            });
        },
    });

    const updateTitleMutation = useMutation({
        mutationFn: ({ conversationId, payload }: { conversationId: string; payload: UpdateTitlePayload }) =>
            updateTitleUseCase.execute(conversationId, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["ai-conversation", variables.conversationId] });
            queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
            showNotification({
                open: true,
                type: "success",
                title: "Titre mis à jour",
            });
        },
        onError: (error: Error) => {
            showNotification({
                open: true,
                type: "error",
                title: error.message || "Erreur mise à jour titre",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (conversationId: string) => deleteConversationUseCase.execute(conversationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
            showNotification({
                open: true,
                type: "success",
                title: "Conversation supprimée",
            });
        },
        onError: (error: Error) => {
            showNotification({
                open: true,
                type: "error",
                title: error.message || "Erreur suppression",
            });
        },
    });

    return {
        createConversation: createMutation.mutate,
        createConversationAsync: createMutation.mutateAsync,
        isCreating: createMutation.isPending,

        addMessage: addMessageMutation.mutate,
        addMessageAsync: addMessageMutation.mutateAsync,
        isAddingMessage: addMessageMutation.isPending,

        updateTitle: updateTitleMutation.mutate,
        isUpdatingTitle: updateTitleMutation.isPending,

        deleteConversation: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
}
