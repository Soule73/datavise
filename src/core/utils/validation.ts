/**
 * Valide si une chaîne est un ObjectId MongoDB valide (24 caractères hexadécimaux)
 * @param id - L'ID à valider
 * @returns true si l'ID est un ObjectId valide, false sinon
 */
export function isValidObjectId(id: string | null | undefined): boolean {
    if (!id) return false;
    return /^[0-9a-fA-F]{24}$/.test(id);
}
