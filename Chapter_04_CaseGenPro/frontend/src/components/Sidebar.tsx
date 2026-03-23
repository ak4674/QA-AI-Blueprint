import { useState } from 'react';
import { SquarePen, Search, Trash2, Settings, HelpCircle, MessageSquare } from 'lucide-react';
import type { ChatSession } from '../App';

interface SidebarProps {
  sessions: ChatSession[];
  activeSesId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onOpenSettings: () => void;
}

function groupByDate(sessions: ChatSession[]) {
  const now = Date.now();
  const today: ChatSession[] = [];
  const last7: ChatSession[] = [];
  const older: ChatSession[] = [];
  sessions.forEach(s => {
    const days = (now - s.createdAt) / (1000 * 60 * 60 * 24);
    if (days < 1) today.push(s);
    else if (days < 7) last7.push(s);
    else older.push(s);
  });
  return { today, last7, older };
}

export default function Sidebar({ sessions, activeSesId, onSelectSession, onNewChat, onDeleteSession, onOpenSettings }: SidebarProps) {
  const [search, setSearch] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = search
    ? sessions.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.requirement.toLowerCase().includes(search.toLowerCase()))
    : sessions;

  const { today, last7, older } = groupByDate(filtered);

  const renderGroup = (label: string, items: ChatSession[]) => {
    if (items.length === 0) return null;
    return (
      <div key={label} className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-widest px-3 pb-1.5" style={{ color: 'rgba(0,229,255,0.35)' }}>{label}</p>
        {items.map(s => (
          <div
            key={s.id}
            onMouseEnter={() => setHoveredId(s.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelectSession(s.id)}
            className={`group relative flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all text-sm truncate mx-1 ${
              activeSesId === s.id
                ? 'text-[#c8d8f5]'
                : 'text-[rgba(140,180,230,0.6)] hover:text-[#c8d8f5]'
            }`}
            style={activeSesId === s.id ? {
              background: 'linear-gradient(135deg, rgba(41,121,255,0.15), rgba(0,229,255,0.07))',
              border: '1px solid rgba(0,229,255,0.18)',
              boxShadow: '0 0 12px rgba(0,229,255,0.06)',
            } : {}}
          >
            <span className="truncate text-xs">{s.title}</span>
            {hoveredId === s.id && (
              <button
                onClick={e => { e.stopPropagation(); onDeleteSession(s.id); }}
                className="flex-shrink-0 ml-1 p-0.5 rounded hover:text-red-400 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <aside className="w-64 flex flex-col h-full" style={{
      background: 'linear-gradient(180deg, #07111e 0%, #06101b 100%)',
      borderRight: '1px solid rgba(0,229,255,0.08)',
    }}>
      {/* Logo / New Chat */}
      <div className="px-3 pt-4 pb-2">
        <button
          onClick={onNewChat}
          className="btn-3d btn-primary w-full px-3 py-2.5 text-sm"
        >
          <SquarePen size={15} />
          New Chat
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 input-futuristic rounded-xl px-3 py-2 text-sm">
          <Search size={14} style={{ color: 'rgba(0,229,255,0.4)' }} />
          <input
            className="flex-1 bg-transparent outline-none text-xs"
            style={{ color: '#c8d8f5' }}
            placeholder="Search chats"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-1 pb-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2" style={{ color: 'rgba(0,229,255,0.2)' }}>
            <MessageSquare size={22} />
            <span className="text-xs">No chats yet</span>
          </div>
        ) : (
          <>
            {renderGroup('Today', today)}
            {renderGroup('Previous 7 Days', last7)}
            {renderGroup('Older', older)}
          </>
        )}
      </div>

      {/* Bottom nav */}
      <div className="p-3 space-y-1" style={{ borderTop: '1px solid rgba(0,229,255,0.08)' }}>
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all"
          style={{ color: 'rgba(0,229,255,0.55)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,229,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(0,229,255,0.9)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(0,229,255,0.55)'; }}
        >
          <Settings size={16} />
          <span>API Settings</span>
        </button>
        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all"
          style={{ color: 'rgba(0,229,255,0.55)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,229,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(0,229,255,0.9)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(0,229,255,0.55)'; }}
        >
          <HelpCircle size={16} />
          <span>Help</span>
        </button>
      </div>
    </aside>
  );
}
