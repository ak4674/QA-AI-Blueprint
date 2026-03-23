import { useState, useEffect } from 'react';
import type { Job } from './types';
import { getAllJobs, updateJob, deleteJob, getAllCompanies, getAllAgencies, getAllNetworkContacts } from './db';
import { KanbanBoard } from './components/KanbanBoard';
import { JobModal } from './components/JobModal';
import { JobBoardTab } from './components/JobBoardTab';
import { TargetCompaniesTab } from './components/TargetCompaniesTab';
import { RecruitmentAgenciesTab } from './components/RecruitmentAgenciesTab';
import { MyNetworkTab } from './components/MyNetworkTab';
import { DashboardTab } from './components/DashboardTab';
import { LumiModal } from './components/LumiModal';
import { SignInModal } from './components/SignInModal';
import { Search, Bell, Filter } from 'lucide-react';

type TabType = 'Dashboard' | 'My Jobs' | 'Job Board' | 'Target Companies' | 'Agencies' | 'My Network';

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('Dashboard');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Auth State
  const [currentUser, setCurrentUser] = useState<{name: string, email: string} | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  // Dynamic Header State
  const [networkCount, setNetworkCount] = useState(0);

  const fetchNetworkCount = async () => {
    try {
      const contacts = await getAllNetworkContacts();
      setNetworkCount(contacts.length);
    } catch (err) {
      console.error('Failed to fetch network count:', err);
    }
  };

  useEffect(() => {
    fetchNetworkCount();
  }, [activeTab]);

  // Global Search State
  const [globalSearch, setGlobalSearch] = useState('');

  const handleGlobalSearch = async () => {
    if (!globalSearch.trim()) return;
    const q = globalSearch.toLowerCase().trim();
    
    const nets = await getAllNetworkContacts();
    if (nets.some(n => n.name.toLowerCase().includes(q) || n.company.toLowerCase().includes(q))) {
       setActiveTab('My Network');
       return;
    }
    
    const ags = await getAllAgencies();
    if (ags.some(a => a.name.toLowerCase().includes(q))) {
       setActiveTab('Agencies');
       return;
    }
    
    const comps = await getAllCompanies();
    if (comps.some(c => c.name.toLowerCase().includes(q))) {
       setActiveTab('My Jobs');
       return;
    }
    
    const myjobs = await getAllJobs();
    if (myjobs.some(j => j.companyName.toLowerCase().includes(q) || j.jobTitle.toLowerCase().includes(q))) {
       setActiveTab('My Jobs');
       return;
    }
  };

  // Global Lumi Chat UI
  const [isLumiOpen, setIsLumiOpen] = useState(false);
  const [lumiQuery, setLumiQuery] = useState('');

  const openLumi = (query = '') => {
    setLumiQuery(query);
    setIsLumiOpen(true);
  };

  useEffect(() => {
    getAllJobs().then(setJobs).catch(console.error);
    document.documentElement.classList.add('dark'); // Force dark mode for this theme
  }, []);

  const closeModals = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleSaveJob = async (job: Job) => {
    await updateJob(job);
    getAllJobs().then(setJobs).catch(console.error);
    closeModals();
  };

  const handleUpdateJobStateDirect = async (job: Job) => {
    await updateJob(job);
  };

  const handleDeleteJob = async (id: string) => {
    await deleteJob(id);
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const TABS: TabType[] = ['Dashboard', 'My Jobs', 'Job Board', 'Target Companies', 'Agencies', 'My Network'];

  return (
    <div className="flex flex-col h-screen font-sans text-slate-300 overflow-hidden agentic-bg">
      
      {/* Top Header Navigation */}
      <header className="flex-shrink-0 border-b border-white/5 px-6 h-16 flex items-center justify-between z-10 bg-card/50 backdrop-blur-md">
        <div className="flex items-center gap-12 h-full">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-wide text-cyan-400">JobVerse</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center h-full gap-1 text-sm font-medium">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-full px-4 flex items-center relative transition-colors ${activeTab === tab ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 rounded-t-full shadow-[0_-2px_10px_rgba(6,182,212,0.5)]" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-black/20 text-neon-green px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-neon-green/30 shadow-[0_0_10px_rgba(0,255,157,0.1)]">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse"></div>
            {networkCount} new network{networkCount !== 1 ? 's' : ''}
          </div>
          
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              placeholder="Search everything..." 
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGlobalSearch()}
              className="pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 text-white placeholder-slate-600 w-56 transition-all shadow-inner"
            />
          </div>

          <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {currentUser ? (
             <div className="w-9 h-9 rounded-xl bg-neon-blue/20 border border-neon-blue/40 flex items-center justify-center text-neon-blue font-bold text-xs shadow-[0_0_20px_rgba(0,242,255,0.2)] cursor-pointer hover:bg-neon-blue/30 transition-all" title={`Logged in as ${currentUser.name}`}>
               {currentUser.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2)}
             </div>
          ) : (
             <button onClick={() => setIsSignInOpen(true)} className="text-xs font-bold uppercase tracking-widest bg-white/5 border border-white/10 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-white/5">
                Sign In
             </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Tab Content Manager */}
        <main className="flex-1 overflow-hidden relative bg-transparent">
          {activeTab === 'Dashboard' && <div className="absolute inset-0 bg-transparent"><DashboardTab onOpenLumi={openLumi} /></div>}
          
          {activeTab === 'My Jobs' && (
            <div className="absolute inset-0 p-6 flex flex-col gap-6 overflow-hidden">
              <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-white tracking-tight">My Jobs</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                       <input 
                         type="text" 
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         placeholder="Search jobs..." 
                         className="bg-[#131B2B] border border-slate-800 text-sm text-slate-200 pl-9 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500/50 w-64 shadow-inner"
                       />
                    </div>
                    <div className="relative flex items-center bg-[#131B2B] border border-slate-800 rounded-lg pr-3 pl-1">
                       <Filter className="text-slate-500 ml-2" size={14} />
                       <select className="bg-transparent border-none text-sm text-slate-300 px-2 py-1.5 focus:outline-none appearance-none cursor-pointer">
                          <option>All Jobs</option>
                          <option>Recent First</option>
                          <option>Urgent</option>
                       </select>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-[#0B1120] font-bold px-4 py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <span className="text-lg leading-none">+</span> Add Job
                  </button>
                </div>
              </div>
              
              <div className="flex-1 min-h-0">
                <KanbanBoard 
                   jobs={jobs.filter(j => 
                     j.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                     j.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
                   )} 
                   setJobs={setJobs} 
                   onUpdateJob={handleUpdateJobStateDirect}
                   onEdit={(job) => { setEditingJob(job); setIsModalOpen(true); }}
                   onDelete={handleDeleteJob}
                />
              </div>
            </div>
          )}
          {activeTab === 'Job Board' && <div className="absolute inset-0 bg-transparent"><JobBoardTab onOpenLumi={openLumi} /></div>}
          {activeTab === 'Target Companies' && <div className="absolute inset-0 bg-transparent"><TargetCompaniesTab onOpenLumi={openLumi} /></div>}
          {activeTab === 'Agencies' && <div className="absolute inset-0 bg-transparent"><RecruitmentAgenciesTab onOpenLumi={openLumi} /></div>}
          {activeTab === 'My Network' && <div className="absolute inset-0 bg-transparent"><MyNetworkTab /></div>}
        </main>
      </div>

      {(isModalOpen || editingJob) && (
        <JobModal 
          job={editingJob} 
          onClose={closeModals} 
          onSave={handleSaveJob}
          existingResumes={[]}
        />
      )}

      {isSignInOpen && (
         <SignInModal 
            onClose={() => setIsSignInOpen(false)}
            onSignIn={(user) => setCurrentUser(user)}
         />
      )}

      {isLumiOpen && (
        <LumiModal 
           onClose={() => setIsLumiOpen(false)}
           initialQuery={lumiQuery}
        />
      )}
    </div>
  );
}
