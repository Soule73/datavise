/**
 * Métadonnées d'une colonne détectée dans une source de données
 */
export interface ColumnMetadata {
    name: string;
    type: "string" | "number" | "date" | "boolean" | "unknown";
    isNullable?: boolean;
    uniqueValues?: number;
    sampleValues?: unknown[];
}

/**
 * Résultat de la détection de colonnes
 */
export interface DetectionResult {
    columns: ColumnMetadata[];
    preview?: Record<string, unknown>[];
    suggestedTimestampField?: string;
}

/**
 * Helper pour détecter automatiquement le type d'une colonne
 */
export function detectColumnType(
    values: unknown[]
): "string" | "number" | "date" | "boolean" | "unknown" {
    if (values.length === 0) return "unknown";

    const nonNullValues = values.filter((v) => v !== null && v !== undefined);
    if (nonNullValues.length === 0) return "unknown";

    const sample = nonNullValues[0];

    if (typeof sample === "number") return "number";
    if (typeof sample === "boolean") return "boolean";

    if (typeof sample === "string") {
        const datePattern = /^\d{4}-\d{2}-\d{2}|^\d{2}\/\d{2}\/\d{4}/;
        if (datePattern.test(sample)) return "date";

        if (!isNaN(Number(sample))) return "number";
    }

    return "string";
}
