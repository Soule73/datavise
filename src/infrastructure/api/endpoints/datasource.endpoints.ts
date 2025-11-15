export const DATASOURCE_ENDPOINTS = {
    list: "/v1/data-sources",
    byId: (id: string) => `/v1/data-sources/${id}`,
    create: "/v1/data-sources",
    update: (id: string) => `/v1/data-sources/${id}`,
    delete: (id: string) => `/v1/data-sources/${id}`,
    detectColumns: "/v1/data-sources/detect-columns",
    fetchData: (id: string) => `/v1/data-sources/${id}/data`,
};
