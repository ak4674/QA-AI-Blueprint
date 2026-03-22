import { useState } from 'react';
import type { Company } from '../types';
import { X } from 'lucide-react';

interface AddCompanyModalProps {
  onClose: () => void;
  onSave: (company: Company) => Promise<void>;
}

export function AddCompanyModal({ onClose, onSave }: AddCompanyModalProps) {
  const [formData, setFormData] = useState<Partial<Company>>({
    name: '',
    industry: '',
    location: '',
    logoText: '',
    logoColor: 'bg-blue-600',
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

    const newCompany: Company = {
      ...(formData as Company),
      id: crypto.randomUUID(),
      logoText: formData.logoText || formData.name.substring(0, 2).toUpperCase(),
    };
    
    await onSave(newCompany);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md shadow-2xl rounded-xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800 animate-slide-in">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Add Target Company
          </h2>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name *</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Acme Corp" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input name="location" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="San Francisco, CA" />
          </div>

          <div className="flex gap-4">
             <div className="flex-1">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
               <input name="industry" value={formData.industry} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Technology" />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color Marker</label>
               <select name="logoColor" value={formData.logoColor} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option value="bg-blue-600">Blue</option>
                  <option value="bg-purple-600">Purple</option>
                  <option value="bg-red-600">Red</option>
                  <option value="bg-green-600">Green</option>
                  <option value="bg-orange-600">Orange</option>
                  <option value="bg-teal-600">Teal</option>
               </select>
             </div>
          </div>

          <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm">
              Save Company
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
