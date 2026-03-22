import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';

interface LumiModalProps {
  onClose: () => void;
  initialQuery?: string;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export function LumiModal({ onClose, initialQuery = '' }: LumiModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Hello! I am Lumi 🤖. I can help you modify your resume, strategize your network, or optimize job hunting. How can I assist you today?' }
  ]);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-send initial query if provided
  useEffect(() => {
    // Small delay for entrance animation
    setIsOpen(true);
    
    if (initialQuery) {
      setTimeout(() => {
        handleSend(initialQuery);
        setInputValue('');
      }, 500);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = { id: crypto.randomUUID(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent("You are Lumi AI, a concise and polite web application career assistant robot. Please answer the user briefly. " + text)}`);
      if (!response.ok) throw new Error("API Failed");
      const data = await response.text();
      
      const aiMsg: Message = { id: crypto.randomUUID(), sender: 'ai', text: data };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      // Fallback
      const aiResponse: Message = { 
        id: crypto.randomUUID(), 
        sender: 'ai', 
        text: `Based on my analysis, that's an excellent approach! To optimize your chances, I recommend tailoring your resume to highlight your quantifiable achievements matching the target role description.` 
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300); // Wait for transition out
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'bg-black/60 backdrop-blur-sm opacity-100' : 'bg-transparent opacity-0 pointer-events-none'}`}>
      <div className={`bg-slate-950/90 w-full max-w-2xl h-[600px] max-h-[90vh] shadow-[0_0_50px_rgba(6,182,212,0.15)] rounded-2xl overflow-hidden flex flex-col border border-cyan-500/30 transition-all duration-300 transform backdrop-blur-xl ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-cyan-950 p-5 flex items-center justify-between shrink-0 border-b border-cyan-500/20">
          <div className="flex items-center gap-3 text-cyan-400">
            <div className="bg-cyan-500/10 border border-cyan-500/30 p-2 rounded-lg backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Sparkles size={24} className="text-cyan-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-mono tracking-widest font-bold text-cyan-50">Lumi AI<span className="text-cyan-500">_</span></h2>
              <p className="text-cyan-400/70 text-xs font-mono tracking-wider">ROBOTIC.CAREER.AGENT</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-cyan-500/70 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/50 custom-scrollbar">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.2)] ${msg.sender === 'ai' ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-400' : 'bg-slate-800 border border-slate-600 text-slate-300'}`}>
                {msg.sender === 'ai' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={`p-4 rounded-xl text-sm leading-relaxed font-sans shadow-sm backdrop-blur-sm ${msg.sender === 'user' ? 'bg-slate-800/80 border border-slate-700 text-slate-200 rounded-tr-none' : 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-50 rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
             <div className="flex gap-4 max-w-[85%]">
               <div className="w-8 h-8 rounded-md bg-cyan-950 border border-cyan-500/50 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                 <Bot size={18} />
               </div>
               <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 rounded-tl-none flex items-center gap-2 shadow-sm backdrop-blur-sm">
                 <div className="w-1.5 h-4 bg-cyan-400 animate-pulse [animation-delay:-0.3s]"></div>
                 <div className="w-1.5 h-4 bg-cyan-400 animate-pulse [animation-delay:-0.15s]"></div>
                 <div className="w-1.5 h-4 bg-cyan-400 animate-pulse"></div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-cyan-500/20 shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
            className="flex items-center gap-3 bg-slate-950/80 p-2 rounded-lg border border-cyan-900/50 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
          >
            <input 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Initialize command sequence..." 
              className="flex-1 bg-transparent px-3 py-2 outline-none text-cyan-100 placeholder-cyan-700/50 text-sm font-mono"
            />
            <button 
              type="submit" 
              disabled={!inputValue.trim() || isTyping}
              className="p-2.5 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 rounded-md hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Send size={18} className={isTyping ? 'opacity-0' : 'opacity-100'} />
            </button>
          </form>
          <div className="flex gap-2 mt-3 px-2 overflow-x-auto no-scrollbar pb-1">
             {['Add my resume', 'Modify my resume', 'How can I network with recruiters?', 'Network with employees'].map(suggestion => (
               <button 
                 key={suggestion}
                 type="button"
                 onClick={() => handleSend(suggestion)}
                 className="agentic-btn px-3 py-1.5 text-xs rounded-md whitespace-nowrap"
               >
                 {suggestion}
               </button>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
