import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainGenerator from './components/MainGenerator';
import SettingsModal from './components/SettingsModal';
import type { AppSettings } from './types';

// ---------- Types ----------
export interface ChatSession {
  id: string;
  title: string;
  requirement: string;
  output: string;
  provider: string;
  createdAt: number;
}

// ---------- Helpers ----------
const STORAGE_KEY = 'llm_testgen_history';

function loadHistory(): ChatSession[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveHistory(sessions: ChatSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

// ---------- App ----------
function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>(loadHistory());
  const [activeSesId, setActiveSesId] = useState<string | null>(null);

  const fetchSettings = () => {
    fetch('http://localhost:3000/api/settings')
      .then(res => res.json())
      .then(data => { if (data && !data.error) setSettings(data); })
      .catch(console.error);
  };

  useEffect(() => { fetchSettings(); }, []);

  // ---------- Chat actions ----------
  const handleNewChat = () => setActiveSesId(null);

  const handleSaveSession = (session: ChatSession) => {
    setSessions(prev => {
      const idx = prev.findIndex(s => s.id === session.id);
      let next: ChatSession[];
      if (idx >= 0) {
        next = prev.map(s => s.id === session.id ? session : s);
      } else {
        next = [session, ...prev];
      }
      saveHistory(next);
      return next;
    });
    setActiveSesId(session.id);
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => {
      const next = prev.filter(s => s.id !== id);
      saveHistory(next);
      return next;
    });
    if (activeSesId === id) setActiveSesId(null);
  };

  const activeSession = sessions.find(s => s.id === activeSesId) ?? null;

  return (
    <div className="flex h-screen bg-[#212121] text-zinc-300 font-sans selection:bg-emerald-500/30">
      <Sidebar
        sessions={sessions}
        activeSesId={activeSesId}
        onSelectSession={setActiveSesId}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 overflow-hidden relative flex flex-col">
        <MainGenerator
          settings={settings}
          activeSession={activeSession}
          onSaveSession={handleSaveSession}
        />
      </main>

      {isSettingsOpen && (
        <SettingsModal
          onClose={() => {
            setIsSettingsOpen(false);
            fetchSettings();
          }}
        />
      )}
    </div>
  );
}

export default App;
