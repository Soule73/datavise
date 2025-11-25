import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBucketOperations } from "../useBucketOperations";
import type { MultiBucketConfig } from "@/application/types/metricBucketTypes";

describe("useBucketOperations", () => {
    const mockBucket1: MultiBucketConfig = {
        type: "terms",
        field: "category",
        label: "Catégories",
        order: "desc",
        size: 10,
    };

    const mockBucket2: MultiBucketConfig = {
        type: "histogram",
        field: "price",
        label: "Prix",
        interval: 100,
        order: "asc",
        size: 20,
    };

    const mockBucket3: MultiBucketConfig = {
        type: "date_histogram",
        field: "date",
        label: "Dates",
        dateInterval: "day",
        order: "desc",
        size: 30,
    };

    let mockOnBucketsChange: ReturnType<typeof vi.fn>;
    let defaultProps: any;

    beforeEach(() => {
        mockOnBucketsChange = vi.fn();
        defaultProps = {
            buckets: [mockBucket1, mockBucket2, mockBucket3],
            onBucketsChange: mockOnBucketsChange,
            defaultBucketType: "terms" as const,
            defaultBucketField: "default",
        };
    });

    it("devrait ajouter un nouveau bucket", () => {
        const { result } = renderHook(() => useBucketOperations(defaultProps));

        act(() => {
            result.current.handleAddBucket();
        });

        expect(mockOnBucketsChange).toHaveBeenCalledTimes(1);
        const newBuckets = mockOnBucketsChange.mock.calls[0][0];
        expect(newBuckets).toHaveLength(4);
        expect(newBuckets[3].type).toBe("terms");
        expect(newBuckets[3].field).toBe("default");
    });

    it("devrait supprimer un bucket", () => {
        const { result } = renderHook(() => useBucketOperations(defaultProps));

        act(() => {
            result.current.handleDeleteBucket(1);
        });

        expect(mockOnBucketsChange).toHaveBeenCalledTimes(1);
        const newBuckets = mockOnBucketsChange.mock.calls[0][0];
        expect(newBuckets).toHaveLength(2);
        expect(newBuckets[0]).toEqual(mockBucket1);
        expect(newBuckets[1]).toEqual(mockBucket3);
    });

    it("devrait déplacer un bucket vers le haut", () => {
        const { result } = renderHook(() => useBucketOperations(defaultProps));

        act(() => {
            result.current.handleMoveBucket(1, "up");
        });

        expect(mockOnBucketsChange).toHaveBeenCalledTimes(1);
        const newBuckets = mockOnBucketsChange.mock.calls[0][0];
        expect(newBuckets).toHaveLength(3);
        expect(newBuckets[0]).toEqual(mockBucket2);
        expect(newBuckets[1]).toEqual(mockBucket1);
        expect(newBuckets[2]).toEqual(mockBucket3);
    });

    it("devrait déplacer un bucket vers le bas", () => {
        const { result } = renderHook(() => useBucketOperations(defaultProps));

        act(() => {
            result.current.handleMoveBucket(0, "down");
        });

        expect(mockOnBucketsChange).toHaveBeenCalledTimes(1);
        const newBuckets = mockOnBucketsChange.mock.calls[0][0];
        expect(newBuckets).toHaveLength(3);
        expect(newBuckets[0]).toEqual(mockBucket2);
        expect(newBuckets[1]).toEqual(mockBucket1);
        expect(newBuckets[2]).toEqual(mockBucket3);
    });

    it("ne devrait pas déplacer un bucket hors limites (up)", () => {
        const { result } = renderHook(() => useBucketOperations(defaultProps));

        act(() => {
            result.current.handleMoveBucket(0, "up");
        });

        expect(mockOnBucketsChange).not.toHaveBeenCalled();
    });

    it("ne devrait pas déplacer un bucket hors limites (down)", () => {
        const { result } = renderHook(() => useBucketOperations(defaultProps));

        act(() => {
            result.current.handleMoveBucket(2, "down");
        });

        expect(mockOnBucketsChange).not.toHaveBeenCalled();
    });

    it("devrait mettre à jour un bucket", () => {
        const { result } = renderHook(() => useBucketOperations(defaultProps));

        const updatedBucket = { ...mockBucket2, size: 50 };

        act(() => {
            result.current.handleBucketUpdate(1, updatedBucket);
        });

        expect(mockOnBucketsChange).toHaveBeenCalledTimes(1);
        const newBuckets = mockOnBucketsChange.mock.calls[0][0];
        expect(newBuckets).toHaveLength(3);
        expect(newBuckets[1].size).toBe(50);
        expect(newBuckets[0]).toEqual(mockBucket1);
        expect(newBuckets[2]).toEqual(mockBucket3);
    });

    it("ne devrait pas mettre à jour si l'index est invalide", () => {
        const { result } = renderHook(() => useBucketOperations(defaultProps));

        act(() => {
            result.current.handleBucketUpdate(10, mockBucket1);
        });

        expect(mockOnBucketsChange).not.toHaveBeenCalled();
    });

    it("devrait calculer canMoveUp correctement", () => {
        const { result } = renderHook(() => useBucketOperations(defaultProps));

        expect(result.current.canMoveUp(0)).toBe(false);
        expect(result.current.canMoveUp(1)).toBe(true);
        expect(result.current.canMoveUp(2)).toBe(true);
    });

    it("devrait calculer canMoveDown correctement", () => {
        const { result } = renderHook(() => useBucketOperations(defaultProps));

        expect(result.current.canMoveDown(0)).toBe(true);
        expect(result.current.canMoveDown(1)).toBe(true);
        expect(result.current.canMoveDown(2)).toBe(false);
    });

    it("devrait gérer une liste vide", () => {
        const emptyProps = {
            ...defaultProps,
            buckets: [],
        };

        const { result } = renderHook(() => useBucketOperations(emptyProps));

        act(() => {
            result.current.handleAddBucket();
        });

        expect(mockOnBucketsChange).toHaveBeenCalledTimes(1);
        const newBuckets = mockOnBucketsChange.mock.calls[0][0];
        expect(newBuckets).toHaveLength(1);
        expect(newBuckets[0].type).toBe("terms");
    });

    it("devrait utiliser les valeurs par défaut personnalisées", () => {
        const customProps = {
            ...defaultProps,
            buckets: [],
            defaultBucketType: "histogram" as const,
            defaultBucketField: "custom_field",
        };

        const { result } = renderHook(() => useBucketOperations(customProps));

        act(() => {
            result.current.handleAddBucket();
        });

        const newBuckets = mockOnBucketsChange.mock.calls[0][0];
        expect(newBuckets[0].type).toBe("histogram");
        expect(newBuckets[0].field).toBe("custom_field");
    });
});
