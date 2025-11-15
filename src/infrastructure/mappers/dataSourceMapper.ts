import { DataSource } from "@/domain/entities/DataSource.entity";
import type { DataSourceDTO, DetectColumnsResponseDTO } from "../api/dto/DataSourceDTO";
import type { DetectionResult, ColumnMetadata } from "@/domain/value-objects/ColumnMetadata.vo";
import { createConnectionConfig } from "@/domain/value-objects/ConnectionConfig.vo";

export const dataSourceMapper = {
    toDomain(dto: DataSourceDTO): DataSource {
        const connectionConfig = createConnectionConfig({
            httpMethod: dto.httpMethod as "GET" | "POST" | undefined,
            authType: dto.authType as "none" | "basic" | "bearer" | "apiKey" | undefined,
            authConfig: dto.authConfig,
            esIndex: dto.esIndex,
            esQuery: dto.esQuery,
        });

        return new DataSource(
            dto._id,
            dto.name,
            dto.type,
            dto.visibility,
            dto.ownerId,
            dto.endpoint,
            dto.filePath,
            connectionConfig,
            dto.timestampField,
            dto.config,
            dto.createdAt ? new Date(dto.createdAt) : undefined,
            dto.updatedAt ? new Date(dto.updatedAt) : undefined,
            dto.isUsed
        );
    },

    toDTO(dataSource: DataSource): Partial<DataSourceDTO> {
        return {
            _id: dataSource.id,
            name: dataSource.name,
            type: dataSource.type,
            visibility: dataSource.visibility,
            ownerId: dataSource.ownerId,
            endpoint: dataSource.endpoint,
            filePath: dataSource.filePath,
            httpMethod: dataSource.connectionConfig?.httpMethod,
            authType: dataSource.connectionConfig?.authType,
            authConfig: dataSource.connectionConfig?.authConfig,
            timestampField: dataSource.timestampField,
            esIndex: dataSource.connectionConfig?.esIndex,
            esQuery: dataSource.connectionConfig?.esQuery,
            config: dataSource.config,
        };
    },

    partialToDTO(partial: Partial<DataSource>): Partial<DataSourceDTO> {
        const dto: Partial<DataSourceDTO> = {};

        if (partial.name !== undefined) dto.name = partial.name;
        if (partial.type !== undefined) dto.type = partial.type;
        if (partial.visibility !== undefined) dto.visibility = partial.visibility;
        if (partial.endpoint !== undefined) dto.endpoint = partial.endpoint;
        if (partial.filePath !== undefined) dto.filePath = partial.filePath;
        if (partial.timestampField !== undefined) dto.timestampField = partial.timestampField;
        if (partial.config !== undefined) dto.config = partial.config;

        if (partial.connectionConfig) {
            if (partial.connectionConfig.httpMethod !== undefined)
                dto.httpMethod = partial.connectionConfig.httpMethod;
            if (partial.connectionConfig.authType !== undefined)
                dto.authType = partial.connectionConfig.authType;
            if (partial.connectionConfig.authConfig !== undefined)
                dto.authConfig = partial.connectionConfig.authConfig;
            if (partial.connectionConfig.esIndex !== undefined)
                dto.esIndex = partial.connectionConfig.esIndex;
            if (partial.connectionConfig.esQuery !== undefined)
                dto.esQuery = partial.connectionConfig.esQuery;
        }

        return dto;
    },

    detectionResultToDomain(dto: DetectColumnsResponseDTO): DetectionResult {
        const columns: ColumnMetadata[] = dto.columns.map((colName) => ({
            name: colName,
            type: dto.types?.[colName] as ColumnMetadata["type"] || "unknown",
        }));

        return {
            columns,
            preview: dto.preview,
        };
    },
};
