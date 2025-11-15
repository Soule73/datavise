export const DASHBOARD_ENDPOINTS = {
    list: "/v1/dashboards",
    byId: (id: string) => `/v1/dashboards/${id}`,
    create: "/v1/dashboards",
    update: (id: string) => `/v1/dashboards/${id}`,
    delete: (id: string) => `/v1/dashboards/${id}`,
    enableShare: (id: string) => `/v1/dashboards/${id}/sharing`,
    disableShare: (id: string) => `/v1/dashboards/${id}/sharing`,
    byShareId: (shareId: string) => `/v1/dashboards/shared/${shareId}`,
    sharedSources: (shareId: string) => `/v1/dashboards/shared/${shareId}/sources`,
};
