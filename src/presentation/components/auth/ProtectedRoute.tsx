import { Navigate } from "react-router-dom";
import { useUserStore } from "@store/user";
import { ROUTES } from "@constants/routes";
import { useEffect } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const user = useUserStore((s) => s.user);
    const token = useUserStore((s) => s.token);
    const isTokenExpired = useUserStore((s) => s.isTokenExpired);
    const logout = useUserStore((s) => s.logout);

    useEffect(() => {
        if ((user || token) && isTokenExpired()) {
            logout();
        }
    }, [user, token, isTokenExpired, logout]);

    if (!user || !token || isTokenExpired()) {
        return <Navigate to={ROUTES.login} replace />;
    }

    return <>{children}</>;
};
