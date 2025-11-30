import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { CreateDataSourceUseCase } from "@domain/use-cases/datasource/CreateDataSource.usecase";
import { UpdateDataSourceUseCase } from "@domain/use-cases/datasource/UpdateDataSource.usecase";
import { DataSourceRepository } from "@/infrastructure/repositories/DataSourceRepository";
import { useColumnDetection } from "./useColumnDetection";
import { useNotificationStore } from "@stores/notification";
import { ROUTES } from "@/core/constants/routes";
import type { DataSource } from "@domain/entities/DataSource.entity";
import type { DetectColumnsParams } from "@domain/ports/repositories/IDataSourceRepository";
import type { DataSourceType } from "@domain/value-objects";
import { createConnectionConfig } from "@domain/value-objects/datasource/ConnectionConfig.vo";

const dataSourceRepository = new DataSourceRepository();
const createDataSourceUseCase = new CreateDataSourceUseCase(dataSourceRepository);
const updateDataSourceUseCase = new UpdateDataSourceUseCase(dataSourceRepository);

interface DataSourceFormState {
    name: string;
    type: DataSourceType;
    endpoint?: string;
    visibility: "public" | "private";
    timestampField?: string;
    file?: File | null;
    httpMethod?: "GET" | "POST";
    authType?: "none" | "basic" | "bearer" | "apiKey";
    authConfig?: {
        token?: string;
        apiKey?: string;
        username?: string;
        password?: string;
        headerName?: string;
    };
    esIndex?: string;
    esQuery?: string;
}

export function useDataSourceForm(isEdit: boolean = false) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const showNotification = useNotificationStore((s) => s.showNotification);

    const { data: existingDataSource, isLoading: isLoadingExisting } = useQuery<DataSource>({
        queryKey: ["dataSource", id],
        queryFn: async () => {
            const source = await dataSourceRepository.findById(id!);
            if (!source) throw new Error("Source non trouvée");
            return source;
        },
        enabled: isEdit && !!id,
    });

    const [form, setForm] = useState<DataSourceFormState>({
        name: "",
        type: "json",
        visibility: "private",
        httpMethod: "GET",
        authType: "none",
        authConfig: {},
    });

    const [step, setStep] = useState(1);
    const [csvOrigin, setCsvOrigin] = useState<"url" | "upload">("url");
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [globalError, setGlobalError] = useState("");
    const [detectParams, setDetectParams] = useState<DetectColumnsParams | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [filePath, setFilePath] = useState("");
    const [showFileField, setShowFileField] = useState(false);

    const { detectionResult, isDetecting, detectionError } = useColumnDetection(detectParams, !!detectParams);

    useEffect(() => {
        if (existingDataSource) {
            setForm({
                name: existingDataSource.name,
                type: existingDataSource.type,
                visibility: existingDataSource.visibility,
                endpoint: existingDataSource.endpoint,
                timestampField: existingDataSource.timestampField,
                httpMethod: existingDataSource.connectionConfig?.httpMethod,
                authType: existingDataSource.connectionConfig?.authType,
                authConfig: existingDataSource.connectionConfig?.authConfig,
                esIndex: existingDataSource.connectionConfig?.esIndex,
                esQuery: existingDataSource.connectionConfig?.esQuery,
            });
        }
    }, [existingDataSource]);

    useEffect(() => {
        if (detectParams && !isDetecting && detectionResult) {
            setStep(2);
            if (detectionResult.suggestedTimestampField) {
                setForm((f) => ({ ...f, timestampField: detectionResult.suggestedTimestampField }));
            }
        }
    }, [detectParams, isDetecting, detectionResult]);

    const setFormField = (field: string, value: unknown) => {
        setForm((f) => ({ ...f, [field]: value }));
    };

    const handleNext = () => {
        setGlobalError("");

        const params: DetectColumnsParams = {
            type: form.type,
            csvOrigin,
            csvFile,
            endpoint: form.endpoint,
            httpMethod: form.httpMethod,
            authType: form.authType,
            file: csvFile ?? undefined,
            authConfig: form.authConfig,
            esIndex: form.esIndex,
            esQuery: form.esQuery,
        };

        setDetectParams(params);
    };

    const createMutation = useMutation({
        mutationFn: ({ dataSource, file }: { dataSource: Omit<DataSource, "id" | "ownerId" | "createdAt" | "updatedAt">; file?: File }) =>
            createDataSourceUseCase.execute(dataSource, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dataSources"] });
            showNotification({
                type: "success",
                title: "Source créée",
                description: "La source de données a été créée avec succès",
                open: true,
            });
            setTimeout(() => navigate(ROUTES.sources), 1200);
        },
        onError: (error: Error) => {
            setGlobalError(error.message || "Erreur lors de la création de la source");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<DataSource> }) =>
            updateDataSourceUseCase.execute(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dataSources"] });
            queryClient.invalidateQueries({ queryKey: ["dataSource", id] });
            showNotification({
                type: "success",
                title: "Source modifiée",
                description: "La source de données a été modifiée avec succès",
                open: true,
            });
            setTimeout(() => navigate(ROUTES.sources), 1200);
        },
        onError: (error: Error) => {
            setGlobalError(error.message || "Erreur lors de la modification de la source");
        },
    });

    const onSubmit = () => {
        setGlobalError("");

        const connectionConfig = createConnectionConfig({
            httpMethod: form.httpMethod,
            authType: form.authType,
            authConfig: form.authConfig,
            esIndex: form.esIndex,
            esQuery: form.esQuery,
        });

        const dataSourceData = {
            name: form.name,
            type: form.type,
            visibility: form.visibility,
            endpoint: form.endpoint,
            connectionConfig,
            timestampField: form.timestampField,
        };

        if (isEdit && id) {
            updateMutation.mutate({
                id,
                updates: dataSourceData as Partial<DataSource>,
            });
        } else {
            createMutation.mutate({
                dataSource: dataSourceData as Omit<DataSource, "id" | "ownerId" | "createdAt" | "updatedAt">,
                file: csvFile ?? undefined,
            });
        }
    };

    return {
        form,
        setFormField,
        step,
        setStep,
        csvOrigin,
        setCsvOrigin,
        csvFile,
        setCsvFile,
        handleNext,
        onSubmit,
        globalError,
        isLoading: isEdit ? isLoadingExisting : false,
        isSaving: createMutation.isPending || updateMutation.isPending,
        detectionResult,
        isDetecting,
        detectionError: detectionError?.message,
        error: isEdit && !isLoadingExisting && !existingDataSource ? new Error("Source non trouvée") : undefined,
        columns: detectionResult?.columns || [],
        columnsError: detectionError?.message || "",
        columnsLoading: isDetecting,
        dataPreview: detectionResult?.preview || [],
        showModal,
        setShowModal,
        filePath,
        setFilePath,
        showFileField,
        setShowFileField,
        fieldErrors: {},
    };
}
