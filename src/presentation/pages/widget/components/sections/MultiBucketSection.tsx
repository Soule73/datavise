import type { MultiBucketConfig } from "@/application/types/metricBucketTypes";
import WidgetConfigSection from "./WidgetConfigSection";
import { useBucketOperations } from "@hooks/bucket/useBucketOperations";
import BucketConfigComponent from "../fields/BucketConfigComponent";

export interface MultiBucketSectionProps {
    buckets: MultiBucketConfig[];
    columns: string[];
    data?: Record<string, unknown>[];
    allowMultiple?: boolean;
    sectionLabel?: string;
    onBucketsChange: (buckets: MultiBucketConfig[]) => void;
}

export default function MultiBucketSection({
    buckets,
    columns,
    data,
    allowMultiple = true,
    sectionLabel = "Buckets",
    onBucketsChange,
}: MultiBucketSectionProps) {
    const {
        handleAddBucket,
        handleDeleteBucket,
        handleMoveBucket,
        handleBucketUpdate,
        canMoveUp,
        canMoveDown,
    } = useBucketOperations({
        buckets,
        onBucketsChange,
        defaultBucketType: "terms",
        defaultBucketField: columns[0] || "",
    });

    const isOnlyBucket = buckets.length === 1;

    return (
        <WidgetConfigSection
            title={sectionLabel}
            addButtonText="Ajouter un bucket"
            canAdd={allowMultiple}
            onAdd={handleAddBucket}
        >
            {buckets.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Aucun bucket configuré. Cliquez sur "Ajouter un bucket" pour commencer.
                </p>
            ) : (
                <div className="space-y-3">
                    {buckets.map((bucket, index) => (
                        <BucketConfigComponent
                            key={index}
                            bucket={bucket}
                            index={index}
                            columns={columns}
                            data={data}
                            isOnlyBucket={isOnlyBucket && allowMultiple}
                            canMoveUp={canMoveUp(index)}
                            canMoveDown={canMoveDown(index)}
                            onUpdate={(updatedBucket) => handleBucketUpdate(index, updatedBucket)}
                            onDelete={() => handleDeleteBucket(index)}
                            onMoveUp={() => handleMoveBucket(index, "up")}
                            onMoveDown={() => handleMoveBucket(index, "down")}
                        />
                    ))}
                </div>
            )}
        </WidgetConfigSection>
    );
}

