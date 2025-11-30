/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DataSource } from "@domain/entities/DataSource.entity";

export interface SourceOption {
    value: string;
    label: string;
}


/**
 * Transforme les sources de données en options pour un SelectField
 */
export function generateSourceOptions(sources: DataSource[]): SourceOption[] {
    return [
        { value: "", label: "Sélectionner une source" },
        ...sources.map((s: DataSource) => ({
            value: s.id,
            label: s.name,
        })),
    ];
}

/**
 * Trouve une source de données par son ID
 */
export function findSourceById(sources: DataSource[], sourceId: string): DataSource | undefined {
    return sources.find((s: DataSource) => s.id === sourceId);
}

/**
 * Extrait les colonnes depuis les données de prévisualisation
 */
export function extractColumnsFromData(data: Record<string, any>[]): string[] {
    if (!Array.isArray(data) || data.length === 0) {
        return [];
    }

    const firstRow = data[0];
    if (!firstRow || typeof firstRow !== "object") {
        return [];
    }

    return Object.keys(firstRow);
}

/**
 * Valide si les données de prévisualisation sont prêtes
 */
export function isDataPreviewReady(dataPreview: Record<string, any>[]): boolean {
    return Array.isArray(dataPreview) && dataPreview.length > 0;
}

/**
 * Valide si une configuration de widget est prête pour la prévisualisation
 */
export function isConfigReady(config: Record<string, any>): boolean {
    return config && Object.keys(config).length > 0;
}

/**
 * Valide si un widget est prêt pour la prévisualisation complète
 */
export function isWidgetPreviewReady(
    WidgetComponent: any,
    dataPreview: Record<string, any>[],
    config: Record<string, any>
): boolean {
    return Boolean(
        WidgetComponent &&
        isDataPreviewReady(dataPreview) &&
        isConfigReady(config)
    );
}
