import { useState, useEffect } from 'react';
import { X, Save, Activity } from 'lucide-react';
import type { AppSettings } from '../types';
import { defaultSettings } from '../types';

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setSettings(data);
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('http://localhost:3000/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      onClose();
    } catch(e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async (provider: string) => {
    setTestingProvider(provider);
    setTestResult(null);
    try {
      // First save current settings so backend uses latest typed keys
      await fetch('http://localhost:3000/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      const res = await fetch('http://localhost:3000/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      });
      const data = await res.json();
      setTestResult({ success: data.success, message: data.message || 'Connection Success!' });
    } catch(e) {
      setTestResult({ success: false, message: 'Connection Failed!' });
    } finally {
      setTestingProvider(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-[#1f1f1f] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">API Settings</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#1a1a1a] rounded-md transition-colors text-zinc-400 hover:text-zinc-200">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Ollama API URL</label>
              <div className="flex gap-2">
                <input type="text" value={settings.ollamaEndpoint} onChange={(e) => setSettings({...settings, ollamaEndpoint: e.target.value})} className="flex-1 bg-[#161616] border border-[#2a2a2a] rounded-md px-3 py-2 text-zinc-300 focus:outline-none focus:border-emerald-500" />
                <button onClick={() => handleTestConnection('ollama')} disabled={testingProvider === 'ollama'} className="px-4 py-2 border border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#222222] text-zinc-300 rounded-md transition-colors disabled:opacity-50 text-sm">
                  {testingProvider === 'ollama' ? <Activity size={16} className="animate-pulse" /> : 'Test'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Ollama Model Name</label>
              <input type="text" value={settings.ollamaModelName || ''} onChange={(e) => setSettings({...settings, ollamaModelName: e.target.value})} placeholder="e.g. llama3.2" className="w-full bg-[#161616] border border-[#2a2a2a] rounded-md px-3 py-2 text-zinc-300 focus:outline-none focus:border-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">LM Studio Endpoint</label>
              <div className="flex gap-2">
                <input type="text" value={settings.lmStudioEndpoint} onChange={(e) => setSettings({...settings, lmStudioEndpoint: e.target.value})} className="flex-1 bg-[#161616] border border-[#2a2a2a] rounded-md px-3 py-2 text-zinc-300 focus:outline-none focus:border-emerald-500" />
                <button onClick={() => handleTestConnection('lmstudio')} disabled={testingProvider === 'lmstudio'} className="px-4 py-2 border border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#222222] text-zinc-300 rounded-md transition-colors disabled:opacity-50 text-sm">
                  {testingProvider === 'lmstudio' ? <Activity size={16} className="animate-pulse" /> : 'Test'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">LM Studio Model Name</label>
              <input type="text" value={settings.lmStudioModelName || ''} onChange={(e) => setSettings({...settings, lmStudioModelName: e.target.value})} placeholder="e.g. local-model" className="w-full bg-[#161616] border border-[#2a2a2a] rounded-md px-3 py-2 text-zinc-300 focus:outline-none focus:border-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Groq API Key</label>
              <div className="flex gap-2">
                <input type="password" value={settings.groqApiKey} onChange={(e) => setSettings({...settings, groqApiKey: e.target.value})} className="flex-1 bg-[#161616] border border-[#2a2a2a] rounded-md px-3 py-2 text-zinc-300 focus:outline-none focus:border-emerald-500" />
                <button onClick={() => handleTestConnection('groq')} disabled={testingProvider === 'groq'} className="px-4 py-2 border border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#222222] text-zinc-300 rounded-md transition-colors disabled:opacity-50 text-sm">
                  {testingProvider === 'groq' ? <Activity size={16} className="animate-pulse" /> : 'Test'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Groq Model Name</label>
              <input type="text" value={settings.groqModelName || ''} onChange={(e) => setSettings({...settings, groqModelName: e.target.value})} placeholder="e.g. llama3-8b-8192" className="w-full bg-[#161616] border border-[#2a2a2a] rounded-md px-3 py-2 text-zinc-300 focus:outline-none focus:border-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">OpenAI API Key</label>
              <div className="flex gap-2">
                <input type="password" value={settings.openAIApiKey} onChange={(e) => setSettings({...settings, openAIApiKey: e.target.value})} className="flex-1 bg-[#161616] border border-[#2a2a2a] rounded-md px-3 py-2 text-zinc-300 focus:outline-none focus:border-emerald-500" />
                <button onClick={() => handleTestConnection('openai')} disabled={testingProvider === 'openai'} className="px-4 py-2 border border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#222222] text-zinc-300 rounded-md transition-colors disabled:opacity-50 text-sm">
                  {testingProvider === 'openai' ? <Activity size={16} className="animate-pulse" /> : 'Test'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">OpenAI Model Name</label>
              <input type="text" value={settings.openAIModelName || ''} onChange={(e) => setSettings({...settings, openAIModelName: e.target.value})} placeholder="e.g. gpt-4o" className="w-full bg-[#161616] border border-[#2a2a2a] rounded-md px-3 py-2 text-zinc-300 focus:outline-none focus:border-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Anthropic Claude API Key</label>
              <div className="flex gap-2">
                <input type="password" value={settings.claudeApiKey} onChange={(e) => setSettings({...settings, claudeApiKey: e.target.value})} className="flex-1 bg-[#161616] border border-[#2a2a2a] rounded-md px-3 py-2 text-zinc-300 focus:outline-none focus:border-emerald-500" />
                <button onClick={() => handleTestConnection('anthropic')} disabled={testingProvider === 'anthropic'} className="px-4 py-2 border border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#222222] text-zinc-300 rounded-md transition-colors disabled:opacity-50 text-sm">
                  {testingProvider === 'anthropic' ? <Activity size={16} className="animate-pulse" /> : 'Test'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Claude Model Name</label>
              <input type="text" value={settings.claudeModelName || ''} onChange={(e) => setSettings({...settings, claudeModelName: e.target.value})} placeholder="e.g. claude-3-5-sonnet-20240620" className="w-full bg-[#161616] border border-[#2a2a2a] rounded-md px-3 py-2 text-zinc-300 focus:outline-none focus:border-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Gemini API Key</label>
              <div className="flex gap-2">
                <input type="password" value={settings.geminiApiKey} onChange={(e) => setSettings({...settings, geminiApiKey: e.target.value})} className="flex-1 bg-[#161616] border border-[#2a2a2a] rounded-md px-3 py-2 text-zinc-300 focus:outline-none focus:border-emerald-500" />
                <button onClick={() => handleTestConnection('gemini')} disabled={testingProvider === 'gemini'} className="px-4 py-2 border border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#222222] text-zinc-300 rounded-md transition-colors disabled:opacity-50 text-sm">
                  {testingProvider === 'gemini' ? <Activity size={16} className="animate-pulse" /> : 'Test'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Gemini Model Name</label>
              <input type="text" value={settings.geminiModelName || ''} onChange={(e) => setSettings({...settings, geminiModelName: e.target.value})} placeholder="e.g. gemini-1.5-pro" className="w-full bg-[#161616] border border-[#2a2a2a] rounded-md px-3 py-2 text-zinc-300 focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          {testResult && (
            <div className={`p-3 rounded-md text-sm border bg-[#1a1111] text-red-400 border-red-500/20`}>
              {testResult.success ? <span className="text-emerald-400">{testResult.message}</span> : testResult.message}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#1f1f1f] flex justify-end bg-[#111111]">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors disabled:opacity-50 font-medium shadow-sm"
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
