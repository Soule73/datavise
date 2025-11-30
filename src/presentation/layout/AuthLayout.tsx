
import { useUserStore } from '@stores/user';
import { type ReactNode } from 'react';
import { ErrorPage, Toast, Navbar, Sidebar } from '@datavise/ui';
import type { BreadcrumbItem } from '@datavise/ui';
import { useNotificationStore } from '@stores/notification';

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
    const hasPermission = useUserStore((s) => s.hasPermission);
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
            <Toast
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
