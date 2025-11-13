
import { ROUTES } from '@/core/constants/routes';
import { useUserStore } from '@/core/store/user';
import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import ErrorPage from './ErrorPage';
import { useNotificationStore } from '@/core/store/notification';
import Notification from "@components/Notification";
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import type { BreadcrumbItem } from './Breadcrumb';

export interface AuthLayoutProps {
    hideSidebar?: boolean;
    hideNavbar?: boolean;
    hideUserInfo?: boolean;
    children: ReactNode;
    permission?: string;
    breadcrumb?: BreadcrumbItem[];

}

function AuthLayout({
    hideSidebar = false,
    hideNavbar = false,
    hideUserInfo = false,
    children,
    permission,
    breadcrumb,
}: AuthLayoutProps) {
    const user = useUserStore((s) => s.user);
    const hasPermission = useUserStore((s) => s.hasPermission);
    if (!user) return <Navigate to={ROUTES.login} replace />;

    const notif = useNotificationStore((s) => s.notification);
    const closeNotif = useNotificationStore((s) => s.closeNotification);
    if (permission && !hasPermission(permission)) {
        return (
            <ErrorPage
                code={403}
                title="Accès refusé"
                message="Vous n'avez pas les permissions nécessaires pour accéder à cette page."
            />
        );
    }
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800 transition-colors duration-300 pt-12 dark:text-white text-gray-900">
            <Notification
                open={notif.open}
                onClose={closeNotif}
                type={notif.type}
                title={notif.title}
                description={notif.description}
            />
            {!hideNavbar && <Navbar
                breadcrumb={breadcrumb}
                hideSidebar={hideSidebar}
                hideUserInfo={hideUserInfo} />}
            {!hideSidebar && <Sidebar />}
            {/* className="py-4 px-2 md:px-6 relative" */}
            <main>{children}</main>
        </div>
    );
}

export default AuthLayout;
