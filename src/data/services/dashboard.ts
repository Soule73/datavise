/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DashboardLayoutItem } from "@type/dashboardTypes";
import type { Dashboard } from "@type/dashboardTypes";
import type { ApiResponse } from "@type/api";
import api from "@services/api";
import { extractApiData } from "@utils/apiUtils";

export async function fetchDashboard(id?: string): Promise<Dashboard> {
  const res = await api.get<ApiResponse<Dashboard>>(`/v1/dashboards/${id}`);
  return extractApiData(res);
}

export async function saveDashboardLayout(
  dashboardId: string,
  layout: DashboardLayoutItem[],
  title?: string,
  config?: {
    autoRefreshIntervalValue?: number;
    autoRefreshIntervalUnit?: string;
    timeRange?: any;
    visibility?: "public" | "private";
  }
): Promise<Dashboard> {
  const res = await api.patch<ApiResponse<Dashboard>>(
    `/v1/dashboards/${dashboardId}`,
    {
      layout,
      ...(title ? { title } : {}),
      ...config,
    }
  );
  return extractApiData(res);
}

export async function fetchDashboards(): Promise<Dashboard[]> {
  const res = await api.get<ApiResponse<Dashboard[]>>("/v1/dashboards");
  return extractApiData(res);
}

export async function createDashboard(data: {
  title: string;
  layout?: DashboardLayoutItem[];
  visibility?: "public" | "private";
}): Promise<Dashboard> {
  const res = await api.post<ApiResponse<Dashboard>>("/v1/dashboards", data);
  return extractApiData(res);
}

export async function enableDashboardShare(
  dashboardId: string
): Promise<{ shareId: string }> {
  const res = await api.patch<ApiResponse<{ shareId: string }>>(
    `/v1/dashboards/${dashboardId}/sharing`,
    { isShared: true }
  );
  return extractApiData(res);
}

export async function disableDashboardShare(
  dashboardId: string
): Promise<{ success: boolean }> {
  const res = await api.patch<ApiResponse<{ success: boolean }>>(
    `/v1/dashboards/${dashboardId}/sharing`,
    { isShared: false }
  );
  return extractApiData(res);
}

export async function fetchSharedDashboard(
  shareId: string
): Promise<Dashboard> {
  const res = await api.get<ApiResponse<Dashboard>>(
    `/v1/dashboards/shared/${shareId}`
  );
  return extractApiData(res);
}

export async function fetchSharedDashboardSources(shareId: string) {
  const res = await api.get<ApiResponse<any[]>>(
    `/v1/dashboards/shared/${shareId}/sources`
  );
  return extractApiData(res);
}

export async function deleteDashboard(
  dashboardId: string
): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<{ message: string }>>(
    `/v1/dashboards/${dashboardId}`
  );
  return extractApiData(res);
}
