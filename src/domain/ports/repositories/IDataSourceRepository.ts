import type { DataSource } from "../../entities/DataSource.entity";
import type { DetectionResult } from "../../value-objects/ColumnMetadata.vo";
import type { DataSourceType } from "@type/dataSource";

export interface DataSourceFilters {
    type?: DataSourceType;
    visibility?: "public" | "private";
    search?: string;
}

export interface DetectColumnsParams {
    type: DataSourceType;
    csvOrigin?: "url" | "upload";
    csvFile?: File | null;
    endpoint?: string;
    httpMethod?: string;
    authType?: string;
    file?: File;
    authConfig?: Record<string, unknown>;
    esIndex?: string;
    esQuery?: string;
}

export interface IDataSourceRepository {
    findAll(filters?: DataSourceFilters): Promise<DataSource[]>;
    findById(id: string): Promise<DataSource | null>;
    create(dataSource: Omit<DataSource, "id" | "ownerId" | "createdAt" | "updatedAt">, file?: File): Promise<DataSource>;
    update(id: string, updates: Partial<DataSource>): Promise<DataSource>;
    delete(id: string): Promise<void>;
    detectColumns(params: DetectColumnsParams): Promise<DetectionResult>;
    fetchData(sourceId: string, options?: {
        from?: string;
        to?: string;
        page?: number;
        pageSize?: number;
        fields?: string[];
        forceRefresh?: boolean;
        shareId?: string;
    }): Promise<Record<string, unknown>[]>;
}
