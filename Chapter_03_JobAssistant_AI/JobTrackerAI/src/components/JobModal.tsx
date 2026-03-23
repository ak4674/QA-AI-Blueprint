import React, { useState, useEffect } from 'react';
import type { Job, JobStatus } from '../types';
import { X, Briefcase, Users } from 'lucide-react';

interface JobModalProps {
  job?: Job | null;
  onClose: () => void;
  onSave: (job: Job) => Promise<void>;
  existingResumes: string[];
}

const STATUSES: JobStatus[] = ['Saved', 'Applied', 'Screening', 'Interviewing', 'Offer', 'Rejected'];

export function JobModal({ job, onClose, onSave, existingResumes }: JobModalProps) {
  const [formData, setFormData] = useState<Partial<Job>>({
    companyName: '',
    jobTitle: '',
    jobUrl: '',
    resumeUsed: '',
    dateApplied: Date.now(),
    salaryRange: '',
    notes: '',
    status: 'Saved',
  });

  useEffect(() => {
    if (job) {
      setFormData(job);
    }
  }, [job]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dateApplied' ? new Date(value).getTime() : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.jobTitle) return;

    const newJob: Job = {
      ...(formData as Job),
      id: job?.id || crypto.randomUUID(),
    };
    
    await onSave(newJob);
    onClose();
  };

  const formattedDate = new Date(formData.dateApplied || Date.now()).toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-card w-full max-w-lg h-full shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-y-auto flex flex-col border-l border-white/5 animate-slide-in relative group/modal">
        <div className="absolute inset-0 bg-neon-blue/2 pointer-events-none opacity-50"></div>
        
        <div className="flex items-center justify-between p-6 border-b border-white/5 relative z-10 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="bg-neon-blue/10 p-2 rounded-lg border border-neon-blue/20">
              <Briefcase size={20} className="text-neon-blue" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {job ? 'Edit Job Application' : 'Add New Job'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 flex-1 flex flex-col relative z-10">
          <div className="space-y-6 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Company Name *</label>
                <input required name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all shadow-inner" placeholder="Acme Corp" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Job Title / Role *</label>
                <input required name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all shadow-inner" placeholder="Software Engineer" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Status ⚑</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all appearance-none cursor-pointer">
                  {STATUSES.map(s => (
                    <option key={s} value={s} className="bg-slate-900">{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Salary Range</label>
                <input name="salaryRange" value={formData.salaryRange} onChange={handleChange} className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all shadow-inner" placeholder="$150-180K" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">LinkedIn / Job URL</label>
              <input type="url" name="jobUrl" value={formData.jobUrl} onChange={handleChange} className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all shadow-inner" placeholder="https://linkedin.com/jobs/..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Resume Used</label>
                <input list="resumes" name="resumeUsed" value={formData.resumeUsed} onChange={handleChange} className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all shadow-inner" placeholder="Frontend_Resume_v2" />
                <datalist id="resumes">
                  {existingResumes.map(r => <option key={r} value={r} />)}
                </datalist>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Date Applied</label>
                <input type="date" name="dateApplied" value={formattedDate} onChange={handleChange} className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all" />
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neon-blue flex items-center gap-2">
                   <Users size={14} />
                   Networking Connections
                </h3>
                <span className="text-[10px] font-bold text-slate-500 uppercase py-1 px-2 rounded bg-white/5">Optional</span>
              </div>
              
              <div className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-3">
                 <p className="text-[11px] text-slate-400 leading-relaxed italic border-l-2 border-neon-blue/30 pl-3">
                   Link a contact from your network to this job to track referrals and follow-ups.
                 </p>
                 <button type="button" className="w-full py-2.5 rounded-lg border border-dashed border-white/20 text-[10px] font-bold uppercase text-slate-500 hover:border-neon-blue/40 hover:text-neon-blue transition-all">
                   + Link Network Contact
                 </button>
              </div>
            </div>

            <div className="space-y-1.5 flex-1 min-h-[120px] flex flex-col pt-4">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full flex-1 px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all resize-none shadow-inner" placeholder="Referred by John Doe. HM name is Smith..." />
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/5 flex justify-end gap-3 sticky bottom-0 bg-card/80 backdrop-blur-md">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all">
              Cancel
            </button>
            <button type="submit" className="px-8 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-neon-blue/20 border border-neon-blue/50 rounded-xl hover:bg-neon-blue/30 transition-all shadow-[0_0_20px_rgba(0,242,255,0.1)]">
              {job ? 'Save Changes' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
