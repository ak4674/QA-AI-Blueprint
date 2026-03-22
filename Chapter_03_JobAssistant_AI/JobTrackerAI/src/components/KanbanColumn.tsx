import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Job, JobStatus } from '../types';
import { JobCard } from './JobCard';

interface KanbanColumnProps {
  status: JobStatus;
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onStatusChange: (jobId: string, newStatus: JobStatus) => void;
}

export function KanbanColumn({ status, jobs, onEdit, onDelete, onStatusChange }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
    data: {
      type: 'Column',
      status,
    },
  });

  const statusDots: Record<JobStatus, string> = {
    Saved: 'bg-purple-500',
    Applied: 'bg-cyan-500',
    Screening: 'bg-yellow-500',
    Interviewing: 'bg-green-500',
    Offer: 'bg-lime-500',
    Rejected: 'bg-red-500',
    Archived: 'bg-slate-500',
  };

  return (
    <div className="flex flex-col bg-[#131B2B] rounded-xl w-[320px] shrink-0 h-full border border-slate-800/60 shadow-lg">
      <div className="p-4 flex items-center justify-between border-b border-slate-800/40 font-medium text-slate-100">
        <h2 className="flex items-center gap-2.5 font-semibold text-[15px] tracking-wide relative">
          <div className={`w-2 h-2 rounded-full ${statusDots[status]} shadow-[0_0_8px_currentColor] opacity-90`}></div>
          {status}
        </h2>
        <span className="text-cyan-500 text-xs font-bold px-2.5 py-0.5 rounded flex items-center justify-center">
          {jobs.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar min-h-[150px]"
      >
        <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
          {jobs.map((job) => (
            <div key={job.id} className="group relative">
               <div className="absolute inset-0 bg-slate-900 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <JobCard job={job} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
            </div>
          ))}
        </SortableContext>
        <button className="w-full py-2.5 mt-2 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 rounded-lg text-sm transition-colors border border-dashed border-slate-800/50">
          <span className="text-lg leading-none">+</span> Add card
        </button>
      </div>
    </div>
  );
}
