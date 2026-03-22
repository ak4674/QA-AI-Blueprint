import { useState, useEffect } from 'react';
import type { ScrapedJob } from '../types';
import { getAllScrapedJobs } from '../db';
import { Search, MapPin, Briefcase, IndianRupee, BookmarkPlus } from 'lucide-react';

export function JobBoardTab({ onOpenLumi }: { onOpenLumi?: (q?: string) => void }) {
  const [jobs, setJobs] = useState<ScrapedJob[]>([]);

  useEffect(() => {
    getAllScrapedJobs().then(setJobs).catch(console.error);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      <div className="flex-shrink-0 bg-transparent border-b border-slate-800/80 p-6 flex flex-col items-center gap-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#131B2B]/40 to-transparent pointer-events-none"></div>
        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-100 relative z-10">
          <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">✨</span> Find Your Dream Job
        </h2>
        
        {/* Search Header */}
        <div className="w-full max-w-4xl flex flex-col gap-4 relative z-10">
          <div className="flex bg-[#131B2B] border border-slate-700/80 rounded-lg overflow-hidden shadow-lg shadow-black/20 focus-within:border-cyan-500/50 transition-colors">
            <div className="flex-1 border-r border-slate-700/80 flex items-center px-4">
               <Search size={18} className="text-slate-500 mr-2" />
               <input placeholder="Job Title" className="w-full bg-transparent text-slate-200 placeholder-slate-500 outline-none py-3 focus:ring-0" />
            </div>
            <div className="w-1/4 border-r border-slate-700/80 flex items-center px-4">
               <select className="w-full bg-transparent text-slate-400 outline-none py-3 custom-select">
                  <option className="bg-[#131B2B]">Experience</option>
                  <option className="bg-[#131B2B]">0-2 years</option>
                  <option className="bg-[#131B2B]">3-5 years</option>
                  <option className="bg-[#131B2B]">5+ years</option>
               </select>
            </div>
            <div className="w-1/3 flex items-center px-4">
               <MapPin size={18} className="text-slate-500 mr-2" />
               <input placeholder="Location" className="w-full bg-transparent text-slate-200 placeholder-slate-500 outline-none py-3 focus:ring-0" />
            </div>
            <button className="bg-cyan-500 hover:bg-cyan-400 text-[#0B1120] px-8 font-bold transition-colors">
              Search Jobs
            </button>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="px-4 py-1.5 rounded-full border border-cyan-500/30 text-cyan-400 bg-cyan-500/10 text-sm flex items-center gap-2 hover:bg-cyan-500/20 transition-colors">
                ✓ LinkedIn
             </button>
             <button className="px-4 py-1.5 rounded-full border border-cyan-500/30 text-cyan-400 bg-cyan-500/10 text-sm flex items-center gap-2 hover:bg-cyan-500/20 transition-colors">
                ✓ Naukri
             </button>
             <button className="px-4 py-1.5 rounded-full border border-cyan-500/30 text-cyan-400 bg-cyan-500/10 text-sm flex items-center gap-2 hover:bg-cyan-500/20 transition-colors">
                ✓ Career Pages
             </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 bg-transparent">
        <h3 className="text-lg font-semibold mb-4 text-slate-200">Recommended Jobs</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
           {jobs.length === 0 ? (
             <p className="text-slate-500 col-span-full">No jobs found. Try adjusting your search.</p>
           ) : (
             jobs.map(job => (
               <div key={job.id} className="bg-[#131B2B] border border-slate-800 hover:border-slate-700 rounded-lg p-5 transition-all flex flex-col group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-start justify-between mb-3 relative z-10">
                     <div className="flex gap-3 items-center">
                        <div className={`w-10 h-10 ${job.logoColor || 'bg-slate-700'} rounded-md flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                           {job.company.charAt(0)}
                        </div>
                        <div>
                           <h4 className="font-semibold text-slate-100">{job.title}</h4>
                           <p className="text-sm text-slate-400">{job.company}</p>
                        </div>
                     </div>
                     <button className="text-slate-500 hover:text-cyan-400 transition-colors"><BookmarkPlus size={20}/></button>
                  </div>
                  
                  <div className="flex gap-4 text-xs text-slate-400 mb-4 mt-2 relative z-10">
                     <span className="flex items-center gap-1"><Briefcase size={14} className="text-slate-500"/> {job.experience || 'Not Specified'}</span>
                     <span className="flex items-center gap-1"><MapPin size={14} className="text-slate-500"/> {job.location}</span>
                     <span className="flex items-center gap-1 text-green-400"><IndianRupee size={14}/> {job.salary}</span>
                  </div>
                  
                  <div className="mt-auto border-t border-slate-800/80 pt-4 flex items-center justify-between relative z-10">
                     <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded">Source: {job.source}</span>
                     <div className="flex gap-2">
                       <button onClick={() => onOpenLumi?.(`Analyze this job: ${job.title} at ${job.company}`)} className="agentic-btn px-4 py-1.5 text-xs">Ask Lumi</button>
                       <a href={job.url} target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 bg-cyan-500 text-[#0B1120] font-medium rounded text-sm hover:bg-cyan-400 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)]">Apply Now</a>
                     </div>
                  </div>
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
}
