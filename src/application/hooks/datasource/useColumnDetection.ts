import { useQuery } from "@tanstack/react-query";
import { DetectColumnsUseCase } from "@domain/use-cases/datasource/DetectColumns.usecase";
import { DataSourceRepository } from "@/infrastructure/repositories/DataSourceRepository";
import type { DetectionResult } from "@domain/value-objects/ColumnMetadata.vo";
import type { DetectColumnsParams } from "@domain/ports/repositories/IDataSourceRepository";

const dataSourceRepository = new DataSourceRepository();
const detectColumnsUseCase = new DetectColumnsUseCase(dataSourceRepository);

export function useColumnDetection(params: DetectColumnsParams | null, enabled: boolean = false) {
    const { data, isLoading, error, isFetching } = useQuery<DetectionResult>({
        queryKey: ["detectColumns", params],
        queryFn: () => detectColumnsUseCase.execute(params!),
        enabled: enabled && !!params,
        staleTime: 0,
        retry: false,
    });

    return {
        detectionResult: data,
        isDetecting: isLoading || isFetching,
        detectionError: error,
    };
}
