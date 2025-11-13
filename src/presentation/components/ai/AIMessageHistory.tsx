import type { AIMessage } from "@type/aiConversationTypes";
import type { DataSource } from "@/core/types/dataSource";
import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import SuggestionButtons from "./SuggestionButtons";
import MessageInput from "./MessageInput";
import EmptyMessageState from "./EmptyMessageState";
import InitialConfigurationForm from "./InitialConfigurationForm";

interface Props {
    messages: AIMessage[];
    refinementPrompt: string;
    isLoading: boolean;
    suggestions?: string[];
    hasActiveConversation: boolean;
    dataSources?: DataSource[];
    selectedSourceId?: string;
    maxWidgets?: number;
    userPrompt?: string;
    onPromptChange: (prompt: string) => void;
    onRefine: () => void;
    onSuggestionClick?: (suggestion: string) => void;
    onSourceChange?: (sourceId: string) => void;
    onMaxWidgetsChange?: (max: number) => void;
    onUserPromptChange?: (prompt: string) => void;
    onGenerate?: () => void;
    className?: string;
}

export default function AIMessageHistory({
    messages = [],
    refinementPrompt,
    isLoading,
    suggestions,
    hasActiveConversation,
    dataSources = [],
    selectedSourceId = "",
    maxWidgets = 5,
    userPrompt = "",
    onPromptChange,
    onRefine,
    onSuggestionClick,
    onSourceChange,
    onMaxWidgetsChange,
    onUserPromptChange,
    onGenerate,
    className = "",
}: Props) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const formatTimestamp = (date: Date) => {
        const d = new Date(date);
        return d.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleSuggestionAction = (suggestion: string) => {
        if (onSuggestionClick) {
            onSuggestionClick(suggestion);
        } else {
            onPromptChange(suggestion);
            setTimeout(() => onRefine(), 100);
        }
    };

    const showInitialConfig = !hasActiveConversation && messages.length === 0;
    const canSendMessage = hasActiveConversation || (selectedSourceId && userPrompt.trim());

    const handleSubmit = () => {
        if (hasActiveConversation) {
            onRefine();
        } else if (onGenerate && canSendMessage) {
            onGenerate();
        }
    };

    return (
        <div className={`flex flex-col h-full overflow-hidden bg-white dark:bg-gray-900 ${className}`}>
            {showInitialConfig && onSourceChange && onMaxWidgetsChange && (
                <InitialConfigurationForm
                    dataSources={dataSources}
                    selectedSourceId={selectedSourceId}
                    maxWidgets={maxWidgets}
                    onSourceChange={onSourceChange}
                    onMaxWidgetsChange={onMaxWidgetsChange}
                />
            )}

            {messages.length > 0 ? (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                        <MessageBubble
                            key={index}
                            message={message}
                            formatTimestamp={formatTimestamp}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            ) : (
                !showInitialConfig && <EmptyMessageState />
            )}

            {suggestions && (
                <SuggestionButtons
                    suggestions={suggestions}
                    isLoading={isLoading}
                    onSuggestionClick={handleSuggestionAction}
                />
            )}

            <MessageInput
                value={hasActiveConversation ? refinementPrompt : userPrompt}
                isLoading={isLoading}
                onChange={hasActiveConversation ? onPromptChange : (onUserPromptChange || onPromptChange)}
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

