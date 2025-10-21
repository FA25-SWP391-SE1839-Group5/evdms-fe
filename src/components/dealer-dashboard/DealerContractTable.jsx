import React from 'react';
import PropTypes from 'prop-types';
import { Pencil, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { formatCurrency } from '../../../utils/formatters';

const DealerContractTable = ({
  contracts,
  loading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
  dealerLookup
}) => {
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== pagination.page) {
      onPageChange(newPage);
    }
  };

  const renderDate = (value) => {
    if (!value) return '—';
    const date = typeof value === 'string' ? parseISO(value) : new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return format(date, 'dd/MM/yyyy');
  };

  const renderDealerName = (dealerId) => {
    if (!dealerId) return '—';
    return dealerLookup[dealerId] || dealerId;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dealer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">End Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sales Target</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Outstanding Debt</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Loading contracts...
                </td>
              </tr>
            )}

            {!loading && contracts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No contracts found
                </td>
              </tr>
            )}

            {!loading && contracts.length > 0 &&
              contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      {renderDealerName(contract.dealerId)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm">
                    {renderDate(contract.startDate)}
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm">
                    {renderDate(contract.endDate)}
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {formatCurrency(contract.salesTarget)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      contract.outstandingDebt > 0
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {formatCurrency(contract.outstandingDebt)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => onEdit(contract)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                      >
                        <Pencil className="w-4 h-4" />
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                      <button
                        onClick={() => onDelete(contract)}
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

DealerContractTable.propTypes = {
  contracts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    dealerId: PropTypes.string,
    startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    salesTarget: PropTypes.number,
    outstandingDebt: PropTypes.number
  })).isRequired,
  loading: PropTypes.bool,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    pageSize: PropTypes.number,
    totalPages: PropTypes.number,
    totalItems: PropTypes.number
  }).isRequired,
  onPageChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  dealerLookup: PropTypes.objectOf(PropTypes.string)
};

DealerContractTable.defaultProps = {
  loading: false,
  dealerLookup: {}
};

export default DealerContractTable;