import { useCallback } from "react";
import type { MultiBucketConfig, BucketType } from "@/application/types/metricBucketTypes";
import { createDefaultBucket } from "@utils/bucketMetrics/bucketUtils";

export interface UseBucketOperationsProps {
    buckets: MultiBucketConfig[];
    onBucketsChange: (buckets: MultiBucketConfig[]) => void;
    defaultBucketType?: BucketType;
    defaultBucketField?: string;
}

export interface UseBucketOperationsReturn {
    handleAddBucket: () => void;
    handleDeleteBucket: (idx: number) => void;
    handleMoveBucket: (idx: number, direction: "up" | "down") => void;
    handleBucketUpdate: (idx: number, updatedBucket: MultiBucketConfig) => void;
    canMoveUp: (idx: number) => boolean;
    canMoveDown: (idx: number) => boolean;
}

/**
 * Hook pour gérer les opérations CRUD sur les buckets
 * Pattern similaire à useMetricOperations pour cohérence
 */
export function useBucketOperations({
    buckets,
    onBucketsChange,
    defaultBucketType = "terms",
    defaultBucketField = "",
}: UseBucketOperationsProps): UseBucketOperationsReturn {
    const handleAddBucket = useCallback(() => {
        const newBucket = createDefaultBucket(defaultBucketType, defaultBucketField);
        onBucketsChange([...buckets, newBucket]);
    }, [buckets, defaultBucketType, defaultBucketField, onBucketsChange]);

    const handleDeleteBucket = useCallback(
        (idx: number) => {
            const newBuckets = buckets.filter((_, i) => i !== idx);
            onBucketsChange(newBuckets);
        },
        [buckets, onBucketsChange]
    );

    const handleMoveBucket = useCallback(
        (idx: number, direction: "up" | "down") => {
            const targetIdx = direction === "up" ? idx - 1 : idx + 1;
            if (targetIdx < 0 || targetIdx >= buckets.length) return;

            const newBuckets = [...buckets];
            [newBuckets[idx], newBuckets[targetIdx]] = [
                newBuckets[targetIdx],
                newBuckets[idx],
            ];
            onBucketsChange(newBuckets);
        },
        [buckets, onBucketsChange]
    );

    const handleBucketUpdate = useCallback(
        (idx: number, updatedBucket: MultiBucketConfig) => {
            if (idx < 0 || idx >= buckets.length) return;

            const newBuckets = [...buckets];
            newBuckets[idx] = updatedBucket;
            onBucketsChange(newBuckets);
        },
        [buckets, onBucketsChange]
    );

    const canMoveUp = useCallback((idx: number) => idx > 0, []);

    const canMoveDown = useCallback(
        (idx: number) => idx < buckets.length - 1,
        [buckets.length]
    );

    return {
        handleAddBucket,
        handleDeleteBucket,
        handleMoveBucket,
        handleBucketUpdate,
        canMoveUp,
        canMoveDown,
    };
}
