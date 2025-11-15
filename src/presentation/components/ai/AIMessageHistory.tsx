import { useRef, useEffect } from "react";
import { useAIStore } from "@store/aiStore";
import { useAIBuilderActions } from "@/application/hooks/ai/useAIBuilderActions";
import MessageBubble from "./MessageBubble";
import SuggestionButtons from "./SuggestionButtons";
import MessageInput from "./MessageInput";
import EmptyMessageState from "./EmptyMessageState";
import InitialConfigurationForm from "./InitialConfigurationForm";
import { formatShortDateTime } from "@/core/utils/timeUtils";

export default function AIMessageHistory() {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {
        activeConversation,
        dataSources,
        selectedSourceId,
        maxWidgets,
        userPrompt,
        refinementPrompt,
        isLoading,
        suggestions,
        setSelectedSourceId,
        setMaxWidgets,
        setUserPrompt,
        setRefinementPrompt,
    } = useAIStore();

    const { handleGenerate, handleRefine, handleSuggestionClick } = useAIBuilderActions();

    const messages = activeConversation?.messages || [];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const hasActiveConversation = !!activeConversation;
    const showInitialConfig = !hasActiveConversation && messages.length === 0;
    const canSendMessage = hasActiveConversation || (selectedSourceId && userPrompt.trim());

    const handleSubmit = () => {
        if (hasActiveConversation) {
            handleRefine();
        } else if (canSendMessage) {
            handleGenerate();
        }
    };

    const handlePromptChange = (value: string) => {
        if (hasActiveConversation) {
            setRefinementPrompt(value);
        } else {
            setUserPrompt(value);
        }
    };

    return (
        <div className="w-96 rounded-r-lg border-l border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {activeConversation ? "Historique" : "Nouvelle conversation"}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {activeConversation ? "Conversation avec l'IA" : "Configurez et démarrez"}
                </p>
            </div>
            <div className="flex flex-col h-full overflow-hidden bg-white dark:bg-gray-900 flex-1 ">
                {showInitialConfig && (
                    <InitialConfigurationForm
                        dataSources={dataSources}
                        selectedSourceId={selectedSourceId}
                        maxWidgets={maxWidgets}
                        onSourceChange={setSelectedSourceId}
                        onMaxWidgetsChange={setMaxWidgets}
                    />
                )}

                {messages.length > 0 ? (
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <MessageBubble
                                key={index}
                                message={message}
                                formatTimestamp={formatShortDateTime}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                ) : (
                    !showInitialConfig && <EmptyMessageState />
                )}

                {suggestions && suggestions.length > 0 && (
                    <SuggestionButtons
                        suggestions={suggestions}
                        isLoading={isLoading}
                        onSuggestionClick={handleSuggestionClick}
                    />
                )}

                <MessageInput
                    value={hasActiveConversation ? refinementPrompt : userPrompt}
                    isLoading={isLoading}
                    onChange={handlePromptChange}
                    onSubmit={handleSubmit}
                    placeholder={
                        hasActiveConversation
                            ? "Demander des modifications..."
                            : "Décrivez les visualisations souhaitées..."
                    }
                />
            </div>
        </div>
    );
}

