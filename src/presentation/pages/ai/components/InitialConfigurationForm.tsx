import type { DataSource } from "@domain/entities/DataSource.entity";

interface Props {
    dataSources: DataSource[];
    selectedSourceId: string;
    maxWidgets: number;
    onSourceChange: (sourceId: string) => void;
    onMaxWidgetsChange: (max: number) => void;
}

export default function InitialConfigurationForm({
    dataSources,
    selectedSourceId,
    maxWidgets,
    onSourceChange,
    onMaxWidgetsChange,
}: Props) {
    return (
        //p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700
        <div className="flex-1 flex px-4 flex-col justify-end text-gray-400 dark:text-gray-500">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Source de données
                </label>
                <select
                    value={selectedSourceId}
                    onChange={(e) => onSourceChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white text-sm"
                >
                    <option value="">Sélectionnez une source</option>
                    {dataSources.map((source) => (
                        <option key={source.id} value={source.id}>
                            {source.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre de widgets (max: {maxWidgets})
                </label>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={maxWidgets}
                    onChange={(e) => onMaxWidgetsChange(Number(e.target.value))}
                    className="w-full"
                />
            </div>
        </div>
    );
}
