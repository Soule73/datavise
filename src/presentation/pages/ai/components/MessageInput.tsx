import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

interface Props {
    value: string;
    isLoading: boolean;
    onChange: (value: string) => void;
    onSubmit: () => void;
    placeholder?: string;
}

export default function MessageInput({
    value,
    isLoading,
    onChange,
    onSubmit,
    placeholder = "Demander des modifications...",
}: Props) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && value.trim()) {
            e.preventDefault();
            onSubmit();
        }
    };

    return (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shrink-0">
            <div className="flex gap-2">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={1}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                     placeholder:text-xs
                    bg-white dark:bg-gray-800 dark:text-white placeholder-gray-400 resize-none"
                />
                <button
                    onClick={onSubmit}
                    disabled={isLoading || !value.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <PaperAirplaneIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
