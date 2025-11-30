export interface Pagination {
    page: number;
    limit: number;
    total?: number;
    totalPages?: number;
}

export interface PaginatedResult<T> {
    data: T[];
    pagination: Pagination;
}

export function createPagination(
    page: number = 1,
    limit: number = 20
): Pagination {
    if (page < 1) {
        throw new Error("Page doit être >= 1");
    }
    if (limit < 1 || limit > 100) {
        throw new Error("Limit doit être entre 1 et 100");
    }
    return { page, limit };
}
