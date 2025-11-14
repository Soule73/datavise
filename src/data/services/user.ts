import api from "@services/api";
import { extractApiData } from "@utils/apiUtils";
import type { ApiResponse } from "@type/api";
import type { User, Role } from "@type/authTypes";

export async function fetchUsers(): Promise<User[]> {
  const res = await api.get<ApiResponse<User[]>>("/v1/auth/users");
  return extractApiData(res);
}

export async function createRole(payload: Omit<Role, '_id' | 'canDelete'>): Promise<Role> {
  const res = await api.post<ApiResponse<Role>>("/v1/auth/roles", payload);
  return extractApiData(res);
}

export async function createUser(payload: Omit<User, '_id'> & { password: string; roleId: string }): Promise<User> {
  const res = await api.post<ApiResponse<User>>("/v1/auth/users", payload);
  return extractApiData<User>(res);
}

export async function updateUser(id: string, payload: Partial<User> & { password?: string; roleId?: string }): Promise<User> {
  const res = await api.put<ApiResponse<User>>(`/v1/auth/users/${id}`, payload);
  return extractApiData<User>(res);
}

export async function deleteUser(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<{ message: string }>>(`/v1/auth/users/${id}`);
  return extractApiData(res);
}
