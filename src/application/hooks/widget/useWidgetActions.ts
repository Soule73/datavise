import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WidgetRepository } from "@/infrastructure/repositories/WidgetRepository";
import { CreateWidgetUseCase, type CreateWidgetInput } from "@domain/use-cases/widget/CreateWidget.usecase";
import { UpdateWidgetUseCase, type UpdateWidgetInput } from "@domain/use-cases/widget/UpdateWidget.usecase";
import { GetWidgetUseCase } from "@domain/use-cases/widget/GetWidget.usecase";
import { useNotificationStore } from "@stores/notification";
import { ROUTES } from "@/core/constants/routes";
import type { Widget } from "@domain/entities/Widget.entity";
import type { WidgetConfig, WidgetType } from "@domain/value-objects";
import { useWidgetForm } from "@hooks/widget/useWidgetForm";
import { useWidgetFormStore } from "@stores/widgetFormStore";

interface WidgetFormInitialValues {
    type: WidgetType;
    config?: WidgetConfig;
    title?: string;
    sourceId?: string;
    visibility?: "public" | "private";
    disableAutoConfig?: boolean;
}

const widgetRepository = new WidgetRepository();
const createWidgetUseCase = new CreateWidgetUseCase(widgetRepository);
const updateWidgetUseCase = new UpdateWidgetUseCase(widgetRepository);
const getWidgetUseCase = new GetWidgetUseCase(widgetRepository);

export function useWidgetCreate(initialValues?: WidgetFormInitialValues) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const showNotification = useNotificationStore((s) => s.showNotification);

    const {
        widgetTitle,
        setWidgetTitleError,
        setShowSaveModal,
        type,
        sourceId,
        config,
        visibility,
    } = useWidgetForm();

    useEffect(() => {
        if (initialValues) {
            const { initializeForm, loadSourceData } = useWidgetFormStore.getState();
            initializeForm(initialValues);

            if (initialValues.sourceId) {
                loadSourceData(initialValues.sourceId);
            }
        }
    }, []);

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
        if (!widgetTitle.trim()) {
            setWidgetTitleError("Le titre est requis");
            return;
        }

        setShowSaveModal(false);

        const payload: CreateWidgetInput = {
            title: widgetTitle.trim(),
            type,
            dataSourceId: sourceId,
            config,
            visibility,
        };

        createMutation.mutate(payload);
    };

    return {
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

    const {
        widgetTitle,
        setWidgetTitleError,
        setShowSaveModal,
        visibility,
        config,
    } = useWidgetForm();

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

            const { initializeForm, loadSourceData } = useWidgetFormStore.getState();
            initializeForm({
                type: widgetData.type as WidgetFormInitialValues["type"],
                config: widgetData.config as WidgetConfig,
                title: widgetData.title,
                sourceId: widgetData.dataSourceId,
                visibility: widgetData.visibility,
            });

            if (widgetData.dataSourceId) {
                await loadSourceData(widgetData.dataSourceId);
            }

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
        if (!widgetTitle.trim()) {
            setWidgetTitleError("Le titre est requis");
            return;
        }

        if (!widgetId) return;

        setShowSaveModal(false);

        const updates: UpdateWidgetInput = {
            title: widgetTitle.trim(),
            visibility,
            config: config as WidgetConfig,
        };

        updateMutation.mutate({ id: widgetId, updates });
    };

    const handleConfirmSave = () => {
        if (!widgetTitle.trim()) {
            setWidgetTitleError("Le titre est requis");
            return;
        }
        setShowSaveModal(false);
        handleSave();
    };

    return {
        loading,
        error,
        widget,
        formReady,
        loadWidget,
        handleSave,
        handleConfirmSave,
        updateMutation,
    };
}
