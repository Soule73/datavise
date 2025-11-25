import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StateCreator } from "zustand";
import type { User } from "@domain/entities/User.entity";
import type { Permission } from "@domain/value-objects/Permission.vo";

interface UserStoreWithPerms {
  user: User | null;
  token: string | null;
  setUser: (user: User | null, token: string) => void;
  logout: () => void;
  getPermissions: () => string[];
  hasPermission: (permName: string) => boolean;
  isOwner: (ownerId: string) => boolean;
  isTokenExpired: () => boolean;
}

function getPermissionList(user: User | null): string[] {
  if (!user || !user.role || !user.role.permissions) return [];
  return user.role.permissions.map((p: Permission) => p.name);
}

function isJWTExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    return Date.now() >= expirationTime;
  } catch {
    return true;
  }
}

export const useUserStore = create<UserStoreWithPerms>(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setUser: (user, token) => {
        set({ user, token });
      },
      logout: () => {
        set({ user: null, token: null });
      },
      getPermissions: () => getPermissionList(get().user),
      hasPermission: (permName: string) => {
        const can = getPermissionList(get().user).includes(permName);
        return can;
      },
      isOwner: (ownerId: string) => {
        const user = get().user;
        if (!user || !user.id) return false;
        return user.id === ownerId;
      },
      isTokenExpired: () => {
        return isJWTExpired(get().token);
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  ) as StateCreator<UserStoreWithPerms, [], [], UserStoreWithPerms>
);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "user-store") {
      const state = useUserStore.getState();
      if (!state.token || state.isTokenExpired()) {
        useUserStore.getState().logout();
      }
    }
  });
}
