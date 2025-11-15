import type { IWidgetRepository, WidgetFilters } from "@domain/ports/repositories/IWidgetRepository";
import { Widget } from "@domain/entities/Widget.entity";
import type { Pagination } from "@domain/value-objects/Pagination.vo";
import { apiClient } from "../api/client/apiClient";
import { widgetMapper } from "../mappers/widgetMapper";
import { WIDGET_ENDPOINTS } from "../api/endpoints/widget.endpoints";
import type { WidgetDTO } from "../api/dto/WidgetDTO";

export class WidgetRepository implements IWidgetRepository {
    async findAll(filters?: WidgetFilters, pagination?: Pagination): Promise<Widget[]> {
        const params = new URLSearchParams();

        if (filters?.conversationId) {
            params.append("conversationId", filters.conversationId);
        }
        if (filters?.isDraft !== undefined) {
            params.append("isDraft", String(filters.isDraft));
        }
        if (filters?.search) {
            params.append("search", filters.search);
        }
        if (pagination) {
            params.append("page", String(pagination.page));
            params.append("limit", String(pagination.limit));
        }

        const queryString = params.toString();
        const url = queryString ? `${WIDGET_ENDPOINTS.list}?${queryString}` : WIDGET_ENDPOINTS.list;
        const response = await apiClient.get<WidgetDTO[]>(url);

        if (!response.success || !response.data) {
            throw new Error(response.error?.message || "Erreur lors de la récupération des widgets");
        }

        return response.data.map(widgetMapper.toDomain);
    }

    async findById(id: string): Promise<Widget | null> {
        try {
            const response = await apiClient.get<WidgetDTO>(WIDGET_ENDPOINTS.byId(id));

            if (!response.success || !response.data) {
                return null;
            }

            return widgetMapper.toDomain(response.data);
        } catch {
            return null;
        }
    }

    async create(widgetData: Omit<Widget, "id" | "createdAt" | "updatedAt">): Promise<Widget> {
        const dto = widgetMapper.toDTO(widgetData as Widget);
        const response = await apiClient.post<WidgetDTO>(WIDGET_ENDPOINTS.create, dto);

        if (!response.success || !response.data) {
            throw new Error(response.error?.message || "Erreur lors de la création du widget");
        }

        return widgetMapper.toDomain(response.data);
    }

    async update(id: string, updates: Partial<Widget>): Promise<Widget> {
        const dto = widgetMapper.partialToDTO(updates);
        const response = await apiClient.patch<WidgetDTO>(WIDGET_ENDPOINTS.update(id), dto);

        if (!response.success || !response.data) {
            throw new Error(response.error?.message || "Erreur lors de la mise à jour du widget");
        }

        return widgetMapper.toDomain(response.data);
    }

    async delete(id: string): Promise<void> {
        const response = await apiClient.delete(WIDGET_ENDPOINTS.delete(id));

        if (!response.success) {
            throw new Error(response.error?.message || "Erreur lors de la suppression du widget");
        }
    }

    async findByConversation(conversationId: string): Promise<Widget[]> {
        return this.findAll({ conversationId });
    }
}
