import { useState, useEffect } from "react";
import { useAIWidgetGenerator } from "@hooks/ai/useAIWidgetGenerator";
import { getSources } from "@services/datasource";
import type { DataSource } from "@type/dataSource";

export function useAIBuilderPage() {
    const aiGenerator = useAIWidgetGenerator();

    const [dataSources, setDataSources] = useState<DataSource[]>([]);
    const [selectedSourceId, setSelectedSourceId] = useState<string>("");
    const [userPrompt, setUserPrompt] = useState<string>("");
    const [maxWidgets, setMaxWidgets] = useState<number>(5);
    const [refinementPrompt, setRefinementPrompt] = useState<string>("");

    useEffect(() => {
        loadDataSources();
    }, []);

    const loadDataSources = async () => {
        try {
            const sources = await getSources();
            setDataSources(sources);
        } catch (err) {
            console.error("Erreur chargement sources:", err);
        }
    };

    const handleGenerate = async () => {
        if (!selectedSourceId) return;

        console.log("🚀 [AIBuilderPage] Début de la génération:", {
            sourceId: selectedSourceId,
            prompt: userPrompt,
            maxWidgets,
        });

        await aiGenerator.generateWidgets({
            dataSourceId: selectedSourceId,
            userPrompt: userPrompt || undefined,
            maxWidgets,
        });

        console.log("✅ [AIBuilderPage] Génération terminée");
    };

    const handleRefine = async () => {
        if (!selectedSourceId || aiGenerator.widgets.length === 0 || !refinementPrompt.trim()) {
            return;
        }

        console.log("🔧 [AIBuilderPage] Début du raffinement:", {
            prompt: refinementPrompt,
            currentWidgetsCount: aiGenerator.widgets.length,
        });

        await aiGenerator.refineWidgets({
            currentWidgets: aiGenerator.widgets,
            refinementPrompt,
            dataSourceId: selectedSourceId,
        });

        setRefinementPrompt("");
        console.log("✅ [AIBuilderPage] Raffinement terminé");
    };

    const handleSaveAll = async () => {
        console.log("💾 [AIBuilderPage] Sauvegarde de tous les widgets:", aiGenerator.widgets.length);
        await aiGenerator.saveAllWidgets();
        console.log("✅ [AIBuilderPage] Sauvegarde terminée");
    };

    const handleReset = () => {
        aiGenerator.reset();
        setSelectedSourceId("");
        setUserPrompt("");
        setRefinementPrompt("");
        setMaxWidgets(5);
    };

    return {
        // State
        dataSources,
        selectedSourceId,
        userPrompt,
        maxWidgets,
        refinementPrompt,

        // Setters
        setSelectedSourceId,
        setUserPrompt,
        setMaxWidgets,
        setRefinementPrompt,

        // Actions
        handleGenerate,
        handleRefine,
        handleSaveAll,
        handleReset,

        // From AI Generator
        ...aiGenerator,
    };
}
