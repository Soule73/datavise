export interface DataSourceDTO {
    _id: string;
    name: string;
    type: "json" | "csv" | "elasticsearch";
    visibility: "public" | "private";
    ownerId: string;
    endpoint?: string;
    filePath?: string;
    httpMethod?: string;
    authType?: string;
    authConfig?: {
        token?: string;
        apiKey?: string;
        username?: string;
        password?: string;
        headerName?: string;
    };
    timestampField?: string;
    esIndex?: string;
    esQuery?: string;
    config?: Record<string, unknown>;
    createdAt?: string;
    updatedAt?: string;
    isUsed?: boolean;
}

export interface DetectColumnsResponseDTO {
    columns: string[];
    preview?: Record<string, unknown>[];
    types?: Record<string, string>;
}
