interface Props {
    suggestions: string[];
    isLoading: boolean;
    onSuggestionClick: (suggestion: string) => void;
}

export default function SuggestionButtons({
    suggestions,
    isLoading,
    onSuggestionClick,
}: Props) {
    if (!suggestions || suggestions.length === 0) {
        return null;
    }

    return (
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 pt-3 pb-2 bg-gray-50 dark:bg-gray-800/50 shrink-0">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Suggestions de questions
            </p>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => onSuggestionClick(suggestion)}
                        disabled={isLoading}
                        className="text-xs px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-700 text-gray-700 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
}
