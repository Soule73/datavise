export interface PermissionDTO {
    _id: string;
    name: string;
    description?: string;
}

export interface RoleDTO {
    _id: string;
    name: string;
    description?: string;
    permissions: PermissionDTO[];
    canDelete?: boolean;
}

export interface UserDTO {
    _id: string;
    email: string;
    username: string;
    roleId?: {
        _id: string;
        name: string;
    };
    role?: RoleDTO;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoginResponseDTO {
    user: UserDTO;
    token: string;
}
