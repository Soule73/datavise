import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from '../user';

describe('UserStore - Authentification', () => {
    beforeEach(() => {
        useUserStore.setState({ user: null, token: null });
        localStorage.clear();
    });

    describe('setUser', () => {
        it('devrait définir user et token', () => {
            const mockUser = {
                id: '1',
                username: 'testuser',
                email: 'test@example.com',
                role: {
                    id: '1',
                    name: 'Admin',
                    permissions: [{ id: '1', name: 'dashboard:canCreate' }],
                },
            };
            const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJleHAiOjk5OTk5OTk5OTl9.test';

            useUserStore.getState().setUser(mockUser as any, mockToken);

            expect(useUserStore.getState().user).toEqual(mockUser);
            expect(useUserStore.getState().token).toBe(mockToken);
        });
    });

    describe('logout', () => {
        it('devrait réinitialiser user et token', () => {
            const mockUser = {
                id: '1',
                username: 'testuser',
                email: 'test@example.com',
                role: {
                    id: '1',
                    name: 'Admin',
                    permissions: [],
                },
            };
            const mockToken = 'token123';

            useUserStore.getState().setUser(mockUser as any, mockToken);
            useUserStore.getState().logout();

            expect(useUserStore.getState().user).toBeNull();
            expect(useUserStore.getState().token).toBeNull();
        });
    });

    describe('hasPermission', () => {
        it('devrait retourner true si user a la permission', () => {
            const mockUser = {
                id: '1',
                username: 'testuser',
                email: 'test@example.com',
                role: {
                    id: '1',
                    name: 'Admin',
                    permissions: [{ id: '1', name: 'dashboard:canCreate' }],
                },
            };
            const mockToken = 'token123';

            useUserStore.getState().setUser(mockUser as any, mockToken);

            expect(useUserStore.getState().hasPermission('dashboard:canCreate')).toBe(true);
        });

        it('devrait retourner false si user n\'a pas la permission', () => {
            const mockUser = {
                id: '1',
                username: 'testuser',
                email: 'test@example.com',
                role: {
                    id: '1',
                    name: 'Viewer',
                    permissions: [{ id: '1', name: 'dashboard:canView' }],
                },
            };
            const mockToken = 'token123';

            useUserStore.getState().setUser(mockUser as any, mockToken);

            expect(useUserStore.getState().hasPermission('dashboard:canCreate')).toBe(false);
        });

        it('devrait retourner false si pas de user', () => {
            expect(useUserStore.getState().hasPermission('dashboard:canCreate')).toBe(false);
        });
    });

    describe('isTokenExpired', () => {
        it('devrait retourner true si pas de token', () => {
            expect(useUserStore.getState().isTokenExpired()).toBe(true);
        });

        it('devrait retourner true pour token expiré', () => {
            const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJleHAiOjE2MDAwMDAwMDB9.test';
            const mockUser = { id: '1', username: 'test', email: 'test@test.com', role: { id: '1', name: 'User', permissions: [] } };

            useUserStore.getState().setUser(mockUser as any, expiredToken);

            expect(useUserStore.getState().isTokenExpired()).toBe(true);
        });

        it('devrait retourner false pour token valide', () => {
            const futureTimestamp = Math.floor(Date.now() / 1000) + 3600;
            const validToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ id: '1', exp: futureTimestamp }))}.test`;
            const mockUser = { id: '1', username: 'test', email: 'test@test.com', role: { id: '1', name: 'User', permissions: [] } };

            useUserStore.getState().setUser(mockUser as any, validToken);

            expect(useUserStore.getState().isTokenExpired()).toBe(false);
        });

        it('devrait retourner true pour token invalide (malformé)', () => {
            const invalidToken = 'invalid-token';
            const mockUser = { id: '1', username: 'test', email: 'test@test.com', role: { id: '1', name: 'User', permissions: [] } };

            useUserStore.getState().setUser(mockUser as any, invalidToken);

            expect(useUserStore.getState().isTokenExpired()).toBe(true);
        });
    });

    describe('isOwner', () => {
        it('devrait retourner true si user est le propriétaire', () => {
            const mockUser = {
                id: 'user123',
                username: 'testuser',
                email: 'test@example.com',
                role: {
                    id: '1',
                    name: 'User',
                    permissions: [],
                },
            };
            const mockToken = 'token123';

            useUserStore.getState().setUser(mockUser as any, mockToken);

            expect(useUserStore.getState().isOwner('user123')).toBe(true);
        });

        it('devrait retourner false si user n\'est pas le propriétaire', () => {
            const mockUser = {
                id: 'user123',
                username: 'testuser',
                email: 'test@example.com',
                role: {
                    id: '1',
                    name: 'User',
                    permissions: [],
                },
            };
            const mockToken = 'token123';

            useUserStore.getState().setUser(mockUser as any, mockToken);

            expect(useUserStore.getState().isOwner('user456')).toBe(false);
        });

        it('devrait retourner false si pas de user', () => {
            expect(useUserStore.getState().isOwner('user123')).toBe(false);
        });
    });

    describe('getPermissions', () => {
        it('devrait retourner la liste des permissions', () => {
            const mockUser = {
                id: '1',
                username: 'testuser',
                email: 'test@example.com',
                role: {
                    id: '1',
                    name: 'Admin',
                    permissions: [
                        { id: '1', name: 'dashboard:canCreate' },
                        { id: '2', name: 'dashboard:canDelete' },
                    ],
                },
            };
            const mockToken = 'token123';

            useUserStore.getState().setUser(mockUser as any, mockToken);

            expect(useUserStore.getState().getPermissions()).toEqual([
                'dashboard:canCreate',
                'dashboard:canDelete',
            ]);
        });

        it('devrait retourner tableau vide si pas de user', () => {
            expect(useUserStore.getState().getPermissions()).toEqual([]);
        });

        it('devrait retourner tableau vide si pas de permissions', () => {
            const mockUser = {
                id: '1',
                username: 'testuser',
                email: 'test@example.com',
                role: {
                    id: '1',
                    name: 'User',
                    permissions: [],
                },
            };
            const mockToken = 'token123';

            useUserStore.getState().setUser(mockUser as any, mockToken);

            expect(useUserStore.getState().getPermissions()).toEqual([]);
        });
    });
});
