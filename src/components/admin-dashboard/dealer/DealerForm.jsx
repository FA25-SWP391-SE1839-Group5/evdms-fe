import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Building2, MapPin, Globe2 } from 'lucide-react';

const defaultForm = {
  name: '',
  region: '',
  address: ''
};

const DealerForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading
}) => {
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setFormData(initialData ? {
        name: initialData.name || '',
        region: initialData.region || '',
        address: initialData.address || ''
      } : defaultForm);
      setErrors({});
    }
  }, [open, initialData]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'dealer name is required';
    }

    if (!formData.region.trim()) {
      newErrors.region = 'Region is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };



  if (!open) return null;

  const submitLabel = initialData ? 'Update' : 'Create';

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-2xl font-bold text-gray-800">
            {initialData ? 'Edit dealer' : 'Add New dealer'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Fill in all the information to manage the dealer system effectively.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              Dealer Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., EV Auto Hanoi"
              className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-300 ring-2 ring-red-100 bg-red-50/30' : 'border-gray-200 focus:ring-2 focus:ring-blue-100'} focus:outline-none transition`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-2">{errors.name}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Globe2 className="w-4 h-4 text-green-500" />
              Region
            </label>
            <input
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="e.g., Northern Region"
              className={`w-full px-4 py-3 rounded-xl border ${errors.region ? 'border-red-300 ring-2 ring-red-100 bg-red-50/30' : 'border-gray-200 focus:ring-2 focus:ring-blue-100'} focus:outline-none transition`}
            />
            {errors.region && <p className="text-xs text-red-500 mt-2">{errors.region}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 text-purple-500" />
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 ABC Street, XYZ District, City..."
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border ${errors.address ? 'border-red-300 ring-2 ring-red-100 bg-red-50/30' : 'border-gray-200 focus:ring-2 focus:ring-blue-100'} focus:outline-none transition resize-none`}
            />
            {errors.address && <p className="text-xs text-red-500 mt-2">{errors.address}</p>}
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
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealerForm;

DealerForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    region: PropTypes.string,
    address: PropTypes.string
  }),
  loading: PropTypes.bool
};

DealerForm.defaultProps = {
  initialData: null,
  loading: false
};
