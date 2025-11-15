export interface Permission {
    readonly id: string;
    readonly name: string;
    readonly description?: string;
}

export function createPermission(
    id: string,
    name: string,
    description?: string
): Permission {
    validatePermission(name);
    return { id, name, description };
}

export function validatePermission(name: string): void {
    if (!name || name.trim().length < 2) {
        throw new Error(
            "Le nom de la permission doit contenir au moins 2 caractères"
        );
    }
    if (name.length > 100) {
        throw new Error(
            "Le nom de la permission ne peut pas dépasser 100 caractères"
        );
    }
}
