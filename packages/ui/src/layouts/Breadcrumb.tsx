import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ReactNode;
}

interface BreadcrumbProps {
    base: BreadcrumbItem;
    items: BreadcrumbItem[];
}

export const Breadcrumb = ({ base, items }: BreadcrumbProps) => {
    return (
        <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
            <Link
                to={base.href || "#"}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
                {base.icon && <span className="shrink-0">{base.icon}</span>}
                {/* <HomeIcon className="w-4 h-4" /> */}
                <span className="sr-only">{base.label}</span>
            </Link>

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div key={index} className="flex items-center space-x-2">
                        <ChevronRightIcon className="w-4 h-4 text-gray-400 dark:text-gray-600" />

                        {isLast || !item.href ? (
                            <span className="flex items-center space-x-1 font-medium text-gray-900 dark:text-white">
                                {item.icon && <span className="shrink-0">{item.icon}</span>}
                                <span className="truncate">{item.label}</span>
                            </span>
                        ) : (
                            <Link
                                to={item.href}
                                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
                            >
                                {item.icon && <span className="shrink-0">{item.icon}</span>}
                                <span className="truncate">{item.label}</span>
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;
