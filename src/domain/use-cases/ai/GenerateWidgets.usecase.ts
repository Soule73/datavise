import type {
    IAIWidgetRepository,
    GenerateWidgetsPayload,
    GenerateWidgetsResult,
} from "../../ports/repositories/IAIWidgetRepository";

export class GenerateWidgetsUseCase {
    private aiWidgetRepository: IAIWidgetRepository;

    constructor(aiWidgetRepository: IAIWidgetRepository) {
        this.aiWidgetRepository = aiWidgetRepository;
    }

    async execute(payload: GenerateWidgetsPayload): Promise<GenerateWidgetsResult> {
        if (!payload.dataSourceId || payload.dataSourceId.trim().length === 0) {
            throw new Error("dataSourceId est requis pour générer des widgets");
        }

        if (!payload.conversationId || payload.conversationId.trim().length === 0) {
            throw new Error("conversationId est requis pour générer des widgets");
        }

        return await this.aiWidgetRepository.generateWidgets(payload);
    }
}
