import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Job, JobStatus } from '../types';
import { cn } from '../utils';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Edit2, Trash2, MoreVertical } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
}

const statusBorders = {
  Saved: 'border-t-purple-500',
  Applied: 'border-t-cyan-500',
  Screening: 'border-t-yellow-500',
  Interviewing: 'border-t-green-500',
  Offer: 'border-t-lime-500',
  Rejected: 'border-t-red-500',
  Archived: 'border-t-slate-600',
};

const nextPhaseMap: Record<string, JobStatus> = {
  Saved: 'Applied',
  Applied: 'Screening',
  Screening: 'Interviewing',
  Interviewing: 'Offer',
  Offer: 'Offer',
  Rejected: 'Rejected',
  Archived: 'Archived',
};

export function JobCard({ job, onEdit, onDelete, onStatusChange }: JobCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: job.id,
    data: {
      type: 'Job',
      job,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-40 border-2 border-dashed border-neon-blue/30 rounded-xl p-4 bg-card/50 min-h-[140px] shadow-[inset_0_0_20px_rgba(0,242,255,0.05)]"
      />
    );
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the job at ${job.companyName}?`)) {
      onDelete(job.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(job);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "relative bg-card shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-white/5 rounded-xl p-5 cursor-grab active:cursor-grabbing border-t-[3px] group hover:border-white/10 hover:shadow-[0_0_30px_rgba(0,242,255,0.08)] transition-all z-10",
        statusBorders[job.status]
      )}
    >
      <div className="flex justify-between items-start mb-1.5">
        <div className="font-medium text-slate-400 text-xs flex items-center gap-1.5 overflow-hidden">
          <div className="w-1 h-1 rounded-full bg-slate-500"></div>
          <span className="truncate tracking-wide" title={job.companyName}>{job.companyName}</span>
          <span className="text-slate-600">-</span>
          <span className="text-slate-500 truncate" title={job.location}>{job.location || 'Remote'}</span>
        </div>
        
        <div className="flex flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleEdit} className="p-1 text-slate-500 hover:text-cyan-400 rounded transition-colors bg-slate-800/50 mr-1">
            <Edit2 size={12} />
          </button>
          <button onClick={handleDelete} className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors bg-slate-800/50 mr-1">
            <Trash2 size={12} />
          </button>
          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="p-1 text-slate-500 hover:text-white rounded transition-colors bg-slate-800/50">
              <MoreVertical size={12} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 w-44 bg-card border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden z-50 py-1.5 backdrop-blur-md">
                {job.status !== 'Offer' && job.status !== 'Rejected' && job.status !== 'Archived' && (
                  <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); onStatusChange(job.id, nextPhaseMap[job.status]); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-neon-blue hover:bg-neon-blue/10 transition-all uppercase tracking-wider">
                    Next Phase
                  </button>
                )}
                <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); onStatusChange(job.id, 'Archived'); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-white/5 transition-all uppercase tracking-wider">
                  Archive Job
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-start justify-between">
        <div className="text-[15px] font-bold text-slate-100 mb-3 truncate pr-2 leading-tight" title={job.jobTitle}>
          {job.jobTitle}
        </div>
        {job.jobUrl && (
          <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" onClick={handleLinkClick} className="text-cyan-500 bg-cyan-500/10 p-1.5 rounded-md hover:bg-cyan-500/20 transition-colors flex-shrink-0 mt-0.5">
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      {job.salaryRange ? (
          <div className="absolute bottom-4 right-4 text-xs font-bold text-green-400">
            {job.salaryRange.includes('$') ? job.salaryRange : `$${job.salaryRange}`}
          </div>
      ) : null}

      <div className="flex items-center gap-2 mt-2">
         {['System Design', 'React', 'TS'].slice(0, 2).map((tag, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50 font-medium">
              {tag}
            </span>
         ))}
      </div>

      <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-500 font-medium">
        <span>{formatDistanceToNow(job.dateApplied, { addSuffix: true })}</span>
        {job.resumeUsed && (
            <>
              <span className="w-1 h-1 rounded-full bg-slate-700"></span>
              <span className="truncate max-w-[100px]" title={job.resumeUsed}>{job.resumeUsed}</span>
            </>
        )}
      </div>
    </div>
  );
}
