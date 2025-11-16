import type { DataSourceType } from "../value-objects/DataSourceType";
import type { DataSourceVisibility } from "../value-objects/datasource/DataSourceVisibility";
import { DataSourceValidationError } from "../errors/DomainError";
import type { ConnectionConfig } from "../value-objects/datasource/ConnectionConfig.vo";

/**
 * Entité DataSource représentant une source de données dans le domaine
 */
export class DataSource {
    readonly id: string;
    readonly name: string;
    readonly type: DataSourceType;
    readonly visibility: DataSourceVisibility;
    readonly ownerId: string;
    readonly endpoint?: string;
    readonly filePath?: string;
    readonly connectionConfig?: ConnectionConfig;
    readonly timestampField?: string;
    readonly config?: Record<string, unknown>;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
    readonly isUsed?: boolean;

    constructor(
        id: string,
        name: string,
        type: DataSourceType,
        visibility: DataSourceVisibility,
        ownerId: string,
        endpoint?: string,
        filePath?: string,
        connectionConfig?: ConnectionConfig,
        timestampField?: string,
        config?: Record<string, unknown>,
        createdAt?: Date,
        updatedAt?: Date,
        isUsed?: boolean
    ) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.visibility = visibility;
        this.ownerId = ownerId;
        this.endpoint = endpoint;
        this.filePath = filePath;
        this.connectionConfig = connectionConfig;
        this.timestampField = timestampField;
        this.config = config;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isUsed = isUsed;

        this.validate();
    }

    private validate(): void {
        if (!this.name || this.name.trim().length < 2) {
            throw new DataSourceValidationError("Le nom doit contenir au moins 2 caractères");
        }

        if (this.name.length > 100) {
            throw new DataSourceValidationError("Le nom ne peut pas dépasser 100 caractères");
        }

        if (this.type === "json" && !this.endpoint) {
            throw new DataSourceValidationError("L'endpoint est requis pour les sources JSON");
        }

        if (this.type === "csv" && !this.endpoint && !this.filePath) {
            throw new DataSourceValidationError("L'endpoint ou le fichier est requis pour les sources CSV");
        }

        if (this.type === "elasticsearch" && !this.connectionConfig?.esIndex) {
            throw new DataSourceValidationError("L'index Elasticsearch est requis");
        }
    }

    isPublic(): boolean {
        return this.visibility === "public";
    }

    isPrivate(): boolean {
        return this.visibility === "private";
    }

    canBeDeleted(): boolean {
        return !this.isUsed;
    }

    hasTimestampField(): boolean {
        return !!this.timestampField;
    }

    isRemoteCSV(): boolean {
        return this.type === "csv" && !!this.endpoint;
    }

    isUploadedCSV(): boolean {
        return this.type === "csv" && !!this.filePath;
    }

    isJSON(): boolean {
        return this.type === "json";
    }

    isElasticsearch(): boolean {
        return this.type === "elasticsearch";
    }

    clone(overrides: Partial<DataSource>): DataSource {
        return new DataSource(
            overrides.id ?? this.id,
            overrides.name ?? this.name,
            overrides.type ?? this.type,
            overrides.visibility ?? this.visibility,
            overrides.ownerId ?? this.ownerId,
            overrides.endpoint ?? this.endpoint,
            overrides.filePath ?? this.filePath,
            overrides.connectionConfig ?? this.connectionConfig,
            overrides.timestampField ?? this.timestampField,
            overrides.config ?? this.config,
            overrides.createdAt ?? this.createdAt,
            overrides.updatedAt ?? this.updatedAt,
            overrides.isUsed ?? this.isUsed
        );
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            visibility: this.visibility,
            ownerId: this.ownerId,
            endpoint: this.endpoint,
            filePath: this.filePath,
            connectionConfig: this.connectionConfig,
            timestampField: this.timestampField,
            config: this.config,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            isUsed: this.isUsed,
        };
    }
}
