const BASE_PATH = "/v1";

export const WIDGET_ENDPOINTS = {
    list: `${BASE_PATH}/widgets`,
    byId: (id: string) => `${BASE_PATH}/widgets/${id}`,
    create: `${BASE_PATH}/widgets`,
    update: (id: string) => `${BASE_PATH}/widgets/${id}`,
    delete: (id: string) => `${BASE_PATH}/widgets/${id}`,
    byConversation: (conversationId: string) => `${BASE_PATH}/widgets?conversationId=${conversationId}`,
    publish: (id: string) => `${BASE_PATH}/widgets/${id}/publish`,
};
