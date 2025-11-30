import type { AuthType } from "./AuthType";
import type { HttpMethod } from "./HttpMethod";

/**
 * Configuration de connexion pour les sources de données distantes
 */
export interface ConnectionConfig {
    httpMethod?: HttpMethod;
    authType?: AuthType;
    authConfig?: {
        token?: string;
        apiKey?: string;
        username?: string;
        password?: string;
        headerName?: string;
    };
    esIndex?: string;
    esQuery?: string;
}

/**
 * Factory pour créer une configuration de connexion avec valeurs par défaut
 */
export function createConnectionConfig(
    partial?: Partial<ConnectionConfig>
): ConnectionConfig {
    return {
        httpMethod: partial?.httpMethod ?? "GET",
        authType: partial?.authType ?? "none",
        authConfig: partial?.authConfig ?? {},
        esIndex: partial?.esIndex,
        esQuery: partial?.esQuery,
    };
}
