import type { IDataSourceRepository } from "../../ports/repositories/IDataSourceRepository";
import { DataSourceNotFoundError } from "../../errors/DomainError";

export class DeleteDataSourceUseCase {
    private dataSourceRepository: IDataSourceRepository;

    constructor(dataSourceRepository: IDataSourceRepository) {
        this.dataSourceRepository = dataSourceRepository;
    }

    async execute(id: string): Promise<void> {
        const dataSource = await this.dataSourceRepository.findById(id);

        if (!dataSource) {
            throw new DataSourceNotFoundError(id);
        }

        if (!dataSource.canBeDeleted()) {
            throw new Error("Cette source de données est actuellement utilisée et ne peut pas être supprimée");
        }

        await this.dataSourceRepository.delete(id);
    }
}
