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
        if (!payload.dataSourceId || payload.dataSourceId.trim().length === 0) {
            throw new Error("dataSourceId est requis pour raffiner des widgets");
        }

        if (!payload.refinementPrompt || payload.refinementPrompt.trim().length === 0) {
            throw new Error("refinementPrompt est requis pour raffiner des widgets");
        }

        if (!payload.currentWidgets || payload.currentWidgets.length === 0) {
            throw new Error("Au moins un widget est requis pour le raffinement");
        }

        return await this.aiWidgetRepository.refineWidgets(payload);
    }
}
