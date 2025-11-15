import { UserIcon, SparklesIcon } from "@heroicons/react/24/outline";
import type { AIMessage } from "@/domain/entities/AIConversation.entity";

interface Props {
    message: AIMessage;
    formatTimestamp: (date: Date) => string;
}

export default function MessageBubble({ message, formatTimestamp }: Props) {
    const isUser = message.role === "user";

    return (
        <div className={`flex gap-3 ${isUser ? "flex-row" : "flex-row-reverse"}`}>
            <div
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser
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

            <div className={`flex-1 max-w-[80%] ${isUser ? "text-left" : "text-right"}`}>
                <div
                    className={`inline-block px-4 py-2 rounded-2xl ${isUser
                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-gray-900 dark:text-white"
                        : "bg-purple-50 dark:bg-purple-900/20 text-gray-900 dark:text-white"
                        }`}
                >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
}
