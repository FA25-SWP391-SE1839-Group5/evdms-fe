import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Plus,
  RefreshCw,
  Search,
  Factory,
  FileText
} from 'lucide-react';
import {
  getAllDealers,
  createDealer,
  updateDealer,
  deleteDealer,
  getAllDealerContracts,
  createDealerContract,
  updateDealerContract,
  deleteDealerContract,
  getDealerById,
  getDealerContractById
} from '../../../services/dashboardService';
import DealerTable from './DealerTable';
import DealerForm from './DealerForm';
import DealerContractTable from './DealerContractTable';
import DealerContractForm from './DealerContractForm';
import { buildPaginationState } from '../../../utils/formatters';

const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 10,
  totalPages: 1,
  totalItems: 0
};

const DealerManagement = ({ showHeader }) => {
  const [notification, setNotification] = useState(null);

  // dealer state
  const [dealerList, setDealerList] = useState([]);
  const [dealerPagination, setDealerPagination] = useState(DEFAULT_PAGINATION);
  const [dealerLoading, setDealerLoading] = useState(false);
  const [dealerModalOpen, setDealerModalOpen] = useState(false);
  const [dealerSubmitting, setDealerSubmitting] = useState(false);
  const [editingDealer, setEditingDealer] = useState(null);
  const [dealerParams, setDealerParams] = useState({ page: 1, pageSize: 10, search: '' });
  const [dealerSearch, setDealerSearch] = useState('');

  // dealer contract state
  const [contractList, setContractList] = useState([]);
  const [contractPagination, setContractPagination] = useState(DEFAULT_PAGINATION);
  const [contractLoading, setContractLoading] = useState(false);
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [contractSubmitting, setContractSubmitting] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [contractParams, setContractParams] = useState({ page: 1, pageSize: 10, search: '' });
  const [contractSearch, setContractSearch] = useState('');

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [notification]);

  const dealerLookup = useMemo(() => (
    dealerList.reduce((acc, dealer) => {
      if (dealer.id) acc[dealer.id] = dealer.name;
      return acc;
    }, {})
  ), [dealerList]);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const loadDealers = useCallback(async () => {
    setDealerLoading(true);
    try {
      const response = await getAllDealers(dealerParams);
      const parsed = buildPaginationState(response);
      setDealerList(parsed.items);
      setDealerPagination({
        page: parsed.page,
        pageSize: parsed.pageSize,
        totalPages: parsed.totalPages,
        totalItems: parsed.totalItems
      });
    } catch (error) {
      console.error('loadDealers error', error);
      showToast('Failed to load dealers list. Please try again.', 'error');
    } finally {
      setDealerLoading(false);
    }
  }, [dealerParams]);

  const loadContracts = useCallback(async () => {
    setContractLoading(true);
    try {
      const params = {
        ...contractParams,
        dealerId: contractParams.dealerId || undefined
      };
      const response = await getAllDealerContracts(params);
      const parsed = buildPaginationState(response);
      setContractList(parsed.items);
      setContractPagination({
        page: parsed.page,
        pageSize: parsed.pageSize,
        totalPages: parsed.totalPages,
        totalItems: parsed.totalItems
      });
    } catch (error) {
      console.error('loadContracts error', error);
      showToast('Failed to load contracts list. Please try again.', 'error');
    } finally {
      setContractLoading(false);
    }
  }, [contractParams]);

  useEffect(() => {
    loadDealers();
  }, [loadDealers]);

  useEffect(() => {
    loadContracts();
  }, [loadContracts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDealerParams((prev) => ({ ...prev, page: 1, search: dealerSearch }));
    }, 400);
    return () => clearTimeout(timer);
  }, [dealerSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContractParams((prev) => ({ ...prev, page: 1, search: contractSearch }));
    }, 400);
    return () => clearTimeout(timer);
  }, [contractSearch]);

  const handleCreateDealer = () => {
    setEditingDealer(null);
    setDealerModalOpen(true);
  };

  const handleEditDealer = async (dealer) => {
    try {
      const detail = await getDealerById(dealer.id);
      setEditingDealer(detail?.data || detail || dealer);
      setDealerModalOpen(true);
    } catch (error) {
      console.error('getDealerById error', error);
      setEditingDealer(dealer);
      setDealerModalOpen(true);
    }
  };

  const handleDealerSubmit = async (payload) => {
    setDealerSubmitting(true);
    try {
      if (editingDealer) {
        await updateDealer(editingDealer.id, payload);
        showToast('dealer updated successfully.');
      } else {
        await createDealer(payload);
        showToast('dealer created successfully.');
      }
      setDealerModalOpen(false);
      await loadDealers();
    } catch (error) {
      console.error('handleDealerSubmit error', error);
      showToast('Failed to save dealer. Please check and try again.', 'error');
    } finally {
      setDealerSubmitting(false);
    }
  };

  const handleDeleteDealer = async (dealer) => {
    if (!window.confirm(`Are you sure you want to delete dealer "${dealer.name}"?`)) {
      return;
    }

    try {
      await deleteDealer(dealer.id);
      showToast('dealer deleted successfully.');
      await loadDealers();
      await loadContracts();
    } catch (error) {
      console.error('handleDeleteDealer error', error);
      showToast('Failed to delete dealer.', 'error');
    }
  };

  const handleCreateContract = () => {
    setEditingContract(null);
    setContractModalOpen(true);
  };

  const handleEditContract = async (contract) => {
    try {
      const detail = await getDealerContractById(contract.id);
      setEditingContract(detail?.data || detail || contract);
      setContractModalOpen(true);
    } catch (error) {
      console.error('getDealerContractById error', error);
      setEditingContract(contract);
      setContractModalOpen(true);
    }
  };

  const handleContractSubmit = async (payload) => {
    setContractSubmitting(true);
    try {
      if (editingContract) {
        await updateDealerContract(editingContract.id, payload);
        showToast('Contract updated successfully.');
      } else {
        await createDealerContract(payload);
        showToast('Contract created successfully.');
      }
      setContractModalOpen(false);
      await loadContracts();
    } catch (error) {
      console.error('handleContractSubmit error', error);
      showToast('Failed to save contract.', 'error');
    } finally {
      setContractSubmitting(false);
    }
  };



  const handleDeleteContract = async (contract) => {
    if (!window.confirm('Are you sure you want to delete this contract?')) return;

    try {
      await deleteDealerContract(contract.id);
      showToast('Contract deleted successfully.');
      await loadContracts();
    } catch (error) {
      console.error('handleDeleteContract error', error);
      showToast('Failed to delete contract.', 'error');
    }
  };

  const contractFilters = useMemo(() => ([
    { value: '', label: 'All Dealers' },
    ...dealerList.map((dealer) => ({ value: dealer.id, label: dealer.name }))
  ]), [dealerList]);

  const renderNotification = () => (
    notification && (
      <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-lg border ${
        notification.type === 'success'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
          : 'bg-red-50 border-red-200 text-red-700'
      }`}
      >
        {notification.message}
      </div>
    )
  );

  return (
    <div className="space-y-10">
      {renderNotification()}

      {showHeader && (
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100 mb-3">
              <Factory className="w-4 h-4" />
              <span className="text-sm font-semibold">Dealer System</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Dealer & Contract Management
            </h2>
            <p className="text-gray-500 mt-2 max-w-2xl">
              Track dealer information, manage distribution contracts, sales targets and outstanding debts in a unified interface.
            </p>
          </div>
          <button
            onClick={() => {
              loadDealers();
              loadContracts();
            }}
            className="self-start flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 text-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </button>
        </header>
      )}

      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={dealerSearch}
                onChange={(e) => setDealerSearch(e.target.value)}
                placeholder="Search dealers by name, region..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateDealer}
              className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              Add Dealer
            </button>
          </div>
        </div>

        <DealerTable
          data={dealerList}
          pagination={dealerPagination}
          loading={dealerLoading}
          onPageChange={(page) => setDealerParams((prev) => ({ ...prev, page }))}
          onEdit={handleEditDealer}
          onDelete={handleDeleteDealer}
        />
      </section>

      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={contractSearch}
                onChange={(e) => setContractSearch(e.target.value)}
                placeholder="Search contracts by dealer..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={contractParams.dealerId || ''}
              onChange={(e) => setContractParams((prev) => ({ ...prev, page: 1, dealerId: e.target.value || undefined }))}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-purple-100 focus:border-purple-400 text-gray-600"
            >
              {contractFilters.map((option) => (
                <option key={option.value || 'all'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleCreateContract}
              className="inline-flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700 transition"
            >
              <FileText className="w-4 h-4" />
              Add Contract
            </button>
          </div>
        </div>

        <DealerContractTable
          contracts={contractList}
          pagination={contractPagination}
          loading={contractLoading}
          dealerLookup={dealerLookup}
          onPageChange={(page) => setContractParams((prev) => ({ ...prev, page }))}
          onEdit={handleEditContract}
          onDelete={handleDeleteContract}
        />
      </section>

      <DealerForm
        open={dealerModalOpen}
        onClose={() => setDealerModalOpen(false)}
        onSubmit={handleDealerSubmit}
        initialData={editingDealer}
        loading={dealerSubmitting}
      />

      <DealerContractForm
        open={contractModalOpen}
        onClose={() => setContractModalOpen(false)}
        onSubmit={handleContractSubmit}
        initialData={editingContract}
        loading={contractSubmitting}
        dealers={dealerList}
      />
    </div>
  );
};

DealerManagement.propTypes = {
  showHeader: PropTypes.bool
};

DealerManagement.defaultProps = {
  showHeader: true
};

export default DealerManagement;
