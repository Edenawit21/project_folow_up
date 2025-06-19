// src/components/ui/Table.tsx
import React from 'react';

interface TableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
}

const Table = <T extends object>({ headers, data, renderRow, emptyMessage }: TableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map(renderRow)
          ) : (
            <tr>
              <td colSpan={headers.length} className="px-6 py-4 text-center text-gray-500">
                {emptyMessage || 'No data available.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
