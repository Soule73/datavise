import { SparklesIcon } from "@heroicons/react/24/outline";

export default function EmptyMessageState() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <SparklesIcon className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-sm">Commencez une conversation avec l'IA</p>
            <p className="text-xs mt-1">Vos échanges apparaîtront ici</p>
        </div>
    );
}
