import { useMemo } from "react";

/**
 * Hook pour générer les options de colonnes formatées pour les SelectField
 */
export const useColumnOptions = (columns: string[]) => {
    return useMemo(
        () => columns.map(col => ({ value: col, label: col })),
        [columns]
    );
};
