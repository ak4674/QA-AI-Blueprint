import { useState, useEffect } from 'react';
import type { NetworkContact, NetworkStatus } from '../types';
import { getAllNetworkContacts, addNetworkContact } from '../db';
import { Search, Plus, ExternalLink, Linkedin, MoreVertical, Trash2, ArrowRight } from 'lucide-react';
import { AddNetworkContactModal } from './AddNetworkContactModal';
import { LinkedInLoginModal } from './LinkedInLoginModal';

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

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isLinkedInConnected, setIsLinkedInConnected] = useState(false);
  const [isLinkedInLoginOpen, setIsLinkedInLoginOpen] = useState(false);
  
  useEffect(() => {
    getAllNetworkContacts().then(setContacts).catch(console.error);
  }, []);

  const handleSave = async (contact: NetworkContact) => {
    await addNetworkContact(contact);
    setContacts(prev => [...prev, contact]);
  };

  const handleStatusChange = async (contactId: string, newStatus: NetworkStatus) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;
    const updatedContact = { ...contact, status: newStatus };
    await addNetworkContact(updatedContact); // Upsert
    setContacts(prev => prev.map(c => c.id === contactId ? updatedContact : c));
    setActiveMenuId(null);
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
             <button 
               onClick={() => !isLinkedInConnected && setIsLinkedInLoginOpen(true)}
               className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-md text-sm font-medium transition-all ${
                 isLinkedInConnected 
                   ? 'border-green-500/50 text-green-400 bg-green-500/10' 
                   : 'border-[#0077b5]/50 text-[#0077b5] bg-[#0077b5]/10 hover:bg-[#0077b5]/20 hover:border-[#0077b5] shadow-[0_0_15px_rgba(0,119,181,0.1)] hover:shadow-[0_0_20px_rgba(0,119,181,0.2)]'
               }`}
             >
                <div className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] ${isLinkedInConnected ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} /> 
                {isLinkedInConnected ? 'LinkedIn Connected' : 'Connect LinkedIn'}
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
                                 <button 
                                   onClick={() => setActiveMenuId(activeMenuId === contact.id ? null : contact.id)}
                                   className="absolute top-2 right-2 p-1 text-slate-500 hover:text-white hover:bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-all z-20"
                                 >
                                   <MoreVertical size={14} />
                                 </button>

                                 {activeMenuId === contact.id && (
                                   <div className="absolute top-8 right-2 w-40 bg-[#131B2B] border border-white/10 rounded-lg shadow-2xl z-30 py-1.5 animate-in fade-in zoom-in duration-200">
                                      {COLUMNS.find(col => col.id === contact.status)?.id !== 'Rejected' && (
                                        <button 
                                          onClick={() => {
                                             const currentIndex = COLUMNS.findIndex(c => c.id === contact.status);
                                             if (currentIndex < COLUMNS.length - 1) {
                                               handleStatusChange(contact.id, COLUMNS[currentIndex+1].id);
                                             }
                                          }}
                                          className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                                        >
                                          <ArrowRight size={12} className="text-cyan-400" />
                                          Next Stage
                                        </button>
                                      )}
                                      <button className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-red-500 hover:bg-red-500/10 transition-all" onClick={() => setActiveMenuId(null)}>
                                        <Trash2 size={12} />
                                        Remove Contact
                                      </button>
                                   </div>
                                 )}

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
                                       <h4 className="font-semibold text-sm text-slate-100 truncate flex items-center gap-1.5 pr-4">
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

      {isLinkedInLoginOpen && (
        <LinkedInLoginModal 
          onClose={() => setIsLinkedInLoginOpen(false)} 
          onConnect={() => {
            setIsLinkedInConnected(true);
            setIsLinkedInLoginOpen(false);
          }} 
        />
      )}
    </div>
  );
}
