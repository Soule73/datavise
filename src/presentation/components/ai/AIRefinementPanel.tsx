import Button from "@components/forms/Button";

interface AIRefinementPanelProps {
    refinementPrompt: string;
    isLoading: boolean;
    onPromptChange: (prompt: string) => void;
    onRefine: () => void;
}

export default function AIRefinementPanel({
    refinementPrompt,
    isLoading,
    onPromptChange,
    onRefine,
}: AIRefinementPanelProps) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && refinementPrompt.trim()) {
            onRefine();
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h3 className="font-semibold mb-3 dark:text-white">
                Demander des modifications
            </h3>
            <div className="flex gap-3">
                <input
                    type="text"
                    value={refinementPrompt}
                    onChange={(e) => onPromptChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ex: Remplace le pie chart par un bar chart..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white placeholder-gray-400"
                    disabled={isLoading}
                />
                <Button
                    onClick={onRefine}
                    disabled={isLoading || !refinementPrompt.trim()}
                    color="indigo"
                    className="w-max!"
                >
                    Raffiner
                </Button>
            </div>
        </div>
    );
}
