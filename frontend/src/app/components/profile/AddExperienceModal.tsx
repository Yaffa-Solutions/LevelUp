'use client';
import { useState } from 'react';
import CloseButton from './CloseButton';
import SaveButton from './SaveButton';
import { Experience } from '@/app/types/userTypes';
import { toast } from 'react-hot-toast';

type AddExperienceModalProps = {
  userId: string;
  onSave: (newExp: Experience) => void;
  onClose: () => void;
};

const AddExperienceModal = ({
  userId,
  onSave,
  onClose,
}: AddExperienceModalProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company_name: '',
    position: '',
    start_date: '',
    end_date: '',
    description: '',
    employment_type: '',
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.company_name.trim())
      newErrors.company_name = 'Company name is required';
    if (!form.position.trim()) newErrors.position = 'Position is required';
    if (!form.start_date) newErrors.start_date = 'Start date is required';
    if (!form.end_date) newErrors.end_date = 'End date is required';
    if (!form.description.trim())
      newErrors.description = 'Description is required';
    if (!form.employment_type)
      newErrors.employment_type = 'Employment type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    fetch('http://localhost:5000/api/experiences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, user_id: userId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to create experience');
        return res.json();
      })
      .then((newExperience) => {
        toast.success('Experience added successfully');
        onSave(newExperience);
        onClose();
      })
      .catch((error) => {
        console.error('Error creating experience:', error);
        toast.error('Something went wrong while adding experience');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <div className="bg-white rounded-2xl p-6 w-[600px] relative shadow-lg">
        <div className="relative flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Add Experience
          </h3>
          <CloseButton onClick={onClose} />
        </div>
        <form>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label
                  htmlFor="company_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="company_name"
                  type="text"
                  name="company_name"
                  placeholder="Company Name"
                  value={form.company_name}
                  onChange={handleChange}
                  className="w-full pl-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 transition duration-200"
                  required
                />
                {errors.company_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.company_name}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="position"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Position <span className="text-red-500">*</span>
                </label>
                <input
                  id="position"
                  type="text"
                  name="position"
                  placeholder="Position"
                  value={form.position}
                  onChange={handleChange}
                  className="w-full pl-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 transition duration-200"
                  required
                />
                {errors.position && (
                  <p className="text-red-500 text-xs mt-1">{errors.position}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label
                  htmlFor="start_date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="start_date"
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  className="w-full pl-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900 transition duration-200"
                  required
                />
                {errors.start_date && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.start_date}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="end_date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="end_date"
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  className="w-full pl-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900 transition duration-200"
                  required
                />
                {errors.end_date && (
                  <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full h-28 pl-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 transition duration-200 resize-none"
                required
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="employment_type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Employment Type <span className="text-red-500">*</span>
              </label>
              <select
                id="employment_type"
                name="employment_type"
                value={form.employment_type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl py-3 pl-5 text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-200"
                required
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
              {errors.employment_type && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.employment_type}
                </p>
              )}
            </div>
          </div>
        </form>
        <SaveButton
          onClick={handleSave}
          disabled={loading}
          loading={loading}
          text="Add"
          loadingText="Adding..."
        />
      </div>
    </div>
  );
};

export default AddExperienceModal;
