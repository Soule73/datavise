import type { IDataSourceRepository, DataSourceFilters } from "../../ports/repositories/IDataSourceRepository";
import type { DataSource } from "../../entities/DataSource.entity";

export class ListDataSourcesUseCase {
    private dataSourceRepository: IDataSourceRepository;

    constructor(dataSourceRepository: IDataSourceRepository) {
        this.dataSourceRepository = dataSourceRepository;
    }

    async execute(filters?: DataSourceFilters): Promise<DataSource[]> {
        try {
            return await this.dataSourceRepository.findAll(filters);
        } catch (error) {
            console.error("Erreur lors de la récupération des sources de données:", error);
            throw error;
        }
    }
}
