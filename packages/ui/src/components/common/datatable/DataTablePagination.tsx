import SelectField from "../../forms/SelectField";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";


export interface DataTablePaginationProps {
  effectivePage: number;
  pageCount: number;
  handlePageChange: (page: number) => void;
  effectiveRowPerPage: number;
  handleRowPerPageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  total: number;
}

export default function DataTablePagination({
  effectivePage,
  pageCount,
  handlePageChange,
  effectiveRowPerPage,
  handleRowPerPageChange,
  total,
}: DataTablePaginationProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
      <nav
        className="flex items-center gap-1 select-none"
        aria-label="Pagination"
      >
        <button
          className={`p-2 rounded-lg text-sm transition-colors ${effectivePage === 1
            ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          onClick={() => effectivePage !== 1 && handlePageChange(1)}
          disabled={effectivePage === 1}
          aria-label="Première page"
        >
          <ChevronDoubleLeftIcon className="w-5 h-5" />
        </button>

        <button
          className={`p-2 rounded-lg text-sm transition-colors ${effectivePage === 1
            ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          onClick={() =>
            effectivePage > 1 && handlePageChange(effectivePage - 1)
          }
          disabled={effectivePage === 1}
          aria-label="Page précédente"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Page <span className="font-semibold">{effectivePage}</span> sur <span className="font-semibold">{pageCount}</span>
        </span>

        <button
          className={`p-2 rounded-lg text-sm transition-colors ${effectivePage === pageCount
            ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          onClick={() =>
            effectivePage < pageCount && handlePageChange(effectivePage + 1)
          }
          disabled={effectivePage === pageCount}
          aria-label="Page suivante"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>

        <button
          className={`p-2 rounded-lg text-sm transition-colors ${effectivePage === pageCount
            ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          onClick={() =>
            effectivePage !== pageCount && handlePageChange(pageCount)
          }
          disabled={effectivePage === pageCount}
          aria-label="Dernière page"
        >
          <ChevronDoubleRightIcon className="w-5 h-5" />
        </button>
      </nav>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {effectiveRowPerPage * (effectivePage - 1) + 1}-
          {Math.min(effectivePage * effectiveRowPerPage, total)} sur {total}
        </span>
        <div className="flex items-center gap-2">
          <label htmlFor="rows-per-page" className="text-sm text-gray-600 dark:text-gray-400">
            Lignes par page
          </label>
          <SelectField
            id="rows-per-page"
            options={[5, 10, 20, 50, 100].map((n) => ({
              value: String(n),
              label: String(n),
            }))}
            value={String(effectiveRowPerPage)}
            onChange={handleRowPerPageChange}
            className="w-20 text-sm"
            aria-label="Lignes par page"
          />
        </div>
      </div>
    </div>
  );
}
