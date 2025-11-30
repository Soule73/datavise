import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import MetricConfigItem from "../fields/MetricConfigItem";

describe("MetricConfigItem", () => {
    const mockMetric = {
        agg: "sum",
        field: "revenue",
        label: "Total Revenue",
    };

    const mockAllowedAggs = [
        { value: "sum", label: "Somme" },
        { value: "avg", label: "Moyenne" },
        { value: "count", label: "Compte" },
    ];

    const mockColumns = ["revenue", "orders", "price"];

    const defaultProps = {
        metric: mockMetric,
        index: 0,
        allowedAggs: mockAllowedAggs,
        columns: mockColumns,
        canMoveUp: true,
        canMoveDown: true,
        canDelete: true,
        onMetricChange: vi.fn(),
        onDelete: vi.fn(),
        onMoveUp: vi.fn(),
        onMoveDown: vi.fn(),
    };

    it("devrait afficher le header avec l'agrégation et le champ", () => {
        render(<MetricConfigItem {...defaultProps} />);
        expect(screen.getByText("Somme · revenue")).toBeInTheDocument();
    });

    it("devrait afficher uniquement l'agrégation si le champ est vide", () => {
        const metricWithoutField = { ...mockMetric, field: "" };
        render(<MetricConfigItem {...defaultProps} metric={metricWithoutField} />);
        expect(screen.getByText("Somme")).toBeInTheDocument();
    });

    it("devrait afficher les champs de formulaire", () => {
        render(<MetricConfigItem {...defaultProps} />);

        expect(screen.getByLabelText("Agrégation")).toBeInTheDocument();
        expect(screen.getByLabelText("Champ")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Total Revenue")).toBeInTheDocument();
    });

    it("devrait appeler onMetricChange lors du changement de label", () => {
        const onMetricChange = vi.fn();
        render(<MetricConfigItem {...defaultProps} onMetricChange={onMetricChange} />);

        const labelInput = screen.getByDisplayValue("Total Revenue");
        fireEvent.change(labelInput, { target: { value: "Nouveau Label" } });

        expect(onMetricChange).toHaveBeenCalledWith(0, "label", "Nouveau Label");
    });

    it("ne devrait pas afficher le bouton delete si canDelete est false", () => {
        const propsWithoutDelete = {
            ...defaultProps,
            canDelete: false,
            onDelete: undefined,
        };
        render(<MetricConfigItem {...propsWithoutDelete} />);

        const deleteButton = screen.queryByTitle("Supprimer");
        expect(deleteButton).not.toBeInTheDocument();
    });

    it("devrait gérer les métriques sans label", () => {
        const metricWithoutLabel = { ...mockMetric, label: "" };
        render(<MetricConfigItem {...defaultProps} metric={metricWithoutLabel} />);

        const labelInput = screen.getByRole("textbox");
        expect(labelInput).toHaveValue("");
    });

    it("devrait mémoriser le header label", () => {
        const { rerender } = render(<MetricConfigItem {...defaultProps} />);

        const header1 = screen.getByText("Somme · revenue");
        expect(header1).toBeInTheDocument();

        rerender(<MetricConfigItem {...defaultProps} metric={mockMetric} />);

        expect(screen.getByText("Somme · revenue")).toBe(header1);
    });

    it("devrait mémoriser les options de colonnes", () => {
        const { rerender } = render(<MetricConfigItem {...defaultProps} />);

        const fieldSelect1 = screen.getByLabelText("Champ");

        rerender(<MetricConfigItem {...defaultProps} columns={mockColumns} />);

        const fieldSelect2 = screen.getByLabelText("Champ");
        expect(fieldSelect1).toBe(fieldSelect2);
    });
});
