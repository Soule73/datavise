export const AUTH_ENDPOINTS = {
    login: "/v1/auth/login",
    register: "/v1/auth/register",
} as const;

export const USER_ENDPOINTS = {
    list: "/v1/auth/users",
    byId: (id: string) => `/v1/auth/users/${id}`,
    create: "/v1/auth/users",
    update: (id: string) => `/v1/auth/users/${id}`,
    delete: (id: string) => `/v1/auth/users/${id}`,
} as const;

export const ROLE_ENDPOINTS = {
    list: "/v1/auth/roles",
    byId: (id: string) => `/v1/auth/roles/${id}`,
    create: "/v1/auth/roles",
    update: (id: string) => `/v1/auth/roles/${id}`,
    delete: (id: string) => `/v1/auth/roles/${id}`,
    permissions: "/v1/auth/permissions",
} as const;
