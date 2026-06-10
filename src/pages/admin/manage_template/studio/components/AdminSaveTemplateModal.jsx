import React, { useState, useEffect } from 'react';
import Modal from '../../../../../components/Modal';
import useCategories from '../../../../../api/categories/useCategories';
import { toast } from 'react-toastify';

const SaveTemplateModal = ({ open, onClose, onSave, initialData, isCreatingNew }) => {
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    label: 'Free',
    description: '',
  });
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categorySelectRef = React.useRef(null);
  const { data: categories, getList: getCategories } = useCategories();

  // Get all categories when component mounts
  useEffect(() => {
    getCategories({ limit: 999 });
  }, [getCategories]);

  // Handle click outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (categorySelectRef.current && !categorySelectRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && !categories.length) {
      getCategories({ limit: 999 });
    }
  }, [open, categories.length, getCategories]);

  useEffect(() => {
    if (open && initialData) {
      setFormData({
        title: initialData.title || '',
        category_id: initialData.category_id || '',
        label: initialData.label || 'Free',
        description: initialData.description || '',
      });
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category_id) {
      toast.error("Judul dan Kategori wajib diisi.");
      return;
    }

    // Log data form sebelum dikirim
    console.log('SaveTemplateModal - Form Data:', {
      title: formData.title,
      category_id: formData.category_id,
      label: formData.label,
      description: formData.description
    });

    // Log mode (create/edit) dan initial data jika ada
    console.log('SaveTemplateModal - Mode:', isCreatingNew ? 'Create New' : 'Edit');
    if (initialData) {
      console.log('SaveTemplateModal - Initial Data:', initialData);
    }

    // Log perbandingan data sebelum dan sesudah perubahan
    if (!isCreatingNew && initialData) {
      const changes = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== initialData[key]) {
          changes[key] = {
            from: initialData[key],
            to: formData[key]
          };
        }
      });
      console.log('SaveTemplateModal - Changes Made:', changes);
    }

    onSave(formData);
  };

  const renderFooter = () => (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium transition shadow-sm"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="save-template-form"
        className="px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition shadow-lg"
      >
        {isCreatingNew ? 'Create Template' : 'Save Changes'}
      </button>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isCreatingNew ? "Create New Template" : "Edit Template"}
      footer={renderFooter()}
      size="2xl"
    >
      <div className="bg-white rounded-xl">
        <form id="save-template-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Template Name
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Enter template name..."
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Category
              </label>
              <div className="relative" ref={categorySelectRef}>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={(e) => {
                    handleChange(e);
                    setIsCategoryOpen(false);
                  }}
                  required
                  className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition [&:not([size])]:h-[52px] [&[size]]:h-auto appearance-none"
                  size={isCategoryOpen ? "4" : null}
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  onBlur={() => setIsCategoryOpen(false)}
                >
                  <option value="" disabled>Select category...</option>
                  {categories.map(cat => (
                    <option 
                      key={cat.id} 
                      value={cat.id} 
                      className="p-2 hover:bg-blue-50"
                    >
                      {cat.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Label
              </label>
              <select
                name="label"
                value={formData.label}
                onChange={handleChange}
                className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="Free">Free</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Enter template description..."
              />
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default SaveTemplateModal;