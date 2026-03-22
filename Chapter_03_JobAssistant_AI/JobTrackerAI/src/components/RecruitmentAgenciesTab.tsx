import { useState, useEffect } from 'react';
import type { Agency } from '../types';
import { getAllAgencies, addAgency } from '../db';
import { Plus, Search, Building2, MapPin, Users, Briefcase } from 'lucide-react';
import { AddAgencyModal } from './AddAgencyModal';

export function RecruitmentAgenciesTab({ onOpenLumi }: { onOpenLumi?: (q?: string) => void }) {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getAllAgencies().then(setAgencies).catch(console.error);
  }, []);

  const handleSave = async (agency: Agency) => {
    await addAgency(agency);
    setAgencies(prev => [...prev, agency]);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      <div className="flex-shrink-0 p-6 flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold text-slate-100">Recruitment Agencies</h2>
           <p className="text-slate-400 text-sm mt-1">Track recruitment agencies and explore job opportunities</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
             <input placeholder="Search agencies..." className="pl-10 pr-4 py-2 border border-slate-800 rounded-lg bg-[#131B2B] text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all" />
           </div>
           <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-purple-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-purple-400 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <Plus size={18} />
              Add Agency
           </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
           {agencies.length === 0 ? (
             <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                <Building2 size={48} className="mx-auto mb-4 text-slate-600" />
                <p>No recruitment agencies added yet.</p>
             </div>
           ) : (
             agencies.map(agency => (
               <div key={agency.id} className="bg-[#131B2B] border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-colors flex flex-col group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-start justify-between mb-4 relative z-10">
                     <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-black/20 ${agency.logoColor || 'bg-purple-600'}`}>
                        {agency.logoText}
                     </div>
                  </div>
                  <h3 className="font-semibold text-lg text-slate-100 mb-1 relative z-10">{agency.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-4 relative z-10">
                     <MapPin size={14} className="text-slate-500" />
                     <span>{agency.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-slate-300 mb-5 relative z-10">
                     <div className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1 rounded-md border border-slate-700/50">
                        <Briefcase size={14} className="text-cyan-400" />
                        <span>{agency.jobCount} Jobs</span>
                     </div>
                     <div className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1 rounded-md border border-slate-700/50">
                        <Users size={14} className="text-purple-400" />
                        <span>{agency.networkCount} Networks</span>
                     </div>
                  </div>
                  
                  <div className="mt-auto border-t border-slate-800/80 pt-4 flex gap-2 justify-end relative z-10">
                     <button onClick={() => onOpenLumi?.(`Analyze this recruitment agency: ${agency.name}`)} className="agentic-btn px-4 py-1.5 text-xs">Ask Lumi</button>
                     <button className="px-3 py-1.5 text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded text-sm hover:bg-orange-500/20 transition-colors">Networks</button>
                     <button className="px-3 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded text-sm hover:bg-purple-500/20 transition-colors">Jobs</button>
                  </div>
               </div>
             ))
           )}
        </div>
      </div>

      {isModalOpen && (
        <AddAgencyModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
}
