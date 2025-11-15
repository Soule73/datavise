import type { Widget } from "../../entities/Widget.entity";
import type { Pagination } from "../../value-objects/Pagination.vo";

export interface WidgetFilters {
    conversationId?: string;
    isDraft?: boolean;
    search?: string;
}

export interface IWidgetRepository {
    findAll(filters?: WidgetFilters, pagination?: Pagination): Promise<Widget[]>;
    findById(id: string): Promise<Widget | null>;
    create(widget: Omit<Widget, "id" | "createdAt" | "updatedAt">): Promise<Widget>;
    update(id: string, updates: Partial<Widget>): Promise<Widget>;
    delete(id: string): Promise<void>;
    findByConversation(conversationId: string): Promise<Widget[]>;
}
