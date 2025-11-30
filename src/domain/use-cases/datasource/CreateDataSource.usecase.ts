import type { IDataSourceRepository } from "../../ports/repositories/IDataSourceRepository";
import type { DataSource } from "../../entities/DataSource.entity";

export class CreateDataSourceUseCase {
    private dataSourceRepository: IDataSourceRepository;

    constructor(dataSourceRepository: IDataSourceRepository) {
        this.dataSourceRepository = dataSourceRepository;
    }

    async execute(
        dataSource: Omit<DataSource, "id" | "ownerId" | "createdAt" | "updatedAt">,
        file?: File
    ): Promise<DataSource> {
        try {
            return await this.dataSourceRepository.create(dataSource, file);
        } catch (error) {
            console.error("Erreur lors de la création de la source:", error);
            throw error;
        }
    }
}
