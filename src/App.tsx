import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@pages/auth/LoginPage";
import Register from "@pages/auth/RegisterPage";
import SourcesPage from "@pages/datasource/SourceListPage";
import AddSourcePage from "@pages/datasource/AddSourcePage";
import EditSourcePage from "@pages/datasource/EditSourcePage";
import { useUserStore } from "@store/user";
import { ROUTES } from "@constants/routes";
import WidgetListPage from "@pages/widget/WidgetListPage";
import WidgetCreatePage from "@pages/widget/WidgetCreatePage";
import RoleManagementPage from "@pages/auth/RoleManagementPage";
import RoleCreatePage from "@pages/auth/RoleCreatePage";
import UserManagementPage from "@pages/auth/UserManagementPage";
import DashboardPage from "@pages/dashboard/DashboardPage";
import DashboardListPage from "@pages/dashboard/DashboardListPage";
import WidgetEditPage from "@pages/widget/WidgetEditPage";
import AppLoader from "@components/layouts/AppLoader";
import DashboardSharePage from "@pages/dashboard/DashboardSharePage";
import LandingPage from "@pages/LandingPage";
import DocumentationPage from "@pages/DocumentationPage";
import AIBuilderPage from "@pages/ai/AIBuilderPage";

const App: React.FC = () => {
  const user = useUserStore((s) => s.user);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
      const currentUser = useUserStore.getState().user;
      const isDashboardShare = /^\/dashboard\/share\//.test(
        window.location.pathname
      );
      if (
        (currentUser === null || currentUser === undefined) &&
        window.location.pathname !== ROUTES.login &&
        window.location.pathname !== ROUTES.register &&
        !isDashboardShare
      ) {

        window.location.replace(ROUTES.login);

      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (
    (user === undefined || user === null || showLoader) &&
    window.location.pathname !== ROUTES.login &&
    window.location.pathname !== ROUTES.register &&
    !/^\/dashboard\/share\//.test(window.location.pathname)
  ) {
    return <AppLoader />;
  }
  return (
    <BrowserRouter>
      <Routes>

        {/* Documentation et Landing Page en cours de développement */}
        {import.meta.env.DEV && (
          <>
            <Route path={ROUTES.home} element={<LandingPage />} />
            <Route path={ROUTES.docs} element={<DocumentationPage />} />
            <Route path={ROUTES.docsSection} element={<DocumentationPage />} />
            <Route path={ROUTES.docsPage} element={<DocumentationPage />} />
          </>
        )}

        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.register} element={<Register />} />
        <Route
          path={ROUTES.dashboards}
          element={<DashboardListPage />}
        />
        <Route
          path={ROUTES.dashboardDetail}
          element={<DashboardPage />}
        />
        <Route
          path={ROUTES.dashboard}
          element={<Navigate to={ROUTES.dashboards} replace />}
        />
        <Route
          path={ROUTES.sources}
          element={<SourcesPage />}
        />
        <Route
          path={ROUTES.addSource}
          element={<AddSourcePage />}
        />
        <Route
          path={ROUTES.editSource}
          element={<EditSourcePage />}
        />
        <Route
          path={ROUTES.widgets}
          element={<WidgetListPage />}
        />
        <Route
          path={ROUTES.createWidget}
          element={<WidgetCreatePage />}
        />
        <Route
          path={ROUTES.aiBuilder}
          element={<AIBuilderPage />}
        />
        <Route
          path={ROUTES.roles}
          element={<RoleManagementPage />}
        />
        <Route
          path={ROUTES.createRole}
          element={<RoleCreatePage />}
        />
        <Route
          path={ROUTES.users}
          element={<UserManagementPage />}
        />
        <Route
          path={ROUTES.editWidget}
          element={<WidgetEditPage />}
        />
        <Route path={ROUTES.dashboardShare} element={<DashboardSharePage />} />
        {/* <Route path="/" element={<Navigate to={ROUTES.dashboard} replace />} /> */}
        <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
