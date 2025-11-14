import type { ApiError, ApiSuccess, ApiResponse } from "@type/api";

export function extractApiError(err: ApiError): string {
  if (err.error?.message) return err.error.message;
  if (err.error?.details) {
    if (typeof err.error.details === "string") return err.error.details;
    if (typeof err.error.details === "object") {
      return Object.values(err.error.details).join(", ");
    }
  }
  return "Erreur inconnue";
}

export function extractApiData<T>(res: { data: ApiResponse<T> }): T {
  const response = res.data;

  if (response.success === false) {
    throw new Error(extractApiError(response as ApiError));
  }

  return (response as ApiSuccess<T>).data;
}
