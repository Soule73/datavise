/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import DataTablePagination from "./DataTablePagination";
import DataTableSearch from "./DataTableSearch";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DataTableColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  name?: string;
  emptyMessage?: string;
  paginable?: boolean;
  searchable?: boolean;
  rowPerPage?: number;
  actionsColumn?: DataTableColumn<T>;
  onClickItem?: (row: T) => void;
  onSearch?: (value: string) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  page?: number;
  totalRows?: number;
  searchValue?: string;
  paginationMeta?: PaginationMeta;
  loading?: boolean;
}


export default function DataTable<T extends { [key: string]: any }>({
  columns,
  data,
  emptyMessage,
  actionsColumn,
  onClickItem,
  paginable = false,
  searchable = false,
  onSearch,
  onPageChange,
  onLimitChange,
  page = 1,
  rowPerPage = 10,
  totalRows,
  searchValue = "",
  name,
  paginationMeta,
  loading = false,
}: DataTableProps<T>) {

  const validColumns = columns.filter((col) => col.key && col.label);

  const hasActions = !!actionsColumn;

  const [internalSearch, setInternalSearch] = useState("");

  useEffect(() => {
    if (onSearch && searchValue !== internalSearch) {
      setInternalSearch(searchValue || "");
    }
  }, [searchValue, onSearch, internalSearch]);

  useEffect(() => {
    return () => {
      setInternalSearch("");
    };
  }, []);

  const effectiveSearch = searchable
    ? onSearch
      ? searchValue
      : internalSearch
    : "";

  const filteredData =
    searchable && effectiveSearch
      ? data.filter((row) =>
        validColumns.some((col) => {
          const value = row[col.key as keyof T];
          return (
            value &&
            String(value)
              .toLowerCase()
              .includes(effectiveSearch.toLowerCase())
          );
        })
      )
      : data;

  const [localPage, setLocalPage] = useState(1);
  const [localRowPerPage, setLocalRowPerPage] = useState(rowPerPage);

  useEffect(() => {
    setLocalRowPerPage(rowPerPage);
  }, [rowPerPage]);

  const effectivePage = paginationMeta?.page ?? (paginable ? (onPageChange ? page : localPage) : 1);

  const effectiveRowPerPage = paginationMeta?.limit ?? (paginable
    ? onPageChange
      ? rowPerPage
      : localRowPerPage
    : filteredData.length);

  const total = paginationMeta?.total ?? (typeof totalRows === "number" ? totalRows : filteredData.length);

  const pageCount = paginationMeta?.totalPages ?? (paginable ? Math.ceil(total / effectiveRowPerPage) : 1);

  const paginatedData = paginable
    ? filteredData.slice(
      (effectivePage - 1) * effectiveRowPerPage,
      effectivePage * effectiveRowPerPage
    )
    : filteredData;

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (onSearch) onSearch(e.target.value);
    else setInternalSearch(e.target.value);
    if (!onPageChange) setLocalPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (onPageChange) onPageChange(newPage);
    else setLocalPage(newPage);
  };

  const handleRowPerPageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (onLimitChange) {
      onLimitChange(value);
    }
    if (onPageChange) {
      onPageChange(1);
    } else {
      setLocalPage(1);
      setLocalRowPerPage(value);
    }
  };

  const searchMountCount = useRef(0);

  return (
    <div className="relative w-full h-full max-w-full max-h-full overflow-auto config-scrollbar bg-white dark:bg-gray-900 rounded-lg ">
      {searchable && (
        <DataTableSearch
          value={effectiveSearch}
          onChange={handleSearch}
          name={name}
          mountCountRef={searchMountCount}
        />
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs font-semibold uppercase tracking-wider bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {validColumns.map((col) => (
                <th
                  key={String(col.key)}
                  scope="col"
                  className={col.className || "px-6 py-4 text-gray-700 dark:text-gray-300 whitespace-nowrap"}
                >
                  {col.label}
                </th>
              ))}
              {hasActions && (
                <th className={actionsColumn?.className || "px-6 py-4 text-gray-700 dark:text-gray-300 whitespace-nowrap text-center"}>
                  {actionsColumn?.label || ""}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading && (
              <tr>
                <td
                  colSpan={validColumns.length + (hasActions ? 1 : 0)}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Chargement...</span>
                  </div>
                </td>
              </tr>
            )}
            {!loading && paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={validColumns.length + (hasActions ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <span className="font-medium">{emptyMessage || "Aucune donnée disponible"}</span>
                  </div>
                </td>
              </tr>
            )}
            {!loading && paginatedData.map((row, i) => {
              const rowKey = row._id ? String(row._id) : `row-${i}`;
              return (
                <tr
                  key={rowKey}
                  className={
                    "bg-white dark:bg-gray-900 transition-colors duration-150" +
                    (onClickItem ? " hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" : "")
                  }
                  onClick={onClickItem ? () => onClickItem(row) : undefined}
                >
                  {validColumns.map((col, colIndex) => {
                    const colKey = col.key ?? col.label ?? colIndex;
                    const value = col.render
                      ? col.render(row)
                      : row[col.key as keyof T] ?? "";
                    return (
                      <td
                        key={`${rowKey}-${String(colKey)}`}
                        className={col.className || "px-6 py-4 text-gray-900 dark:text-gray-100"}
                      >
                        <div className="max-w-xs truncate" title={typeof value === 'string' ? value : undefined}>
                          {value}
                        </div>
                      </td>
                    );
                  })}
                  {hasActions && (
                    <td className={actionsColumn?.className || "px-6 py-4 text-center"}>
                      <div className="flex items-center justify-center gap-2">
                        {actionsColumn?.render ? actionsColumn.render(row) : null}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Affiche toujours la pagination si paginable, même si pageCount === 1 */}
      {paginable && (
        <DataTablePagination
          effectivePage={effectivePage}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
          effectiveRowPerPage={effectiveRowPerPage}
          handleRowPerPageChange={handleRowPerPageChange}
          total={total}
        />
      )}
    </div>
  );
}
