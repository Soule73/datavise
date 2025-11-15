import type {
    IDataSourceRepository,
    DataSourceFilters,
    DetectColumnsParams,
} from "@/domain/ports/repositories/IDataSourceRepository";
import type { DataSource } from "@/domain/entities/DataSource.entity";
import type { DetectionResult } from "@/domain/value-objects/ColumnMetadata.vo";
import { apiClient } from "../api/client/apiClient";
import { dataSourceMapper } from "../mappers/dataSourceMapper";
import { DATASOURCE_ENDPOINTS } from "../api/endpoints/datasource.endpoints";

export class DataSourceRepository implements IDataSourceRepository {
    async findAll(filters?: DataSourceFilters): Promise<DataSource[]> {
        const params = new URLSearchParams();

        if (filters?.type) {
            params.append("type", filters.type);
        }
        if (filters?.visibility) {
            params.append("visibility", filters.visibility);
        }
        if (filters?.search) {
            params.append("search", filters.search);
        }

        const url = `${DATASOURCE_ENDPOINTS.list}${params.toString() ? `?${params}` : ""}`;
        const response = await apiClient.get<unknown[]>(url);

        if (!response.success) {
            throw new Error(response.error?.message || "Erreur lors de la récupération des sources");
        }

        return (response.data as any[]).map(dataSourceMapper.toDomain);
    }

    async findById(id: string): Promise<DataSource | null> {
        try {
            const response = await apiClient.get<unknown>(DATASOURCE_ENDPOINTS.byId(id));

            if (!response.success) {
                return null;
            }

            return dataSourceMapper.toDomain(response.data as any);
        } catch (error) {
            console.error("Erreur findById:", error);
            return null;
        }
    }

    async create(
        dataSource: Omit<DataSource, "id" | "ownerId" | "createdAt" | "updatedAt">,
        file?: File
    ): Promise<DataSource> {
        if (file) {
            const formData = new FormData();
            formData.append("name", dataSource.name);
            formData.append("type", dataSource.type);
            formData.append("visibility", dataSource.visibility);

            if (dataSource.endpoint) formData.append("endpoint", dataSource.endpoint);
            if (dataSource.connectionConfig?.httpMethod)
                formData.append("httpMethod", dataSource.connectionConfig.httpMethod);
            if (dataSource.connectionConfig?.authType)
                formData.append("authType", dataSource.connectionConfig.authType);
            if (dataSource.connectionConfig?.authConfig)
                formData.append("authConfig", JSON.stringify(dataSource.connectionConfig.authConfig));
            if (dataSource.timestampField)
                formData.append("timestampField", dataSource.timestampField);
            if (dataSource.connectionConfig?.esIndex)
                formData.append("esIndex", dataSource.connectionConfig.esIndex);
            if (dataSource.connectionConfig?.esQuery)
                formData.append("esQuery", JSON.stringify(dataSource.connectionConfig.esQuery));

            formData.append("file", file);

            const response = await apiClient.post<unknown>(DATASOURCE_ENDPOINTS.create, formData);

            if (!response.success) {
                throw new Error(response.error?.message || "Erreur lors de la création de la source");
            }

            return dataSourceMapper.toDomain(response.data as any);
        } else {
            const dto = dataSourceMapper.toDTO(dataSource as DataSource);
            const response = await apiClient.post<unknown>(DATASOURCE_ENDPOINTS.create, dto);

            if (!response.success) {
                throw new Error(response.error?.message || "Erreur lors de la création de la source");
            }

            return dataSourceMapper.toDomain(response.data as any);
        }
    }

    async update(id: string, updates: Partial<DataSource>): Promise<DataSource> {
        const dto = dataSourceMapper.partialToDTO(updates);
        const response = await apiClient.patch<unknown>(DATASOURCE_ENDPOINTS.update(id), dto);

        if (!response.success) {
            throw new Error(response.error?.message || "Erreur lors de la mise à jour de la source");
        }

        return dataSourceMapper.toDomain(response.data as any);
    }

    async delete(id: string): Promise<void> {
        const response = await apiClient.delete(DATASOURCE_ENDPOINTS.delete(id));

        if (!response.success) {
            throw new Error(response.error?.message || "Erreur lors de la suppression de la source");
        }
    }

    async detectColumns(params: DetectColumnsParams): Promise<DetectionResult> {
        if (params.file) {
            const formData = new FormData();
            formData.append("type", params.type);
            formData.append("file", params.file);

            const response = await apiClient.post<unknown>(DATASOURCE_ENDPOINTS.detectColumns, formData);

            if (!response.success) {
                throw new Error(response.error?.message || "Erreur lors de la détection des colonnes");
            }

            return dataSourceMapper.detectionResultToDomain(response.data as any);
        } else {
            const payload = {
                type: params.type,
                endpoint: params.endpoint,
                httpMethod: params.httpMethod,
                authType: params.authType,
                authConfig: params.authConfig,
                esIndex: params.esIndex,
                esQuery: params.esQuery,
            };

            const response = await apiClient.post<unknown>(DATASOURCE_ENDPOINTS.detectColumns, payload);

            if (!response.success) {
                throw new Error(response.error?.message || "Erreur lors de la détection des colonnes");
            }

            return dataSourceMapper.detectionResultToDomain(response.data as any);
        }
    }

    async fetchData(
        sourceId: string,
        options?: {
            from?: string;
            to?: string;
            page?: number;
            pageSize?: number;
            fields?: string[];
            forceRefresh?: boolean;
            shareId?: string;
        }
    ): Promise<Record<string, unknown>[]> {
        const params = new URLSearchParams();

        if (options?.from) params.append("from", options.from);
        if (options?.to) params.append("to", options.to);
        params.append("page", String(options?.page ?? 1));
        params.append("pageSize", String(options?.pageSize ?? 5000));
        if (options?.fields) params.append("fields", options.fields.join(","));
        if (options?.forceRefresh) params.append("forceRefresh", "1");
        if (options?.shareId) params.append("shareId", options.shareId);

        const url = `${DATASOURCE_ENDPOINTS.fetchData(sourceId)}?${params}`;
        const response = await apiClient.get<any>(url);

        if (!response.success) {
            throw new Error(response.error?.message || "Erreur lors de la récupération des données");
        }

        if (Array.isArray(response.data)) {
            return response.data as Record<string, unknown>[];
        } else if (response.data && Array.isArray(response.data.data)) {
            return response.data.data as Record<string, unknown>[];
        }

        return [];
    }
}
