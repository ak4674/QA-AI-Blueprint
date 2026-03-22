import { useState, useEffect } from 'react';
import type { NetworkContact, NetworkStatus } from '../types';
import { getAllNetworkContacts, addNetworkContact } from '../db';
import { Search, Plus, ExternalLink, Linkedin } from 'lucide-react';
import { AddNetworkContactModal } from './AddNetworkContactModal';

const COLUMNS: { id: NetworkStatus; label: string; color: string }[] = [
  { id: 'Sent', label: 'Sent', color: 'bg-slate-800/80 text-slate-300 border border-slate-700/50' },
  { id: 'Accepted', label: 'Accepted', color: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  { id: 'Engagement', label: 'Engagement', color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  { id: 'Converted', label: 'Converted', color: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' },
  { id: 'Rejected', label: 'Rejected', color: 'bg-red-500/20 text-red-400 border border-red-500/30' },
];

export function MyNetworkTab() {
  const [contacts, setContacts] = useState<NetworkContact[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getAllNetworkContacts().then(setContacts).catch(console.error);
  }, []);

  const handleSave = async (contact: NetworkContact) => {
    await addNetworkContact(contact);
    setContacts(prev => [...prev, contact]);
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      <div className="flex-shrink-0 bg-transparent border-b border-slate-800/80 p-4 px-6 flex items-center justify-between">
         <div className="flex flex-col">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-100">
               My Connections <span className="text-slate-500 text-sm font-normal">Message Sequences</span>
            </h2>
         </div>
         <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-green-500/50 text-green-400 bg-green-500/10 rounded-md text-sm font-medium hover:bg-green-500/20 transition-colors">
               <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_currentColor]" /> LinkedIn Connected
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input placeholder="Search network..." className="pl-9 pr-3 py-1.5 text-sm border border-slate-800 rounded-md bg-[#131B2B] text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all" />
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-cyan-500 hover:bg-cyan-400 text-[#0B1120] p-2 rounded-md transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              <Plus size={16} />
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 custom-scrollbar">
         <div className="flex gap-4 h-full items-start w-max">
            {COLUMNS.map(col => {
               const columnContacts = contacts.filter(c => c.status === col.id);
               return (
                 <div key={col.id} className="flex flex-col bg-[#131B2B] rounded-xl w-[320px] shrink-0 h-full border border-slate-800/80 shadow-lg">
                    <div className="p-3.5 border-b border-slate-800/50 flex justify-between items-center">
                       <h3 className="font-semibold text-[15px] tracking-wide flex items-center gap-2 text-slate-100">
                          {col.label}
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${col.color}`}>
                             {columnContacts.length}
                          </span>
                       </h3>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                       {columnContacts.length === 0 ? (
                         <div className="text-center p-4 text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">No contacts yet</div>
                       ) : (
                         columnContacts.map(contact => (
                            <div key={contact.id} className="bg-[#0B1120] border border-slate-800 rounded-lg p-3 shadow-md hover:border-slate-700 transition-colors group relative overflow-hidden">
                                <div className="flex gap-1.5 flex-wrap mb-3 relative z-10">
                                   {contact.tags.map(tag => (
                                      <span key={tag} className="text-[9px] font-medium bg-slate-800/80 text-cyan-400 px-2 py-0.5 rounded-md border border-slate-700/50 tracking-wider uppercase">
                                         {tag}
                                      </span>
                                   ))}
                                </div>
                                <div className="flex items-start gap-3 relative z-10">
                                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 ${contact.avatarColor || 'bg-slate-700'}`}>
                                      {contact.name.charAt(0)}
                                   </div>
                                   <div className="min-w-0 flex-1">
                                      <h4 className="font-semibold text-sm text-slate-100 truncate flex items-center gap-1.5">
                                         {contact.name}
                                         {contact.linkedinUrl && (
                                            <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" className="text-cyan-500 hover:text-cyan-400 bg-cyan-500/10 p-1 rounded-sm">
                                               <Linkedin size={10} />
                                            </a>
                                         )}
                                      </h4>
                                      <p className="text-xs text-slate-400 truncate mt-0.5" title={contact.title}>{contact.title}</p>
                                      <p className="text-[10px] text-slate-500 truncate mt-1 flex items-center gap-1">
                                         {contact.company} <ExternalLink size={10} className="text-slate-600" />
                                      </p>
                                   </div>
                                </div>
                            </div>
                         ))
                       )}
                    </div>
                 </div>
               );
            })}
         </div>
      </div>

      {isModalOpen && (
        <AddNetworkContactModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
}
