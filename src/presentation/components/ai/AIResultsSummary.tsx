import type { AIGenerateResponse } from "@type/aiTypes";

interface AIResultsSummaryProps {
    dataSourceSummary: AIGenerateResponse["dataSourceSummary"] | null;
}

export default function AIResultsSummary({
    dataSourceSummary,
}: AIResultsSummaryProps) {
    if (!dataSourceSummary) return null;

    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2 dark:text-white">
                Source analysée: {dataSourceSummary.name}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
                {dataSourceSummary.rowCount} lignes •{" "}
                {dataSourceSummary.columns.length} colonnes
            </p>
        </div>
    );
}
