import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WidgetRepository } from "@/infrastructure/repositories/WidgetRepository";
import { CreateWidgetUseCase, type CreateWidgetInput } from "@/domain/use-cases/widget/CreateWidget.usecase";
import { UpdateWidgetUseCase, type UpdateWidgetInput } from "@/domain/use-cases/widget/UpdateWidget.usecase";
import { GetWidgetUseCase } from "@/domain/use-cases/widget/GetWidget.usecase";
import { useNotificationStore } from "@/core/store/notification";
import { ROUTES } from "@/core/constants/routes";
import { useCommonWidgetForm, type WidgetFormInitialValues } from "@/application/hooks/widget/useCommonWidgetForm";
import type { Widget } from "@/domain/entities/Widget.entity";
import type { WidgetConfig } from "@/domain/value-objects";

const widgetRepository = new WidgetRepository();
const createWidgetUseCase = new CreateWidgetUseCase(widgetRepository);
const updateWidgetUseCase = new UpdateWidgetUseCase(widgetRepository);
const getWidgetUseCase = new GetWidgetUseCase(widgetRepository);

export function useWidgetCreate(initialValues?: WidgetFormInitialValues) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const showNotification = useNotificationStore((s) => s.showNotification);

    const form = useCommonWidgetForm(initialValues);

    const createMutation = useMutation({
        mutationFn: (input: CreateWidgetInput) => createWidgetUseCase.execute(input),
        onSuccess: (widget) => {
            queryClient.invalidateQueries({ queryKey: ["widgets"] });
            showNotification({
                open: true,
                type: "success",
                title: "Succès",
                description: "Widget créé avec succès ! Redirection...",
            });
            setTimeout(() => {
                navigate(ROUTES.editWidget.replace(":id", widget.id));
            }, 1000);
        },
        onError: (error: Error) => {
            showNotification({
                open: true,
                type: "error",
                title: "Erreur",
                description: error.message || "Erreur lors de la création du widget",
            });
        },
    });

    const handleCreate = () => {
        if (!form.widgetTitle.trim()) {
            form.setWidgetTitleError("Le titre est requis");
            return;
        }

        form.setShowSaveModal(false);

        const payload: CreateWidgetInput = {
            title: form.widgetTitle.trim(),
            type: form.type,
            dataSourceId: form.sourceId,
            config: form.config,
            visibility: form.visibility,
        };

        createMutation.mutate(payload);
    };

    return {
        ...form,
        createMutation,
        handleCreate,
    };
}

export function useWidgetEdit() {
    const { id: widgetId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const showNotification = useNotificationStore((s) => s.showNotification);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [widget, setWidget] = useState<Widget | null>(null);
    const [formReady, setFormReady] = useState(false);

    const [initialValues, setInitialValues] = useState<WidgetFormInitialValues | undefined>(undefined);

    const form = useCommonWidgetForm(initialValues);

    const loadWidget = async () => {
        if (!widgetId) {
            setError("ID du widget manquant");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const widgetData = await getWidgetUseCase.execute(widgetId);
            if (!widgetData) {
                setError("Widget non trouvé");
                setLoading(false);
                return;
            }

            setWidget(widgetData);

            setInitialValues({
                type: widgetData.type as WidgetFormInitialValues["type"],
                config: widgetData.config as WidgetConfig,
                title: widgetData.title,
                sourceId: widgetData.dataSourceId,
                visibility: widgetData.visibility,
                disableAutoConfig: true,
            });

            setFormReady(true);
        } catch (err) {
            setError("Impossible de charger le widget");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: UpdateWidgetInput }) =>
            updateWidgetUseCase.execute(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["widgets"] });
            queryClient.invalidateQueries({ queryKey: ["widgets", widgetId] });
            showNotification({
                open: true,
                type: "success",
                title: "Succès",
                description: "Widget modifié avec succès !",
            });
            navigate(ROUTES.widgets);
        },
        onError: (error: Error) => {
            showNotification({
                open: true,
                type: "error",
                title: "Erreur",
                description: error.message || "Erreur lors de la modification du widget",
            });
        },
    });

    const handleSave = () => {
        if (!form.widgetTitle.trim()) {
            form.setWidgetTitleError("Le titre est requis");
            return;
        }

        if (!widgetId) return;

        form.setShowSaveModal(false);

        const updates: UpdateWidgetInput = {
            title: form.widgetTitle.trim(),
            visibility: form.visibility,
            config: form.config as WidgetConfig,
        };

        updateMutation.mutate({ id: widgetId, updates });
    };

    const handleConfirmSave = () => {
        if (!form.widgetTitle.trim()) {
            form.setWidgetTitleError("Le titre est requis");
            return;
        }
        form.setShowSaveModal(false);
        handleSave();
    };

    return {
        loading,
        error,
        widget,
        formReady,
        form,
        loadWidget,
        handleSave,
        handleConfirmSave,
        updateMutation,
    };
}
