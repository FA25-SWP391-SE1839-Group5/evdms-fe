import React from 'react';
import PropTypes from 'prop-types';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const DealerTable = ({
  data,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
  loading
}) => {
  const renderCell = (value) => value || '—';

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== pagination.page) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dealer Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Region</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Loading dealers...
                </td>
              </tr>
            )}
            
            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No dealers found
                </td>
              </tr>
            )}

            {!loading && data.length > 0 &&
              data.map((dealer) => (
                <tr key={dealer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-base font-semibold text-gray-900">
                      {renderCell(dealer.name)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      {renderCell(dealer.region)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {renderCell(dealer.address)}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {dealer.createdAt ? format(new Date(dealer.createdAt), 'dd/MM/yyyy') : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => onEdit(dealer)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                      >
                        <Pencil className="w-4 h-4" />
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                      <button
                        onClick={() => onDelete(dealer)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
        <span className="text-sm text-gray-500">
          Page {pagination.page} / {pagination.totalPages || 1}
        </span>
        <div className="inline-flex items-center rounded-xl overflow-hidden border border-gray-200">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white hover:bg-gray-100 disabled:opacity-50"
            disabled={pagination.page <= 1}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white hover:bg-gray-100 disabled:opacity-50 border-l border-gray-200"
            disabled={pagination.page >= (pagination.totalPages || 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

DealerTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    region: PropTypes.string,
    address: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string
  })).isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    pageSize: PropTypes.number,
    totalPages: PropTypes.number,
    totalItems: PropTypes.number
  }).isRequired,
  onPageChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

DealerTable.defaultProps = {
  loading: false
};

export default DealerTable;