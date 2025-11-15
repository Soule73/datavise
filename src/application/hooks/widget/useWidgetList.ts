import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ListWidgetsUseCase } from "@domain/use-cases/widget/ListWidgets.usecase";
import { WidgetRepository } from "@infrastructure/repositories/WidgetRepository";
import type { Widget } from "@domain/entities/Widget.entity";
import type { WidgetFilters } from "@domain/ports/repositories/IWidgetRepository";

const widgetRepository = new WidgetRepository();
const listWidgetsUseCase = new ListWidgetsUseCase(widgetRepository);

export function useWidgetList(filters?: WidgetFilters) {
    const queryClient = useQueryClient();

    const { data: widgets, isLoading, error } = useQuery<Widget[]>({
        queryKey: ["widgets", filters],
        queryFn: () => listWidgetsUseCase.execute(filters),
        staleTime: 1000 * 60 * 5,
    });

    const refetch = () => {
        queryClient.invalidateQueries({ queryKey: ["widgets"] });
    };

    return {
        widgets: widgets ?? [],
        isLoading,
        error,
        refetch,
    };
}
