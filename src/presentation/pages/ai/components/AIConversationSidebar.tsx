import { useState } from "react";
import type { AIConversation } from "@domain/entities/AIConversation.entity";
import {
    PlusIcon,
    ChatBubbleLeftRightIcon,
    TrashIcon,
    PencilIcon,
    CheckIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button, AlertModal } from "@datavise/ui";

interface Props {
    conversations: AIConversation[];
    activeConversation: AIConversation | null | undefined;
    onSelectConversation: (conversationId: string) => void;
    onNewConversation: () => void;
    onDeleteConversation: (conversationId: string) => void;
    onUpdateTitle: (conversationId: string, title: string) => void;
    isOpen: boolean;
    onToggle: () => void;
}

interface ConversationItemProps {
    conversation: AIConversation;
    isActive: boolean;
    isEditing: boolean;
    editTitle: string;
    onSelect: () => void;
    onStartEdit: () => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    onDelete: () => void;
    onEditTitleChange: (value: string) => void;
    formatDate: (date?: Date) => string;
}

function ConversationItem({
    conversation,
    isActive,
    isEditing,
    editTitle,
    onSelect,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onDelete,
    onEditTitleChange,
    formatDate,
}: ConversationItemProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") onSaveEdit();
        if (e.key === "Escape") onCancelEdit();
    };

    return (
        <div
            className={`group relative px-3 py-2 mx-2 mb-1 cursor-pointer transition-all ${isActive
                ? "bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-500"
                : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
            onClick={() => !isEditing && onSelect()}
        >
            {isEditing ? (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => onEditTitleChange(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 dark:text-white"
                        autoFocus
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={onSaveEdit}
                        className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                        title="Enregistrer"
                    >
                        <CheckIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onCancelEdit}
                        className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                        title="Annuler"
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {conversation.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(conversation.updatedAt)}
                                </span>
                                {conversation.widgetIds && conversation.widgetIds.length > 0 && (
                                    <span className="text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                                        {conversation.widgetIds.length} widgets
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onStartEdit();
                                }}
                                className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded"
                                title="Renommer"
                            >
                                <PencilIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                                title="Supprimer"
                            >
                                <TrashIcon className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {conversation.messages && conversation.messages.length > 0 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                            {conversation.messages[conversation.messages.length - 1].content.substring(0, 60)}...
                        </p>
                    )}
                </>
            )}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucune conversation</p>
        </div>
    );
}

export default function AIConversationSidebar({
    conversations,
    activeConversation,
    onSelectConversation,
    onNewConversation,
    onDeleteConversation,
    onUpdateTitle,
    isOpen,
    onToggle,
}: Props) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

    const handleStartEdit = (conversation: AIConversation) => {
        setEditingId(conversation.id);
        setEditTitle(conversation.title);
    };

    const handleSaveEdit = (conversationId: string) => {
        if (editTitle.trim()) {
            onUpdateTitle(conversationId, editTitle.trim());
        }
        setEditingId(null);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
    };

    const handleDeleteClick = (conversationId: string) => {
        setConversationToDelete(conversationId);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (conversationToDelete) {
            onDeleteConversation(conversationToDelete);
            setDeleteModalOpen(false);
            setConversationToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setConversationToDelete(null);
    };

    const formatDate = (date?: Date) => {
        if (!date) return "";
        const d = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (d.toDateString() === today.toDateString()) {
            return "Aujourd'hui";
        } else if (d.toDateString() === yesterday.toDateString()) {
            return "Hier";
        } else {
            return d.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
            });
        }
    };

    return (
        <>
            {/* Overlay - Ferme le sidebar au clic */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={onToggle}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar flottant */}
            {isOpen && (
                <div className="fixed left-2 top-16 bottom-0 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden z-50 shadow">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <ChatBubbleLeftRightIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Conversations
                                </h2>
                            </div>
                            <button
                                onClick={onToggle}
                                className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                                title="Fermer"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <Button
                            onClick={onNewConversation}
                            color="indigo"
                            size="sm"
                            className="w-full"
                        >
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Nouvelle conversation
                        </Button>
                    </div>

                    {/* Conversations List - Scrollable */}
                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div className="py-2">
                                {conversations.map((conv) => (
                                    <ConversationItem
                                        key={conv.id}
                                        conversation={conv}
                                        isActive={activeConversation?.id === conv.id}
                                        isEditing={editingId === conv.id}
                                        editTitle={editTitle}
                                        onSelect={() => onSelectConversation(conv.id)}
                                        onStartEdit={() => handleStartEdit(conv)}
                                        onSaveEdit={() => handleSaveEdit(conv.id)}
                                        onCancelEdit={handleCancelEdit}
                                        onDelete={() => handleDeleteClick(conv.id)}
                                        onEditTitleChange={setEditTitle}
                                        formatDate={formatDate}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div >
            )
            }

            {/* Modal de confirmation de suppression */}
            <AlertModal
                open={deleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                type="error"
                title="Supprimer la conversation"
                description="Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est irréversible et supprimera tous les widgets associés."
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
            />
        </>
    );
}
