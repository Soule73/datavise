import { SparklesIcon } from "@heroicons/react/24/outline";

interface AILoadingOverlayProps {
    isLoading: boolean;
}

export default function AILoadingOverlay({ isLoading }: AILoadingOverlayProps) {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-8 flex flex-col items-center shadow-xl">
                <SparklesIcon className="w-16 h-16 text-purple-500 animate-pulse" />
                <p className="mt-4 text-lg font-medium dark:text-white">
                    L'IA analyse vos données...
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Cela peut prendre quelques secondes
                </p>
            </div>
        </div>
    );
}
