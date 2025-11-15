import type { IDataSourceRepository, DetectColumnsParams } from "../../ports/repositories/IDataSourceRepository";
import type { DetectionResult } from "../../value-objects/ColumnMetadata.vo";

export class DetectColumnsUseCase {
    private dataSourceRepository: IDataSourceRepository;

    constructor(dataSourceRepository: IDataSourceRepository) {
        this.dataSourceRepository = dataSourceRepository;
    }

    async execute(params: DetectColumnsParams): Promise<DetectionResult> {
        try {
            const result = await this.dataSourceRepository.detectColumns(params);

            const suggestedTimestamp = this.findTimestampField(result.columns.map(c => c.name));

            return {
                ...result,
                suggestedTimestampField: suggestedTimestamp,
            };
        } catch (error) {
            console.error("Erreur lors de la détection des colonnes:", error);
            throw error;
        }
    }

    private findTimestampField(columns: string[]): string | undefined {
        const timestampPatterns = ["date", "timestamp", "time", "created", "updated"];

        return columns.find((col) =>
            timestampPatterns.some((pattern) => col.toLowerCase().includes(pattern))
        );
    }
}
