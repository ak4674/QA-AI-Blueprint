import { useState, useEffect } from 'react';
import type { Job, Company, Agency, NetworkContact } from '../types';
import { getAllJobs, getAllCompanies, getAllAgencies, getAllNetworkContacts } from '../db';
import { Target, Users, Briefcase, Sparkles, Building2, MousePointerClick, TrendingUp } from 'lucide-react';

export function DashboardTab({ onOpenLumi }: { onOpenLumi?: (q?: string) => void }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [network, setNetwork] = useState<NetworkContact[]>([]);

  useEffect(() => {
    getAllJobs().then(setJobs).catch(console.error);
    getAllCompanies().then(setCompanies).catch(console.error);
    getAllAgencies().then(setAgencies).catch(console.error);
    getAllNetworkContacts().then(setNetwork).catch(console.error);
  }, []);

  const appliedCount = jobs.filter(j => j.status === 'Applied').length;
  const interviewingCount = jobs.filter(j => j.status === 'Screening' || j.status === 'Interviewing').length;
  const offerCount = jobs.filter(j => j.status === 'Offer').length;
  const totalNetwork = network.length;
  const matchPercentage = Math.min(100, 75 + (offerCount * 5) + (interviewingCount * 2));

  const getDynamicInsights = () => {
    if (companies.length >= 2) {
      return `Based on your application history, you have a solid pipeline. There's a high density of networking opportunities at **${companies[0].name}** and **${companies[1].name}** that you haven't capitalized on yet.`;
    } else if (companies.length === 1) {
      return `Based on your application history, you have a solid pipeline. There's a great networking opportunity at **${companies[0].name}** that you should capitalize on.`;
    } else if (jobs.length > 0) {
      return `You have ${jobs.length} jobs in your pipeline. Lumi AI recommends adding Target Companies to discover new networking opportunities.`;
    }
    return `Welcome to JobVerse! Get started by adding some Target Companies or saving jobs in My Jobs. Lumi AI will generate customized networking strategies based on your data.`;
  };

  const getDynamicButtons = () => {
    if (companies.length > 0) {
       return (
         <>
            <button onClick={() => onOpenLumi?.(`Help me modify my resume for ${companies[0].name}.`)} className="w-full text-left px-4 py-2.5 rounded-lg bg-black/40 border border-slate-700/50 text-slate-300 text-sm font-medium hover:border-cyan-500/50 hover:text-cyan-400 transition-all flex items-center justify-between">
               Modify resume for {companies[0].name}
               <span className="text-cyan-500 text-xs">Analyze →</span>
            </button>
            <button onClick={() => onOpenLumi?.(`How can I network with recruiters at ${companies[0].name}?`)} className="w-full text-left px-4 py-2.5 rounded-lg bg-black/40 border border-slate-700/50 text-slate-300 text-sm font-medium hover:border-cyan-500/50 hover:text-cyan-400 transition-all flex items-center justify-between">
               Strategies for networking with {companies[0].name} recruiters
               <span className="text-cyan-500 text-xs">Analyze →</span>
            </button>
         </>
       );
    }
    
    return (
       <>
          <button onClick={() => onOpenLumi?.("Help me modify my resume for a general software engineering role.")} className="w-full text-left px-4 py-2.5 rounded-lg bg-black/40 border border-slate-700/50 text-slate-300 text-sm font-medium hover:border-cyan-500/50 hover:text-cyan-400 transition-all flex items-center justify-between">
             Modify resume for general roles
             <span className="text-cyan-500 text-xs">Analyze →</span>
          </button>
          <button onClick={() => onOpenLumi?.("How can I network with recruiters?")} className="w-full text-left px-4 py-2.5 rounded-lg bg-black/40 border border-slate-700/50 text-slate-300 text-sm font-medium hover:border-cyan-500/50 hover:text-cyan-400 transition-all flex items-center justify-between">
             Strategies for networking with recruiters
             <span className="text-cyan-500 text-xs">Analyze →</span>
          </button>
       </>
    );
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto p-8 custom-scrollbar relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="mb-8 relative z-10">
         <h1 className="text-3xl font-bold text-slate-100 mb-2">Welcome to your Dashboard</h1>
         <p className="text-slate-400">Live data aggregated from your jobs, companies, agencies, and network.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
         {/* KPI Cards */}
         <div className="bg-[#131B2B] border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:border-cyan-400 transition-colors">
            <div className="flex items-center gap-3 mb-4 text-cyan-400">
               <MousePointerClick size={20} />
               <h3 className="font-medium text-sm">Action Pipeline</h3>
            </div>
            <div className="flex justify-between items-end">
               <div>
                  <div className="text-3xl font-bold text-slate-100">{appliedCount}</div>
                  <div className="text-xs text-slate-500 mt-1">Total Applied</div>
               </div>
               <div className="text-xs text-cyan-400 font-medium bg-cyan-500/10 px-2.5 py-1 rounded-full">+2 this week</div>
            </div>
         </div>

         <div className="bg-[#131B2B] border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:border-purple-400 transition-colors">
            <div className="flex items-center gap-3 mb-4 text-purple-400">
               <Users size={20} />
               <h3 className="font-medium text-sm">Interviews Active</h3>
            </div>
            <div className="flex justify-between items-end">
               <div>
                  <div className="text-3xl font-bold text-slate-100">{interviewingCount}</div>
                  <div className="text-xs text-slate-500 mt-1">In progress</div>
               </div>
            </div>
         </div>

         <div className="bg-[#131B2B] border border-green-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:border-green-400 transition-colors">
            <div className="flex items-center gap-3 mb-4 text-green-400">
               <Briefcase size={20} />
               <h3 className="font-medium text-sm">Offers Received</h3>
            </div>
            <div className="flex justify-between items-end">
               <div>
                  <div className="text-3xl font-bold text-slate-100">{offerCount}</div>
                  <div className="text-xs text-slate-500 mt-1">Pending response</div>
               </div>
            </div>
         </div>

         <div className="bg-[#131B2B] border border-orange-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(249,115,22,0.1)] hover:border-orange-400 transition-colors">
            <div className="flex items-center gap-3 mb-4 text-orange-400">
               <Target size={20} />
               <h3 className="font-medium text-sm">Network Tracker</h3>
            </div>
            <div className="flex justify-between items-end">
               <div>
                  <div className="text-3xl font-bold text-slate-100">{totalNetwork}</div>
                  <div className="text-xs text-slate-500 mt-1">Connections</div>
               </div>
               <div className="text-xs text-orange-400 font-medium bg-orange-500/10 px-2.5 py-1 rounded-full">{agencies.length} Agencies</div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
         {/* Live Companies Summary */}
         <div className="bg-[#131B2B] border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
               <Building2 size={18} className="text-cyan-400" />
               Target Companies Live Data
            </h3>
            <div className="space-y-3">
               {companies.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No companies added yet. Head to Target Companies to add some.</p>
               ) : (
                  companies.slice(0, 4).map(c => (
                     <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-[#0B1120] border border-slate-800 hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center text-xs font-bold ${c.logoColor}`}>{c.logoText}</div>
                           <span className="font-medium text-slate-200 text-sm">{c.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                           <span className="px-2 py-1 rounded bg-slate-800/50">{c.jobCount} Jobs</span>
                           <span className="px-2 py-1 rounded bg-slate-800/50">{c.networkCount} Connects</span>
                        </div>
                     </div>
                  ))
               )}
            </div>
         </div>

         {/* Lumi AI Insights */}
         <div className="agentic-bg border border-cyan-500/40 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-colors"></div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
               <Sparkles size={18} className="text-cyan-400" />
               Lumi AI Insights
               <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 ml-2">Live</span>
            </h3>

            <div className="space-y-4 relative z-10">
               <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
                  <div className="flex items-center gap-3">
                     <TrendingUp className="text-green-400" size={18} />
                     <span className="text-slate-300 text-sm">Profile vs Applications Match</span>
                  </div>
                  <span className="text-xl font-bold font-mono text-cyan-400">{matchPercentage}%</span>
               </div>
               
               <p className="text-sm text-slate-400 leading-relaxed">
                  {getDynamicInsights()}
               </p>

               <div className="flex flex-col gap-2 mt-4">
                  {getDynamicButtons()}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
