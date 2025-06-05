"use client";

import React from "react";

interface PaginationFooterProps {
  currentPage: number;
  rowsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

const PaginationFooter: React.FC<PaginationFooterProps> = ({
  currentPage,
  rowsPerPage,
  totalItems,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6 text-sm select-none">
      {/* Row Selector */}
      <div className="flex items-center space-x-2">
        <label
          htmlFor="rowsPerPage"
          className="text-gray-700 dark:text-gray-300 font-medium"
        >
          Rows per page:
        </label>
        <select
          id="rowsPerPage"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="px-3 py-1 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {[10, 20, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination Buttons */}
      <div className="flex justify-center space-x-1">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-700 hover:text-green-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Previous
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md border transition-colors duration-200
              ${
                page === currentPage
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-green-100 dark:hover:bg-green-700 hover:text-green-700 dark:hover:text-white"
              }
              focus:outline-none focus:ring-2 focus:ring-green-400`}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-700 hover:text-green-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationFooter;
