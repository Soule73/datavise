import type { IWidgetRepository } from "@domain/ports/repositories/IWidgetRepository";
import { Widget } from "@domain/entities/Widget.entity";

export class GetWidgetUseCase {
    private widgetRepository: IWidgetRepository;

    constructor(widgetRepository: IWidgetRepository) {
        this.widgetRepository = widgetRepository;
    }

    async execute(widgetId: string): Promise<Widget | null> {
        return this.widgetRepository.findById(widgetId);
    }
}
