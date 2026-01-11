import type {
    IAIWidgetRepository,
    RefineWidgetsPayload,
    GenerateWidgetsResult,
} from "../../ports/repositories/IAIWidgetRepository";

export class RefineWidgetsUseCase {
    private aiWidgetRepository: IAIWidgetRepository;

    constructor(aiWidgetRepository: IAIWidgetRepository) {
        this.aiWidgetRepository = aiWidgetRepository;
    }

    async execute(payload: RefineWidgetsPayload): Promise<GenerateWidgetsResult> {
        if (!payload.conversationId || payload.conversationId.trim().length === 0) {
            throw new Error("conversationId est requis pour raffiner des widgets");
        }

        if (!payload.refinementPrompt || payload.refinementPrompt.trim().length === 0) {
            throw new Error("refinementPrompt est requis pour raffiner des widgets");
        }

        return await this.aiWidgetRepository.refineWidgets(payload);
    }
}
