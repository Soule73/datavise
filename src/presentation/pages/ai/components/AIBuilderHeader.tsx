import { Button } from "@datavise/ui";

interface AIBuilderHeaderProps {
    sourceName: string;
    widgetLength: number;
    showActions: boolean;
    handleReset: () => void;
    handleSaveAll: () => void;
}

export default function AIBuilderHeader({ sourceName, widgetLength, showActions, handleReset, handleSaveAll }: AIBuilderHeaderProps) {
    return (
        <div className="flex items-center justify-between px-6 py-2 mb-2 sticky top-0 z-1 bg-gray-100 dark:bg-gray-800 ">
            <h4 className="flex items-center gap-4">
                Source analysée : {sourceName}
                {" "}({widgetLength} visualisation{widgetLength > 1 ? "s" : ""})
            </h4>
            {showActions && widgetLength > 0 && (
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleReset}
                        color="gray"
                        variant="outline"
                        size="sm"
                    >
                        Recommencer
                    </Button>
                    <Button
                        onClick={handleSaveAll}
                        color="indigo"
                        size="sm"
                        className=" min-w-42"
                    >
                        Sauvegarder tous
                    </Button>
                </div>
            )}
        </div>
    );
}
