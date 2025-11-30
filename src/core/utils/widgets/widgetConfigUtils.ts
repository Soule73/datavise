/* eslint-disable @typescript-eslint/no-explicit-any */
import type { WidgetType } from "@/domain/value-objects";
import {
    WIDGETS,
    WIDGET_CONFIG_FIELDS,
} from "@/core/config/visualizations";

/**
 * Génère un style par défaut pour une métrique
 */
export function generateDefaultMetricStyle(): Record<string, any> {
    const styleFields = Object.keys(WIDGET_CONFIG_FIELDS).filter((key) =>
        [
            "color",
            "borderColor",
            "borderWidth",
            "labelColor",
            "labelFontSize",
            "pointStyle",
            "barThickness",
            "borderRadius",
        ].includes(key)
    );


    const style: Record<string, any> = {};
    styleFields.forEach((field) => {
        const fieldConfig = WIDGET_CONFIG_FIELDS[field as keyof typeof WIDGET_CONFIG_FIELDS];
        if (fieldConfig && 'default' in fieldConfig) {
            style[field] = fieldConfig.default;
        }
    });

    return style;
}

/**
 * Synchronise les styles des métriques avec la configuration (VERSION SIMPLIFIÉE)
 * Ajoute ou supprime des styles selon le nombre de métriques
 * NE fait rien si le widget n'utilise pas de metricStyles (longueur = 0 dans l'adaptateur)
 */
export function syncMetricStyles(
    metrics: any[],
    metricStyles: any[] | undefined | null,
    widgetType: WidgetType
): any[] | undefined {
    // Vérifier d'abord si ce widget utilise des metricStyles
    const widgetDef = WIDGETS[widgetType];
    const metricStylesSchema = widgetDef?.configSchema?.metricStyles;

    // Si metricStyles est vide dans l'adaptateur, retourner undefined pour ne pas créer de styles
    if (!metricStylesSchema || Object.keys(metricStylesSchema).length === 0) {
        return undefined;
    }

    // S'assurer que metricStyles est un tableau
    const safeMetricStyles = Array.isArray(metricStyles) ? metricStyles : [];
    const newStyles = [...safeMetricStyles];

    // Ajouter des styles pour les nouvelles métriques
    for (let i = safeMetricStyles.length; i < metrics.length; i++) {
        newStyles.push(generateDefaultMetricStyle());
    }

    // Supprimer les styles en trop
    if (newStyles.length > metrics.length) {
        return newStyles.slice(0, metrics.length);
    }

    return newStyles;
}
