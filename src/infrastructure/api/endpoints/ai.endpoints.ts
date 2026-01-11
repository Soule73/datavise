const AI_BASE = "/v1/ai";

export const AI_WIDGET_ENDPOINTS = {
    generate: `${AI_BASE}/generations`,
    analyze: `${AI_BASE}/analysis`,
    refine: `${AI_BASE}/refinements`,
};

export const AI_CONVERSATION_ENDPOINTS = {
    list: `${AI_BASE}/conversations`,
    byId: (id: string) => `${AI_BASE}/conversations/${id}`,
    create: `${AI_BASE}/conversations`,
    addMessage: (id: string) => `${AI_BASE}/conversations/${id}/messages`,
    updateTitle: (id: string) => `${AI_BASE}/conversations/${id}`,
    delete: (id: string) => `${AI_BASE}/conversations/${id}`,
};
