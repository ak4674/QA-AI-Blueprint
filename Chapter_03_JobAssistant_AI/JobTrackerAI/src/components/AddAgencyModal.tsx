import { useState } from 'react';
import type { Agency } from '../types';
import { X } from 'lucide-react';

interface AddAgencyModalProps {
  onClose: () => void;
  onSave: (agency: Agency) => Promise<void>;
}

export function AddAgencyModal({ onClose, onSave }: AddAgencyModalProps) {
  const [formData, setFormData] = useState<Partial<Agency>>({
    name: '',
    location: '',
    logoText: '',
    logoColor: 'bg-purple-600',
    jobCount: 0,
    networkCount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'jobCount' || name === 'networkCount' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newAgency: Agency = {
      ...(formData as Agency),
      id: crypto.randomUUID(),
      logoText: formData.logoText || formData.name.substring(0, 2).toUpperCase(),
    };
    
    await onSave(newAgency);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md shadow-2xl rounded-xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800 animate-slide-in">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Add Recruitment Agency
          </h2>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agency Name *</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Global Tech Recruiters" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input name="location" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Remote / London" />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color Marker</label>
             <select name="logoColor" value={formData.logoColor} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 outline-none">
                <option value="bg-purple-600">Purple</option>
                <option value="bg-blue-600">Blue</option>
                <option value="bg-indigo-600">Indigo</option>
                <option value="bg-pink-600">Pink</option>
                <option value="bg-rose-600">Rose</option>
             </select>
          </div>

          <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-sm">
              Save Agency
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
