import api from "@services/api";
import { extractApiData } from "@utils/apiUtils";
import type { Widget } from "@type/widgetTypes";
import type { ApiResponse } from "@type/api";

export async function fetchWidgets(): Promise<Widget[]> {
  const response = await api.get<ApiResponse<Widget[]>>("/v1/widgets");
  return extractApiData(response);
}

export async function fetchWidgetById(id: string): Promise<Widget> {
  const response = await api.get<ApiResponse<Widget>>(`/v1/widgets/${id}`);
  return extractApiData(response);
}

export async function createWidget(payload: Partial<Widget>): Promise<Widget> {
  const response = await api.post<ApiResponse<Widget>>("/v1/widgets", payload);
  return extractApiData(response);
}

export async function updateWidget(
  id: string,
  payload: Partial<Widget>
): Promise<Widget> {
  const response = await api.patch<ApiResponse<Widget>>(
    `/v1/widgets/${id}`,
    payload
  );
  return extractApiData(response);
}

export async function deleteWidget(id: string): Promise<{ success: boolean }> {
  const response = await api.delete<ApiResponse<{ success: boolean }>>(
    `/v1/widgets/${id}`
  );
  return extractApiData(response);
}

/**
 * Récupère tous les widgets d'une conversation (drafts inclus)
 */
export async function fetchConversationWidgets(
  conversationId: string
): Promise<Widget[]> {
  const response = await api.get<ApiResponse<Widget[]>>(
    `/v1/widgets?conversationId=${conversationId}`
  );
  return extractApiData(response);
}

/**
 * Publie un widget draft (change isDraft à false)
 */
export async function publishWidget(widgetId: string): Promise<Widget> {
  const response = await api.patch<ApiResponse<Widget>>(
    `/v1/widgets/${widgetId}`,
    { isDraft: false }
  );
  return extractApiData(response);
}
