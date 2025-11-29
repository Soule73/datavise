import { type BreadcrumbItem } from "@/presentation/components/shared/layouts/Breadcrumb";
import { ROUTES } from "../constants/routes";

const breadcrumbs = {
    dashboardList: [
        { label: "Tableaux de bord", href: ROUTES.dashboards },
    ],
    showDashboard: (dashboardTitle: string): BreadcrumbItem[] => [
        { label: "Tableaux de bord", href: ROUTES.dashboards },
        { label: dashboardTitle },
    ],
    createDashboard: [
        { label: "Tableaux de bord", href: ROUTES.dashboards },
        { label: "Créer" },
    ],
    editDashboard: (dashboardTitle: string): BreadcrumbItem[] => [
        { label: "Tableaux de bord", href: ROUTES.dashboards },
        { label: "Modifier" },
        { label: dashboardTitle },
    ],
    widgetList: [
        { label: "Visualisations", href: ROUTES.widgets },
    ],
    widgetCreate: [
        { label: "Visualisations", href: ROUTES.widgets },
        { label: "Créer" },
    ],
    widgetEdit: (widgetTitle: string): BreadcrumbItem[] => [
        { label: "Visualisations", href: ROUTES.widgets },
        { label: "Modifier" },
        { label: widgetTitle },
    ],
    datasourceList: [
        { label: "Sources", href: ROUTES.sources },
    ],
    datasourceCreate: [
        { label: "Sources", href: ROUTES.sources },
        { label: "Ajouter une source" },
    ],
    datasourceEdit: (sourceName: string): BreadcrumbItem[] => [
        { label: "Sources", href: ROUTES.sources },
        { label: "Modifier" },
        { label: sourceName },
    ],
    roleList: [
        { label: "Rôles", href: ROUTES.roles },
    ],
    userList: [
        { label: "Utilisateurs", href: ROUTES.users },
    ],
    roleCreate: [
        { label: "Rôles", href: ROUTES.roles },
        { label: "Créer un rôle" },
    ],
    roleEdit: (roleName: string): BreadcrumbItem[] => [
        { label: "Rôles", href: ROUTES.roles },
        { label: "Modifier" },
        { label: roleName },
    ],


}

export default breadcrumbs;