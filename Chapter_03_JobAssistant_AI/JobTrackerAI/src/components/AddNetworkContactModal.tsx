import { useState } from 'react';
import type { NetworkContact, NetworkStatus, ContactTag } from '../types';
import { X } from 'lucide-react';

interface AddNetworkContactModalProps {
  onClose: () => void;
  onSave: (contact: NetworkContact) => Promise<void>;
}

const STATUSES: NetworkStatus[] = ['Sent', 'Accepted', 'Engagement', 'Converted', 'Rejected'];
const PRESET_TAGS: ContactTag[] = ['Open Job', 'Target Company', 'Potential Referrer', 'Hiring Manager', 'Recruiter'];

export function AddNetworkContactModal({ onClose, onSave }: AddNetworkContactModalProps) {
  const [formData, setFormData] = useState<Partial<NetworkContact>>({
    name: '',
    title: '',
    company: '',
    linkedinUrl: '',
    status: 'Sent',
    avatarColor: 'bg-blue-500',
    tags: [],
    dateAdded: Date.now(),
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag: ContactTag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...(prev.tags || []), tag]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company) return;

    const newContact: NetworkContact = {
      ...(formData as NetworkContact),
      id: crypto.randomUUID(),
      tags: formData.tags || []
    };
    
    await onSave(newContact);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 transition-opacity">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md h-full shadow-2xl overflow-y-auto flex flex-col border-l border-gray-200 dark:border-gray-800 animate-slide-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Add Network Contact
          </h2>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 flex flex-col">
          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Jane Doe" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title / Role</label>
              <input name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Senior Engineering Manager" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company *</label>
              <input required name="company" value={formData.company} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Tech Innovations Inc." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status ⚑</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 outline-none">
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn URL</label>
              <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="https://linkedin.com/in/..." />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
               <div className="flex flex-wrap gap-2">
                  {PRESET_TAGS.map(tag => (
                     <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                           formData.tags?.includes(tag) 
                            ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/40 dark:border-blue-400 dark:text-blue-300' 
                            : 'bg-white border-gray-300 text-gray-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 hover:border-blue-300'
                        }`}
                     >
                        {tag}
                     </button>
                  ))}
               </div>
            </div>

            <div className="flex-1 min-h-[100px] flex flex-col">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" placeholder="Met at the JS Conference..." />
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-gray-900 shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm">
              Create Connection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
