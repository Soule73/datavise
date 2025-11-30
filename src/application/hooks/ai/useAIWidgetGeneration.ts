import { useMutation } from "@tanstack/react-query";
import { GenerateWidgetsUseCase } from "@domain/use-cases/ai/GenerateWidgets.usecase";
import { RefineWidgetsUseCase } from "@domain/use-cases/ai/RefineWidgets.usecase";
import { AIWidgetRepository } from "@/infrastructure/repositories/AIWidgetRepository";
import type { GenerateWidgetsPayload, RefineWidgetsPayload } from "@domain/ports/repositories/IAIWidgetRepository";
import { useNotificationStore } from "@stores/notification";

const aiWidgetRepository = new AIWidgetRepository();
const generateWidgetsUseCase = new GenerateWidgetsUseCase(aiWidgetRepository);
const refineWidgetsUseCase = new RefineWidgetsUseCase(aiWidgetRepository);

export function useAIWidgetGeneration() {
    const { showNotification } = useNotificationStore();

    const generateMutation = useMutation({
        mutationFn: (payload: GenerateWidgetsPayload) => generateWidgetsUseCase.execute(payload),
        onSuccess: (data) => {
            showNotification({
                open: true,
                type: "success",
                title: `${data.widgets.length} widgets générés avec succès`,
            });
        },
        onError: (error: Error) => {
            showNotification({
                open: true,
                type: "error",
                title: error.message || "Erreur lors de la génération",
            });
        },
    });

    const refineMutation = useMutation({
        mutationFn: (payload: RefineWidgetsPayload) => refineWidgetsUseCase.execute(payload),
        onSuccess: (data) => {
            showNotification({
                open: true,
                type: "success",
                title: `${data.widgets.length} widgets raffinés avec succès`,
            });
        },
        onError: (error: Error) => {
            showNotification({
                open: true,
                type: "error",
                title: error.message || "Erreur lors du raffinement",
            });
        },
    });

    return {
        generateWidgets: generateMutation.mutate,
        generateWidgetsAsync: generateMutation.mutateAsync,
        isGenerating: generateMutation.isPending,
        generationError: generateMutation.error,
        generationData: generateMutation.data,

        refineWidgets: refineMutation.mutate,
        refineWidgetsAsync: refineMutation.mutateAsync,
        isRefining: refineMutation.isPending,
        refineError: refineMutation.error,
        refineData: refineMutation.data,
    };
}
