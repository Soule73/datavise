import { SparklesIcon } from "@heroicons/react/24/outline";

interface AIBuilderHeaderProps {
    title: string;
    description: string;
}

export default function AIBuilderHeader({ title, description }: AIBuilderHeaderProps) {
    return (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
                <SparklesIcon className="w-8 h-8" />
                <h1 className="text-3xl font-bold">{title}</h1>
            </div>
            <p className="text-purple-100">{description}</p>
        </div>
    );
}
