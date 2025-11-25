import type { ReactNode } from "react";
import { GlobalFiltersConfig } from "@components/widgets/sections";
import type { WidgetConfig } from "@/domain/value-objects";

interface BaseDataConfigSectionProps {
    config: WidgetConfig;
    columns: string[];
    handleConfigChange: (field: string, value: any) => void;
    data?: Record<string, any>[];
    children: ReactNode;
    showGlobalFilters?: boolean;
}

/**
 * Composant de base pour les sections de configuration de données
 * Fournit une structure commune avec filtres globaux optionnels
 */
export default function BaseDataConfigSection({
    config,
    columns,
    data = [],
    handleConfigChange,
    children,
    showGlobalFilters = true,
}: BaseDataConfigSectionProps) {
    return (
        <div className="space-y-6">
            {showGlobalFilters && (
                <GlobalFiltersConfig
                    filters={config.globalFilters || []}
                    columns={columns}
                    data={data}
                    onFiltersChange={(filters) => handleConfigChange('globalFilters', filters)}
                />
            )}

            {children}
        </div>
    );
}
