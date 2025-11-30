import type { IDataSourceRepository } from "../../ports/repositories/IDataSourceRepository";
import type { DataSource } from "../../entities/DataSource.entity";
import { DataSourceNotFoundError } from "../../errors/DomainError";

export class UpdateDataSourceUseCase {
    private dataSourceRepository: IDataSourceRepository;

    constructor(dataSourceRepository: IDataSourceRepository) {
        this.dataSourceRepository = dataSourceRepository;
    }

    async execute(id: string, updates: Partial<DataSource>): Promise<DataSource> {
        const existing = await this.dataSourceRepository.findById(id);

        if (!existing) {
            throw new DataSourceNotFoundError(id);
        }

        try {
            return await this.dataSourceRepository.update(id, updates);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la source:", error);
            throw error;
        }
    }
}
