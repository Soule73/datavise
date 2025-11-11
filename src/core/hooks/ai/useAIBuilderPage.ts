import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAIWidgetGenerator } from "@hooks/ai/useAIWidgetGenerator";
import { useAIConversation } from "@hooks/ai/useAIConversation";
import { aiConversationApi } from "@services/aiConversation";
import { publishWidget } from "@services/widget";
import { getSources } from "@services/datasource";
import type { DataSource } from "@type/dataSource";
import type { AIGeneratedWidget } from "@type/aiTypes";
import type { WidgetConfig } from "@type/widgetTypes";

export function useAIBuilderPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const aiGenerator = useAIWidgetGenerator();
    const conversation = useAIConversation();

    const [dataSources, setDataSources] = useState<DataSource[]>([]);
    const [selectedSourceId, setSelectedSourceId] = useState<string>("");
    const [userPrompt, setUserPrompt] = useState<string>("");
    const [maxWidgets, setMaxWidgets] = useState<number>(5);
    const [refinementPrompt, setRefinementPrompt] = useState<string>("");

    useEffect(() => {
        loadDataSources();
        conversation.loadConversations();

        // Restaurer la conversation depuis l'URL
        const conversationId = searchParams.get("current");
        if (conversationId) {
            handleLoadConversation(conversationId);
        }
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

        try {
            // 1. Créer une conversation si nécessaire ou si temporaire
            const isTemporary = conversation.activeConversation?._id === "temp-new";
            let activeConv = conversation.activeConversation;

            if (!activeConv || isTemporary) {
                activeConv = await conversation.createConversation({
                    dataSourceId: selectedSourceId,
                    initialPrompt: userPrompt || "Génération automatique",
                });
                console.log("✅ [AIBuilderPage] Conversation créée:", activeConv._id);

                // Mettre à jour l'URL avec l'ID de la conversation
                setSearchParams({ current: activeConv._id });
            }

            // 2. Ajouter le message utilisateur (utiliser l'ID directement)
            if (userPrompt && activeConv) {
                await aiConversationApi.addMessage({
                    conversationId: activeConv._id,
                    role: "user",
                    content: userPrompt,
                });
                console.log("✅ [AIBuilderPage] Message utilisateur ajouté");
            }

            // 3. Générer les widgets (ils seront créés en base avec isDraft: true)
            const result = await aiGenerator.generateWidgets({
                dataSourceId: selectedSourceId,
                conversationId: activeConv._id,
                userPrompt: userPrompt || undefined,
                maxWidgets,
            });
            console.log("✅ [AIBuilderPage] Widgets générés:", result.widgets.length);
            console.log("✅ [AIBuilderPage] Titre généré:", result.conversationTitle);

            // 4. Mettre à jour le titre de la conversation avec le titre généré par l'IA
            if (result && activeConv && result.conversationTitle) {
                await aiConversationApi.updateTitle({
                    conversationId: activeConv._id,
                    title: result.conversationTitle,
                });
                console.log("✅ [AIBuilderPage] Titre mis à jour:", result.conversationTitle);
            }

            // 5. Ajouter le message assistant
            if (result && activeConv && result.widgets.length > 0) {
                await aiConversationApi.addMessage({
                    conversationId: activeConv._id,
                    role: "assistant",
                    content: `J'ai généré ${result.widgets.length} visualisation(s) basée(s) sur votre demande.`,
                    widgetsGenerated: result.widgets.length,
                });
                console.log("✅ [AIBuilderPage] Message assistant ajouté");
            }

            // 6. Recharger la conversation pour avoir l'état à jour
            if (activeConv) {
                await conversation.loadConversation(activeConv._id);
                console.log("✅ [AIBuilderPage] Conversation rechargée");

                // 8. Recharger la liste des conversations pour mettre à jour la sidebar
                await conversation.loadConversations();
                console.log("✅ [AIBuilderPage] Liste des conversations rechargée");
            }

            console.log("✅ [AIBuilderPage] Génération terminée avec conversation sauvegardée");
        } catch (error) {
            console.error("❌ [AIBuilderPage] Erreur génération:", error);
        }
    };

    const handleRefine = async () => {
        if (!selectedSourceId || aiGenerator.widgets.length === 0 || !refinementPrompt.trim()) {
            return;
        }

        console.log("🔧 [AIBuilderPage] Début du raffinement:", {
            prompt: refinementPrompt,
            currentWidgetsCount: aiGenerator.widgets.length,
        });

        try {
            const activeConv = conversation.activeConversation;
            if (!activeConv) {
                console.error("❌ [AIBuilderPage] Pas de conversation active");
                return;
            }

            // 1. Ajouter le message utilisateur
            await aiConversationApi.addMessage({
                conversationId: activeConv._id,
                role: "user",
                content: refinementPrompt,
            });

            // 2. Raffiner les widgets
            const savedWidgetIds = aiGenerator.widgets
                .filter((w) => w._id)
                .map((w) => w._id!);

            let result;
            if (savedWidgetIds.length > 0) {
                console.log("🔄 [AIBuilderPage] Raffinement avec widgets MongoDB");
                // TODO: Appeler refineWidgetsDb
            } else {
                result = await aiGenerator.refineWidgets({
                    currentWidgets: aiGenerator.widgets,
                    refinementPrompt,
                    dataSourceId: selectedSourceId,
                });
            }

            // 3. Ajouter le message assistant
            if (result && result.widgets) {
                await aiConversationApi.addMessage({
                    conversationId: activeConv._id,
                    role: "assistant",
                    content: `J'ai raffiné les visualisations selon vos instructions.`,
                    widgetsGenerated: result.widgets.length,
                });
                console.log("✅ [AIBuilderPage] Message assistant ajouté");
            }

            // 4. Recharger la conversation
            await conversation.loadConversation(activeConv._id);

            // 6. Recharger la liste des conversations pour mettre à jour la sidebar
            await conversation.loadConversations();
            console.log("✅ [AIBuilderPage] Liste des conversations rechargée");

            setRefinementPrompt("");
            console.log("✅ [AIBuilderPage] Raffinement terminé");
        } catch (error) {
            console.error("❌ [AIBuilderPage] Erreur raffinement:", error);
        }
    };

    const handleSaveAll = async () => {
        console.log("💾 [AIBuilderPage] Publication de tous les widgets:", aiGenerator.widgets.length);

        try {
            // Publier tous les widgets (change isDraft: false)
            const publishPromises = aiGenerator.widgets
                .filter((w) => w._id) // Uniquement ceux déjà en base
                .map((w) => publishWidget(w._id!));

            await Promise.all(publishPromises);

            console.log("✅ [AIBuilderPage] Tous les widgets publiés");

            // Recharger la liste des conversations pour mettre à jour le compteur
            if (conversation.activeConversation) {
                await conversation.loadConversations();
            }

            console.log("✅ [AIBuilderPage] Publication terminée");
        } catch (error) {
            console.error("❌ [AIBuilderPage] Erreur publication:", error);
        }
    };

    const handleReset = () => {
        aiGenerator.reset();
        conversation.setActiveConversation(null);
        setSelectedSourceId("");
        setUserPrompt("");
        setRefinementPrompt("");
        setMaxWidgets(5);

        // Supprimer le paramètre de l'URL
        setSearchParams({});
    };

    const handleNewConversation = () => {
        console.log("🆕 [AIBuilderPage] Préparation nouvelle conversation");

        // Supprimer le paramètre de l'URL
        setSearchParams({});

        // Réinitialiser l'état et créer un marqueur de "conversation en cours"
        aiGenerator.reset();
        setSelectedSourceId("");
        setUserPrompt("");
        setRefinementPrompt("");
        setMaxWidgets(5);

        // Créer une conversation temporaire pour afficher le formulaire
        // La vraie conversation sera créée lors de handleGenerate
        conversation.setActiveConversation({
            _id: "temp-new",
            userId: "",
            dataSourceId: "",
            title: "Nouvelle conversation",
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as any);
    };

    const handleLoadConversation = async (conversationId: string) => {
        try {
            const loadedConversation = await conversation.loadConversation(conversationId);

            // Mettre à jour l'URL avec l'ID de la conversation
            setSearchParams({ current: conversationId });

            // Les widgets sont déjà chargés dans loadedConversation.widgets
            if (loadedConversation.widgets && loadedConversation.widgets.length > 0) {
                // Transformer les widgets MongoDB en AIGeneratedWidget
                const aiWidgets: AIGeneratedWidget[] = loadedConversation.widgets.map(w => ({
                    id: w.widgetId,
                    _id: w._id,
                    name: w.title,
                    description: w.description || "",
                    type: w.type,
                    config: w.config as WidgetConfig,
                    dataSourceId: w.dataSourceId.toString(),
                    reasoning: w.reasoning || "",
                    confidence: w.confidence || 0.8,
                }));

                aiGenerator.setWidgets(aiWidgets);
                setSelectedSourceId(loadedConversation.dataSourceId);
            }

            console.log("✅ [AIBuilderPage] Conversation chargée avec widgets");
        } catch (error) {
            console.error("❌ [AIBuilderPage] Erreur chargement conversation:", error);
        }
    };

    const handleRemoveWidget = async (widgetId: string) => {
        console.log("🗑️ [AIBuilderPage] Suppression du widget:", widgetId);

        const activeConv = conversation.activeConversation;
        if (!activeConv) return;

        // 1. Supprimer du générateur
        aiGenerator.removeWidget(widgetId);

        // 2. Les widgets sont déjà en base, pas besoin de mettre à jour la conversation

        // 3. Recharger la conversation
        await conversation.loadConversation(activeConv._id);

        // 4. Recharger la liste des conversations pour mettre à jour la sidebar
        await conversation.loadConversations();

        console.log("✅ [AIBuilderPage] Widget supprimé de la conversation");
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
        handleNewConversation,
        handleLoadConversation,

        // From AI Generator (spread first)
        ...aiGenerator,

        // Override removeWidget avec notre version qui met à jour la conversation
        removeWidget: handleRemoveWidget,

        // From Conversation
        conversation,
    };
}
