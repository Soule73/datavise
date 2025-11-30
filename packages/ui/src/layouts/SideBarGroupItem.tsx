import { ChevronDownIcon } from "@heroicons/react/24/outline";
import SidebarItem from "./SidebarItem";
import type { JSX } from "react/jsx-runtime";

export interface SidebarGroup {
    label: string;
    permissions: string[];
    items: SidebarGroupItem[];
}

export interface SidebarGroupItem {
    to: string;
    label: string;
    icon: JSX.Element;
    permission?: string;
}

export default function SideBarGroupItem({
    group,
    isOpen,
    toggleGroup,
    hasPermission,
}: {
    group: SidebarGroup;
    isOpen: boolean;
    toggleGroup: (label: string) => void;
    hasPermission: (permission: string) => boolean;
}) {
    return (
        <div key={group.label}>
            <button
                className="flex cursor-pointer items-center w-full text-xs font-semibold text-gray-400 uppercase mb-2 px-2 tracking-wider focus:outline-none select-none"
                onClick={() => toggleGroup(group.label)}
                aria-expanded={isOpen}
            >
                <span className="flex-1 text-left">{group.label}</span>
                {isOpen ? (
                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                ) : (
                    <ChevronDownIcon className="w-4 h-4 ml-1 rotate-180" />
                )}
            </button>
            {isOpen && (
                <div className="space-y-2">
                    {group.items.map((item: SidebarGroupItem) =>
                        !item.permission || hasPermission(item.permission) ? (
                            <SidebarItem
                                label={item.label}
                                key={item.to}
                                to={item.to}
                                icon={item.icon}
                            >
                                {item.label}
                            </SidebarItem>
                        ) : null
                    )}
                </div>
            )}
        </div>
    );
}