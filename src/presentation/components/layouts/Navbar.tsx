import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ThemeDropdown from "@components/ThemeDropdown";
import UserDropdown from "@components/UserDropdown";
import logoDataVise from "@assets/logo-datavise.svg";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";
import { useSidebarStore } from "@/core/store/sidebar";

export default function Navbar({
  hideUserInfo = false,
  hideSidebar = false,
  breadcrumb,
}: {
  hideUserInfo?: boolean;
  hideSidebar?: boolean;
  breadcrumb?: BreadcrumbItem[];
}) {
  const { open, openSidebar, closeSidebar } = useSidebarStore();


  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 h-12 flex items-center justify-between px-4 bg-surface dark:bg-surface-dark transition-colors duration-300 overflow-hidden font-sans antialiased 
      border-b border-gray-200 dark:border-gray-700
    bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
    >
      <div className="flex items-center md:gap-2">
        {!hideSidebar && (
          <button
            className="p-2 cursor-pointer rounded hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Ouvrir le menu"
            onClick={open ? closeSidebar : openSidebar}
          >
            {open ? (
              <XMarkIcon className="w-6 h-6" aria-label="Fermer le menu" />
            ) : (
              <Bars3Icon className="w-6 h-6" aria-label="Ouvrir le menu" />
            )}
          </button>
        )}
        <img
          src={logoDataVise}
          alt="Logo DataVise"
          className={`h-10 w-auto  ${hideSidebar ? "border-r" : "border-x"
            } px-2 border-gray-300 dark:border-gray-700`}
          style={{ minWidth: 40 }}
        />
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
      </div>
      <nav className="flex items-center gap-4">
        <ThemeDropdown />
        {!hideUserInfo && <UserDropdown />}
      </nav>
    </header>
  );
}