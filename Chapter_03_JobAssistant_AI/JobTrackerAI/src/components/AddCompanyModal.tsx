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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity p-4">
      <div className="bg-card w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden flex flex-col border border-white/5 animate-slide-in">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Add Target Company
          </h2>
          <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Company Name *</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-black/20 text-white placeholder-slate-600 focus:ring-1 focus:ring-neon-blue focus:border-neon-blue outline-none transition-all" placeholder="Acme Corp" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Location</label>
            <input name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-black/20 text-white placeholder-slate-600 focus:ring-1 focus:ring-neon-blue focus:border-neon-blue outline-none transition-all" placeholder="San Francisco, CA" />
          </div>

          <div className="flex gap-4">
             <div className="flex-1">
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Industry</label>
               <input name="industry" value={formData.industry} onChange={handleChange} className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-black/20 text-white placeholder-slate-600 focus:ring-1 focus:ring-neon-blue focus:border-neon-blue outline-none transition-all" placeholder="Technology" />
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Color Marker</label>
               <select name="logoColor" value={formData.logoColor} onChange={handleChange} className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-black/20 text-white focus:ring-1 focus:ring-neon-blue focus:border-neon-blue outline-none transition-all cursor-pointer appearance-none">
                  <option value="bg-blue-600" className="bg-[#0B1120]">Blue</option>
                  <option value="bg-purple-600" className="bg-[#0B1120]">Purple</option>
                  <option value="bg-red-600" className="bg-[#0B1120]">Red</option>
                  <option value="bg-green-600" className="bg-[#0B1120]">Green</option>
                  <option value="bg-orange-600" className="bg-[#0B1120]">Orange</option>
                  <option value="bg-teal-600" className="bg-[#0B1120]">Teal</option>
               </select>
             </div>
          </div>

          <div className="pt-6 mt-2 border-t border-white/5 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-all">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-white bg-neon-blue/20 border border-neon-blue rounded-lg hover:bg-neon-blue/40 shadow-[0_0_20px_rgba(0,242,255,0.2)] transition-all">
              Save Company
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
