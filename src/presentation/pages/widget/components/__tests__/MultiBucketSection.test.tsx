import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import "@testing-library/jest-dom/vitest";
import type { MultiBucketConfig } from "@/application/types/metricBucketTypes";
import MultiBucketSection from "../sections/MultiBucketSection";

vi.mock("BucketConfigComponent", () => ({
    default: ({ bucket, index, onDelete, onMoveUp, onMoveDown }: any) => (
        <div data-testid={`bucket-${index}`}>
            <div>Bucket: {bucket.type} - {bucket.field}</div>
            <button onClick={onDelete}>Delete</button>
            <button onClick={onMoveUp}>Move Up</button>
            <button onClick={onMoveDown}>Move Down</button>
        </div>
    ),
}));

vi.mock("@hooks/bucket/useBucketOperations", () => ({
    useBucketOperations: ({ buckets, onBucketsChange }: any) => ({
        handleAddBucket: () => {
            onBucketsChange([...buckets, { type: "terms", field: "new" }]);
        },
        handleDeleteBucket: (idx: number) => {
            onBucketsChange(buckets.filter((_: any, i: number) => i !== idx));
        },
        handleMoveBucket: (idx: number, direction: "up" | "down") => {
            const targetIdx = direction === "up" ? idx - 1 : idx + 1;
            if (targetIdx >= 0 && targetIdx < buckets.length) {
                const newBuckets = [...buckets];
                [newBuckets[idx], newBuckets[targetIdx]] = [
                    newBuckets[targetIdx],
                    newBuckets[idx],
                ];
                onBucketsChange(newBuckets);
            }
        },
        handleBucketUpdate: (idx: number, bucket: any) => {
            const newBuckets = [...buckets];
            newBuckets[idx] = bucket;
            onBucketsChange(newBuckets);
        },
        canMoveUp: (idx: number) => idx > 0,
        canMoveDown: (idx: number) => idx < buckets.length - 1,
    }),
})); describe("MultiBucketSection", () => {
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

    const mockColumns = ["category", "price", "date"];
    let mockOnBucketsChange: (buckets: MultiBucketConfig[]) => void;

    beforeEach(() => {
        mockOnBucketsChange = vi.fn() as (buckets: MultiBucketConfig[]) => void;
    });

    it("devrait afficher un message quand il n'y a pas de buckets", () => {
        render(
            <MultiBucketSection
                buckets={[]}
                columns={mockColumns}
                onBucketsChange={mockOnBucketsChange}
            />
        );

        expect(
            screen.getByText(/Aucun bucket configuré/i)
        ).toBeInTheDocument();
    });

    it("devrait afficher les buckets configurés", () => {
        render(
            <MultiBucketSection
                buckets={[mockBucket1, mockBucket2]}
                columns={mockColumns}
                onBucketsChange={mockOnBucketsChange}
            />
        );

        expect(screen.getByText(/Bucket: terms - category/)).toBeInTheDocument();
        expect(screen.getByText(/Bucket: histogram - price/)).toBeInTheDocument();
    }); it("devrait afficher le titre personnalisé", () => {
        render(
            <MultiBucketSection
                buckets={[]}
                columns={mockColumns}
                sectionLabel="Groupements personnalisés"
                onBucketsChange={mockOnBucketsChange}
            />
        );

        expect(screen.getByText("Groupements personnalisés")).toBeInTheDocument();
    });

    it("devrait afficher le bouton d'ajout si allowMultiple est true", () => {
        render(
            <MultiBucketSection
                buckets={[]}
                columns={mockColumns}
                allowMultiple={true}
                onBucketsChange={mockOnBucketsChange}
            />
        );

        expect(screen.getByText("Ajouter un bucket")).toBeInTheDocument();
    });

    it("ne devrait pas afficher le bouton d'ajout si allowMultiple est false", () => {
        render(
            <MultiBucketSection
                buckets={[mockBucket1]}
                columns={mockColumns}
                allowMultiple={false}
                onBucketsChange={mockOnBucketsChange}
            />
        );

        const addButtons = screen.queryAllByText("Ajouter un bucket");
        expect(addButtons.length).toBe(0);
    });

    it("devrait appeler onBucketsChange lors de l'ajout d'un bucket", () => {
        render(
            <MultiBucketSection
                buckets={[]}
                columns={mockColumns}
                onBucketsChange={mockOnBucketsChange}
            />
        );

        const addButton = screen.getByText("Ajouter un bucket");
        fireEvent.click(addButton);

        expect(mockOnBucketsChange).toHaveBeenCalledTimes(1);
        const calls = (mockOnBucketsChange as any).mock?.calls;
        if (calls) {
            expect(calls[0][0]).toHaveLength(1);
        }
    });

    it("devrait calculer isOnlyBucket correctement", () => {
        const { rerender } = render(
            <MultiBucketSection
                buckets={[mockBucket1]}
                columns={mockColumns}
                allowMultiple={true}
                onBucketsChange={mockOnBucketsChange}
            />
        );

        expect(screen.getByTestId("bucket-0")).toBeInTheDocument();

        rerender(
            <MultiBucketSection
                buckets={[mockBucket1, mockBucket2]}
                columns={mockColumns}
                allowMultiple={true}
                onBucketsChange={mockOnBucketsChange}
            />
        );

        expect(screen.getByTestId("bucket-0")).toBeInTheDocument();
        expect(screen.getByTestId("bucket-1")).toBeInTheDocument();
    }); it("devrait passer les props correctement à BucketConfigComponent", () => {
        render(
            <MultiBucketSection
                buckets={[mockBucket1, mockBucket2]}
                columns={mockColumns}
                data={[{ category: "A", price: 100 }]}
                onBucketsChange={mockOnBucketsChange}
            />
        );

        expect(screen.getByTestId("bucket-0")).toBeInTheDocument();
        expect(screen.getByTestId("bucket-1")).toBeInTheDocument();
    });

    it("devrait utiliser le premier colonne par défaut pour defaultBucketField", () => {
        render(
            <MultiBucketSection
                buckets={[]}
                columns={["col1", "col2"]}
                onBucketsChange={mockOnBucketsChange}
            />
        );

        expect(screen.getByText("Ajouter un bucket")).toBeInTheDocument();
    });

    it("devrait gérer les colonnes vides", () => {
        render(
            <MultiBucketSection
                buckets={[]}
                columns={[]}
                onBucketsChange={mockOnBucketsChange}
            />
        );

        expect(
            screen.getByText(/Aucun bucket configuré/i)
        ).toBeInTheDocument();
    });
});
