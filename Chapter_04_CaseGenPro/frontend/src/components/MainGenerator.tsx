import { useState, useEffect, useRef } from 'react';
import { Mic, Headphones, Paperclip, ChevronDown } from 'lucide-react';
import type { AppSettings } from '../types';
import type { ChatSession } from '../App';
import TestCaseTable, { type TestCase } from './TestCaseTable';

interface Props {
  settings: AppSettings | null;
  activeSession: ChatSession | null;
  onSaveSession: (session: ChatSession) => void;
}

const PROVIDERS: Record<string, string> = {
  ollama: 'Ollama (Local)',
  lmstudio: 'LM Studio (Local)',
  openai: 'OpenAI',
  anthropic: 'Claude / Anthropic',
  gemini: 'Google Gemini',
  groq: 'Groq',
};

function parseTestCases(raw: string): TestCase[] | null {
  try {
    let text = raw.trim();
    // Strip code fences (```json ... ``` or ``` ... ```)
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
    // If LLM added preamble text, grab from first [ to last ]
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start !== -1 && end !== -1 && end > start) {
      text = text.slice(start, end + 1);
    }
    const arr = JSON.parse(text);
    if (Array.isArray(arr) && arr.length > 0) return arr as TestCase[];
    return null;
  } catch {
    return null;
  }
}

export default function MainGenerator({ settings, activeSession, onSaveSession }: Props) {
  const [prompt, setPrompt] = useState('');
  const [rawOutput, setRawOutput] = useState('');
  const [testCases, setTestCases] = useState<TestCase[] | null>(null);
  const [parseError, setParseError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('ollama');
  const [currentSesId, setCurrentSesId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (settings?.selectedProvider) setSelectedProvider(settings.selectedProvider);
  }, [settings]);

  useEffect(() => {
    if (activeSession) {
      setRawOutput(activeSession.output);
      setTestCases(parseTestCases(activeSession.output));
      setParseError(false);
      setPrompt(activeSession.requirement);
      setSelectedProvider(activeSession.provider);
      setCurrentSesId(activeSession.id);
    } else {
      setRawOutput('');
      setTestCases(null);
      setParseError(false);
      setPrompt('');
      setCurrentSesId(null);
    }
  }, [activeSession]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [prompt]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTestCases(null);
    setParseError(false);
    try {
      const response = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement: prompt, provider: selectedProvider })
      });
      const data = await response.json();
      const raw: string = data.testCases ?? data.error ?? 'No output generated.';
      setRawOutput(raw);
      const parsed = parseTestCases(raw);
      if (parsed && parsed.length > 0) {
        setTestCases(parsed);
      } else {
        setParseError(true);
      }

      const newSes: ChatSession = {
        id: currentSesId || `ses_${Date.now()}`,
        title: prompt.substring(0, 55) + (prompt.length > 55 ? '...' : ''),
        requirement: prompt,
        output: raw,
        provider: selectedProvider,
        createdAt: Date.now(),
      };
      onSaveSession(newSes);
      setCurrentSesId(newSes.id);
    } catch {
      setRawOutput('⚠️ Error communicating with backend.');
      setParseError(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Speech recognition not supported.'); return; }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (e: any) => setPrompt(prev => prev + (prev ? ' ' : '') + e.results[0][0].transcript);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  };

  const handleFileAttach = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md,.pdf,.doc,.docx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setPrompt(prev => prev + (prev ? '\n\n' : '') + `[File: ${file.name}]\n${text.substring(0, 3000)}`);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto w-full px-6 pb-4">

      {/* Output area */}
      {rawOutput ? (
        <div className="flex-1 overflow-y-auto py-6">
          {testCases ? (
            <TestCaseTable testCases={testCases} rawOutput={rawOutput} provider={PROVIDERS[selectedProvider] || selectedProvider} />
          ) : (
            <div className="rounded-xl p-6 text-sm whitespace-pre-wrap" style={{ background: 'rgba(198,40,40,0.06)', border: '1px solid rgba(244,67,54,0.2)', color: 'rgba(140,180,230,0.7)' }}>
              <p className="text-xs mb-3 font-semibold" style={{ color: '#ff6b6b' }}>⚠️ Could not parse structured output. Showing raw response:</p>
              {rawOutput}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          {/* Holographic logo */}
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2" style={{
            background: 'linear-gradient(135deg, rgba(0,229,255,0.12) 0%, rgba(41,121,255,0.15) 100%)',
            border: '1px solid rgba(0,229,255,0.3)',
            boxShadow: '0 0 30px rgba(0,229,255,0.15), 0 0 60px rgba(41,121,255,0.08)',
          }}>
            <span className="text-3xl font-black" style={{ color: 'var(--neon-cyan)', textShadow: '0 0 16px rgba(0,229,255,0.7)' }}>C</span>
          </div>
          <h1 className="text-2xl font-bold leading-snug" style={{ color: '#ddeeff', textShadow: '0 0 20px rgba(0,229,255,0.15)' }}>
            CaseGen Pro &ndash; Local UI &amp; API Test Generator
          </h1>
          <p className="text-sm" style={{ color: 'rgba(0,229,255,0.45)' }}>By Arya Technology</p>
          <p className="text-sm max-w-md" style={{ color: 'rgba(140,180,230,0.55)' }}>
            Fast, reliable test case generation for UI and API workflows
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 w-full max-w-lg">
            {[
              'Generate login page API test cases',
              'Create E2E tests for checkout flow',
              'Non-functional tests for user profile',
              'Performance tests for search feature',
            ].map(s => (
              <button
                key={s}
                onClick={() => setPrompt(s)}
                className="p-3 rounded-xl text-xs text-left transition-all"
                style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.1)', color: 'rgba(140,180,230,0.65)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,229,255,0.09)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,229,255,0.25)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(0,229,255,0.9)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,229,255,0.04)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,229,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(140,180,230,0.65)'; }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="mt-auto pt-2">
        <div className="rounded-2xl overflow-hidden transition-all" style={{
          background: 'rgba(8,18,35,0.95)',
          border: '1px solid rgba(0,229,255,0.15)',
          boxShadow: '0 0 0 1px rgba(0,229,255,0.04), 0 8px 32px rgba(0,0,0,0.4)',
        }}>
          <textarea
            ref={textareaRef}
            className="w-full bg-transparent px-4 pt-4 pb-2 outline-none resize-none text-sm leading-relaxed min-h-[56px] max-h-[200px]"
            style={{ color: '#c8d8f5' }}
            placeholder="Ask anything or paste your Jira requirement..."
            rows={1}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); }
            }}
          />
          <div className="flex items-center justify-between px-3 pb-2 pt-1">
            <div className="flex items-center gap-1">
              <button onClick={handleFileAttach} title="Attach file" className="btn-3d btn-ghost p-2" style={{ borderRadius: '8px' }}><Paperclip size={16} /></button>
              <button onClick={handleVoice} title={isListening ? 'Stop' : 'Dictate'}
                className={`btn-3d p-2 ${isListening ? 'btn-danger animate-pulse' : 'btn-ghost'}`}
                style={{ borderRadius: '8px' }}
              ><Mic size={16} /></button>
              <button title="Voice mode" onClick={() => alert('Voice mode coming soon!')} className="btn-3d btn-ghost p-2" style={{ borderRadius: '8px' }}><Headphones size={16} /></button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <select
                  value={selectedProvider}
                  onChange={e => setSelectedProvider(e.target.value)}
                  className="appearance-none text-xs rounded-xl pl-3 pr-7 py-1.5 outline-none cursor-pointer"
                  style={{ background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.15)', color: 'rgba(0,229,255,0.8)' }}
                >
                  {Object.entries(PROVIDERS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2 pointer-events-none" style={{ color: 'rgba(0,229,255,0.4)' }} />
              </div>
              <button
                className="btn-3d btn-primary px-4 py-1.5 text-sm min-w-[110px]"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-3 h-3 rounded-full border-2 border-blue-200/30 border-t-white animate-spin" />
                    Generating
                  </span>
                ) : '⚡ Generate'}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-2 space-y-0.5 text-center">
          <p className="text-xs" style={{ color: 'rgba(0,229,255,0.2)' }}>&copy; 2026 Arya Technology. All rights reserved.</p>
          <p className="text-xs" style={{ color: 'rgba(0,229,255,0.1)' }}>CaseGen Pro is developed and maintained by Arya Technology for internal and commercial use.</p>
        </div>
      </div>
    </div>
  );
}
