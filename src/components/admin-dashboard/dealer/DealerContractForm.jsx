import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Calendar, Target, Wallet, Building2 } from 'lucide-react';
import { formatISO } from 'date-fns';

const defaultForm = {
  dealerId: '',
  startDate: '',
  endDate: '',
  salesTarget: '',
  outstandingDebt: ''
};

const DealerContractForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading,
  dealers
}) => {
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          dealerId: initialData.dealerId || '',
          startDate: initialData.startDate ? formatISO(new Date(initialData.startDate), { representation: 'date' }) : '',
          endDate: initialData.endDate ? formatISO(new Date(initialData.endDate), { representation: 'date' }) : '',
          salesTarget: initialData.salesTarget ?? '',
          outstandingDebt: initialData.outstandingDebt ?? ''
        });
      } else {
        setFormData(defaultForm);
      }
      setErrors({});
    }
  }, [open, initialData]);

  const dealerOptions = useMemo(() => {
    return dealers.map((dealer) => ({
      value: dealer.id,
      label: dealer.name
    }));
  }, [dealers]);

  const validate = () => {
    const newErrors = {};
    if (!formData.dealerId) newErrors.dealerId = 'Please select a dealer';
    if (!formData.startDate) newErrors.startDate = 'Please select start date';
    if (!formData.endDate) newErrors.endDate = 'Please select end date';

    const start = formData.startDate ? new Date(formData.startDate) : null;
    const end = formData.endDate ? new Date(formData.endDate) : null;
    if (start && end && start > end) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (formData.salesTarget === '' || Number(formData.salesTarget) < 0) {
      newErrors.salesTarget = 'Sales target must be greater than or equal to 0';
    }

    if (formData.outstandingDebt === '' || Number(formData.outstandingDebt) < 0) {
      newErrors.outstandingDebt = 'Outstanding debt must be greater than or equal to 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      dealerId: formData.dealerId,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      salesTarget: Number(formData.salesTarget),
      outstandingDebt: Number(formData.outstandingDebt)
    });
  };



  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-gray-100">
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
          <h3 className="text-2xl font-bold text-gray-800">
            {initialData ? 'Edit Contract' : 'Create New Contract'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Set sales targets and outstanding debt for the dealer.
          </p>
        </div>

  <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              Dealer
            </label>
            <select
              name="dealerId"
              value={formData.dealerId}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.dealerId ? 'border-red-300 ring-2 ring-red-100 bg-red-50/30' : 'border-gray-200 focus:ring-2 focus:ring-purple-100'} focus:outline-none transition`}
            >
              <option value="">-- Select Dealer --</option>
              {dealerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.dealerId && <p className="text-xs text-red-500 mt-2">{errors.dealerId}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-green-500" />
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${errors.startDate ? 'border-red-300 ring-2 ring-red-100 bg-red-50/30' : 'border-gray-200 focus:ring-2 focus:ring-purple-100'} focus:outline-none transition`}
              />
              {errors.startDate && <p className="text-xs text-red-500 mt-2">{errors.startDate}</p>}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-red-500" />
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${errors.endDate ? 'border-red-300 ring-2 ring-red-100 bg-red-50/30' : 'border-gray-200 focus:ring-2 focus:ring-purple-100'} focus:outline-none transition`}
              />
              {errors.endDate && <p className="text-xs text-red-500 mt-2">{errors.endDate}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Target className="w-4 h-4 text-purple-500" />
                Sales Target (VND)
              </label>
              <input
                type="number"
                name="salesTarget"
                value={formData.salesTarget}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-3 rounded-xl border ${errors.salesTarget ? 'border-red-300 ring-2 ring-red-100 bg-red-50/30' : 'border-gray-200 focus:ring-2 focus:ring-purple-100'} focus:outline-none transition`}
              />
              {errors.salesTarget && <p className="text-xs text-red-500 mt-2">{errors.salesTarget}</p>}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Wallet className="w-4 h-4 text-amber-500" />
                Outstanding Debt (VND)
              </label>
              <input
                type="number"
                name="outstandingDebt"
                value={formData.outstandingDebt}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-3 rounded-xl border ${errors.outstandingDebt ? 'border-red-300 ring-2 ring-red-100 bg-red-50/30' : 'border-gray-200 focus:ring-2 focus:ring-purple-100'} focus:outline-none transition`}
              />
              {errors.outstandingDebt && <p className="text-xs text-red-500 mt-2">{errors.outstandingDebt}</p>}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 transition disabled:opacity-60"
              disabled={loading}
            >
              {(() => {
                if (loading) return 'Saving...';
                return initialData ? 'Update' : 'Create';
              })()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealerContractForm;

DealerContractForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.string,
    dealerId: PropTypes.string,
    startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    salesTarget: PropTypes.number,
    outstandingDebt: PropTypes.number
  }),
  loading: PropTypes.bool,
  dealers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }))
};

DealerContractForm.defaultProps = {
  initialData: null,
  loading: false,
  dealers: []
};
