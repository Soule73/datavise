import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  useUpdateSourceMutation,
  useSourceByIdQuery,
} from "@/data/repositories/datasources";
import { useNotificationStore } from "@store/notification";
import { useSourceFormBase } from "@hooks/datasource/useSourceFormBase";
import type { SourceFormState } from "@type/dataSource";
import type { ApiError } from "@type/api";

export function useEditDataSourceForm() {
  const { id } = useParams<{ id: string }>();
  const {
    data: initial,
    isLoading,
    error: queryError,
  } = useSourceByIdQuery({ id });
  const navigate = useNavigate();
  const showNotification = useNotificationStore((s) => s.showNotification);
  const queryClient = useQueryClient();

  // Centralisation de la logique via useSourceFormBase
  const base = useSourceFormBase(initial);

  // Soumission finale (édition)
  const onSubmit = (data: SourceFormState) => {
    base.setGlobalError("");
    // Pour CSV uploadé, garder filePath, pour CSV distant ou JSON, garder endpoint
    const payload = {
      ...base.form,
      ...data,
      ...(initial?.type === "csv" && initial?.filePath
        ? { filePath: initial.filePath, endpoint: undefined }
        : {}),
      ...(initial?.type === "csv" && initial?.endpoint
        ? { endpoint: base.form.endpoint, filePath: undefined }
        : {}),
    };
    updateMutation.mutate({
      id: id || "",
      data: payload,
    });
  };

  // Mutation pour la mise à jour
  const updateMutation = useUpdateSourceMutation({
    queryClient,
    onSuccess: () => {
      showNotification({
        type: "success",
        title: "Source modifiée avec succès",
        open: true,
      });
      navigate("/sources");
    },
    onError: (e: ApiError) => {
      base.setGlobalError(
        e?.message ||
        "Erreur lors de la modification de la source"
      );
    },
  });

  return {
    ...base,
    onSubmit,
    isLoading,
    error: queryError,
  };
}
