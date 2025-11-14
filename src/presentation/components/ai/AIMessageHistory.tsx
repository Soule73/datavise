import { useRef, useEffect } from "react";
import { useAIStore } from "@store/aiStore";
import { useAIActions } from "@hooks/ai/useAIActions";
import MessageBubble from "./MessageBubble";
import SuggestionButtons from "./SuggestionButtons";
import MessageInput from "./MessageInput";
import EmptyMessageState from "./EmptyMessageState";
import InitialConfigurationForm from "./InitialConfigurationForm";
import { formatShortDateTime } from "@/core/utils/timeUtils";

interface Props {
    className?: string;
}

export default function AIMessageHistory({ className = "" }: Props) {
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

    const { handleGenerate, handleRefine, handleSuggestionClick } = useAIActions();

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
        <div className={`flex flex-col h-full overflow-hidden bg-white dark:bg-gray-900 ${className}`}>
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
    );
}

