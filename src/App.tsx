import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@pages/auth/LoginPage";
import Register from "@pages/auth/RegisterPage";
import SourcesPage from "@pages/datasource/SourceListPage";
import AddSourcePage from "@pages/datasource/AddSourcePage";
import EditSourcePage from "@pages/datasource/EditSourcePage";
import { ROUTES } from "@constants/routes";
import WidgetListPage from "@pages/widget/WidgetListPage";
import WidgetCreatePage from "@pages/widget/WidgetCreatePage";
import RoleManagementPage from "@pages/auth/RoleManagementPage";
import RoleCreatePage from "@pages/auth/RoleCreatePage";
import UserManagementPage from "@pages/auth/UserManagementPage";
import DashboardPage from "@pages/dashboard/DashboardPage";
import DashboardListPage from "@pages/dashboard/DashboardListPage";
import WidgetEditPage from "@pages/widget/WidgetEditPage";
import DashboardSharePage from "@pages/dashboard/DashboardSharePage";
import LandingPage from "@pages/LandingPage";
import DocumentationPage from "@pages/DocumentationPage";
import AIBuilderPage from "@pages/ai/AIBuilderPage";
import { ProtectedRoute } from "@/presentation/components/auth/ProtectedRoute";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.register} element={<Register />} />
        <Route path={ROUTES.dashboardShare} element={<DashboardSharePage />} />

        {/* Documentation et Landing Page en cours de développement */}
        {import.meta.env.DEV && (
          <>
            <Route path={ROUTES.home} element={<LandingPage />} />
            <Route path={ROUTES.docs} element={<DocumentationPage />} />
            <Route path={ROUTES.docsSection} element={<DocumentationPage />} />
            <Route path={ROUTES.docsPage} element={<DocumentationPage />} />
          </>
        )}

        {/* Routes protégées */}
        <Route
          path={ROUTES.dashboards}
          element={
            <ProtectedRoute>
              <DashboardListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.dashboardDetail}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.dashboard}
          element={<Navigate to={ROUTES.dashboards} replace />}
        />
        <Route
          path={ROUTES.sources}
          element={
            <ProtectedRoute>
              <SourcesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.addSource}
          element={
            <ProtectedRoute>
              <AddSourcePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.editSource}
          element={
            <ProtectedRoute>
              <EditSourcePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.widgets}
          element={
            <ProtectedRoute>
              <WidgetListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.createWidget}
          element={
            <ProtectedRoute>
              <WidgetCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.aiBuilder}
          element={
            <ProtectedRoute>
              <AIBuilderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.roles}
          element={
            <ProtectedRoute>
              <RoleManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.createRole}
          element={
            <ProtectedRoute>
              <RoleCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.users}
          element={
            <ProtectedRoute>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.editWidget}
          element={
            <ProtectedRoute>
              <WidgetEditPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={ROUTES.dashboards} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
