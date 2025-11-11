import type { AIMessage } from "@type/aiConversationTypes";
import { UserIcon, SparklesIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useRef, useEffect } from "react";

interface Props {
    messages: AIMessage[];
    refinementPrompt: string;
    isLoading: boolean;
    onPromptChange: (prompt: string) => void;
    onRefine: () => void;
    className?: string;
}

export default function AIMessageHistory({
    messages,
    refinementPrompt,
    isLoading,
    onPromptChange,
    onRefine,
    className = ""
}: Props) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll vers le bas quand de nouveaux messages arrivent
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && refinementPrompt.trim()) {
            e.preventDefault();
            onRefine();
        }
    };

    const formatTimestamp = (date: Date) => {
        const d = new Date(date);
        return d.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (messages.length === 0) {
        return (
            <div className={`flex flex-col h-full ${className}`}>
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <SparklesIcon className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-sm">Commencez une conversation avec l'IA</p>
                    <p className="text-xs mt-1">Vos échanges apparaîtront ici</p>
                </div>

                {/* Input en bas même sans messages */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                    <div className="flex gap-2">
                        <textarea
                            value={refinementPrompt}
                            onChange={(e) => onPromptChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Demander des modifications..."
                            rows={1}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white placeholder-gray-400 resize-none"
                        />
                        <button
                            onClick={onRefine}
                            disabled={isLoading || !refinementPrompt.trim()}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-full ${className}`}>
            {/* Messages scrollables */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">{messages.map((message, index) => {
                const isUser = message.role === "user";

                return (
                    <div
                        key={index}
                        className={`flex gap-3 ${isUser ? "flex-row" : "flex-row-reverse"
                            }`}
                    >
                        {/* Avatar */}
                        <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser
                                ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                                : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                }`}
                        >
                            {isUser ? (
                                <UserIcon className="w-5 h-5" />
                            ) : (
                                <SparklesIcon className="w-5 h-5" />
                            )}
                        </div>

                        {/* Message Content */}
                        <div
                            className={`flex-1 max-w-[80%] ${isUser ? "text-left" : "text-right"
                                }`}
                        >
                            <div
                                className={`inline-block px-4 py-2 rounded-2xl ${isUser
                                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-gray-900 dark:text-white"
                                    : "bg-purple-50 dark:bg-purple-900/20 text-gray-900 dark:text-white"
                                    }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">
                                    {message.content}
                                </p>
                                {message.widgetsGenerated && (
                                    <div className="mt-2 pt-2 border-t border-current/10">
                                        <span className="text-xs opacity-75">
                                            ✨ {message.widgetsGenerated} visualisation(s) générée(s)
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div
                                className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isUser ? "text-left" : "text-right"
                                    }`}
                            >
                                {formatTimestamp(message.timestamp)}
                            </div>
                        </div>
                    </div>
                );
            })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input fixe en bas */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                <div className="flex gap-2">
                    <textarea
                        value={refinementPrompt}
                        onChange={(e) => onPromptChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Demander des modifications..."
                        rows={1}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white placeholder-gray-400 resize-none"
                    />
                    <button
                        onClick={onRefine}
                        disabled={isLoading || !refinementPrompt.trim()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
