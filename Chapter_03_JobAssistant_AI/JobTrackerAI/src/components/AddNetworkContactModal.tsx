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
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-card w-full max-w-md h-full shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-y-auto flex flex-col border-l border-neon-blue/20 animate-slide-in">
        <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Add Network Contact
          </h2>
          <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 flex flex-col">
          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name *</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-black/20 text-white placeholder-slate-600 focus:ring-1 focus:ring-neon-blue focus:border-neon-blue outline-none transition-all" placeholder="Jane Doe" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Job Title / Role</label>
              <input name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-black/20 text-white placeholder-slate-600 focus:ring-1 focus:ring-neon-blue focus:border-neon-blue outline-none transition-all" placeholder="Senior Engineering Manager" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Company *</label>
              <input required name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-black/20 text-white placeholder-slate-600 focus:ring-1 focus:ring-neon-blue focus:border-neon-blue outline-none transition-all" placeholder="Tech Innovations Inc." />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Status ⚑</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-black/20 text-white focus:ring-1 focus:ring-neon-blue focus:border-neon-blue outline-none transition-all appearance-none cursor-pointer">
                {STATUSES.map(s => (
                  <option key={s} value={s} className="bg-[#0B1120]">{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">LinkedIn URL</label>
              <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-black/20 text-white placeholder-slate-600 focus:ring-1 focus:ring-neon-blue focus:border-neon-blue outline-none transition-all" placeholder="https://linkedin.com/in/..." />
            </div>

            <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tags</label>
               <div className="flex flex-wrap gap-2">
                  {PRESET_TAGS.map(tag => (
                     <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold border transition-all ${
                           formData.tags?.includes(tag) 
                            ? 'bg-neon-blue/20 border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,242,255,0.2)]' 
                            : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30'
                        }`}
                     >
                        {tag}
                     </button>
                  ))}
               </div>
            </div>

            <div className="flex-1 min-h-[100px] flex flex-col">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full flex-1 px-4 py-3 border border-white/10 rounded-lg bg-black/20 text-white placeholder-slate-600 focus:ring-1 focus:ring-neon-blue focus:border-neon-blue outline-none resize-none transition-all" placeholder="Met at the JS Conference..." />
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/5 flex justify-end gap-3 sticky bottom-0 bg-card/80 backdrop-blur-md shrink-0">
            <button type="button" onClick={onClose} className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-all">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-white bg-neon-blue/20 border border-neon-blue rounded-lg hover:bg-neon-blue/40 shadow-[0_0_20px_rgba(0,242,255,0.2)] transition-all">
              Create Connection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
