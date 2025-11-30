import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ListDataSourcesUseCase } from "@domain/use-cases/datasource/ListDataSources.usecase";
import { DataSourceRepository } from "@/infrastructure/repositories/DataSourceRepository";
import type { DataSource } from "@domain/entities/DataSource.entity";
import type { DataSourceFilters } from "@domain/ports/repositories/IDataSourceRepository";

const dataSourceRepository = new DataSourceRepository();
const listDataSourcesUseCase = new ListDataSourcesUseCase(dataSourceRepository);

export function useDataSourceList(filters?: DataSourceFilters) {
    const queryClient = useQueryClient();

    const { data: dataSources, isLoading, error } = useQuery<DataSource[]>({
        queryKey: ["dataSources", filters],
        queryFn: () => listDataSourcesUseCase.execute(filters),
        staleTime: 1000 * 60 * 5,
    });

    const refetch = () => {
        queryClient.invalidateQueries({ queryKey: ["dataSources"] });
    };

    return {
        dataSources: dataSources ?? [],
        isLoading,
        error,
        refetch,
    };
}
