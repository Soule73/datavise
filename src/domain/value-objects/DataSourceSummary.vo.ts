export interface ColumnSummary {
    name: string;
    type: string;
    uniqueValues?: number;
    sampleValues?: unknown[];
}

export interface DataSourceSummary {
    name: string;
    type: string;
    rowCount: number;
    columns: ColumnSummary[];
}

export function createDataSourceSummary(
    name: string,
    type: string,
    rowCount: number,
    columns: ColumnSummary[]
): DataSourceSummary {
    return {
        name,
        type,
        rowCount,
        columns,
    };
}

export function validateDataSourceSummary(summary: DataSourceSummary): boolean {
    return (
        !!summary.name &&
        summary.name.trim().length > 0 &&
        !!summary.type &&
        summary.rowCount >= 0 &&
        Array.isArray(summary.columns) &&
        summary.columns.length > 0
    );
}

export function getColumnNames(summary: DataSourceSummary): string[] {
    return summary.columns.map((col) => col.name);
}

export function getNumericColumns(summary: DataSourceSummary): string[] {
    return summary.columns
        .filter((col) => col.type === "number")
        .map((col) => col.name);
}

export function getCategoricalColumns(summary: DataSourceSummary): string[] {
    return summary.columns
        .filter((col) => col.type === "string")
        .map((col) => col.name);
}

export function getDateColumns(summary: DataSourceSummary): string[] {
    return summary.columns
        .filter((col) => col.type === "date")
        .map((col) => col.name);
}
