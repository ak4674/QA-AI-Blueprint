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
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${isOpen ? 'bg-black/70 backdrop-blur-md opacity-100' : 'bg-transparent opacity-0 pointer-events-none'}`}>
      <div className={`bg-card w-full max-w-2xl h-[650px] max-h-[90vh] shadow-[0_0_80px_rgba(0,242,255,0.15)] rounded-3xl overflow-hidden flex flex-col border border-white/5 transition-all duration-500 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-12'}`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-black/40 to-neon-blue/10 p-6 flex items-center justify-between shrink-0 border-b border-white/5">
          <div className="flex items-center gap-4 text-neon-blue">
            <div className="bg-neon-blue/10 border border-neon-blue/30 p-2.5 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(0,242,255,0.2)]">
              <Sparkles size={24} className="text-neon-blue animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Lumi AI<span className="text-neon-blue">.</span></h2>
              <p className="text-neon-blue/60 text-[10px] uppercase font-bold tracking-[0.2em]">Robotic Career Agent</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-black/20 custom-scrollbar">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-5 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.3)] ${msg.sender === 'ai' ? 'bg-neon-blue/10 border border-neon-blue/30 text-neon-blue' : 'bg-white/5 border border-white/10 text-slate-300'}`}>
                {msg.sender === 'ai' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={`p-5 rounded-2xl text-[14px] leading-relaxed shadow-lg backdrop-blur-md ${msg.sender === 'user' ? 'bg-white/5 border border-white/10 text-slate-200 rounded-tr-none' : 'bg-neon-blue/5 border border-neon-blue/20 text-white rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
             <div className="flex gap-5 max-w-[85%]">
               <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/30 text-neon-blue flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                 <Bot size={20} />
               </div>
               <div className="p-5 rounded-2xl bg-neon-blue/5 border border-neon-blue/20 rounded-tl-none flex items-center gap-2 shadow-lg backdrop-blur-md">
                 <div className="w-1.5 h-4 bg-neon-blue animate-pulse [animation-delay:-0.3s]"></div>
                 <div className="w-1.5 h-4 bg-neon-blue animate-pulse [animation-delay:-0.15s]"></div>
                 <div className="w-1.5 h-4 bg-neon-blue animate-pulse"></div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-black/20 border-t border-white/5 shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
            className="flex items-center gap-4 bg-black/40 p-2 rounded-xl border border-white/5 focus-within:border-neon-blue/50 focus-within:ring-1 focus-within:ring-neon-blue/20 transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]"
          >
            <input 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Initialize command sequence..." 
              className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder-slate-700 text-sm font-medium"
            />
            <button 
              type="submit" 
              disabled={!inputValue.trim() || isTyping}
              className="p-3 bg-neon-blue/10 border border-neon-blue/40 text-neon-blue rounded-xl hover:bg-neon-blue/20 hover:shadow-[0_0_20px_rgba(0,242,255,0.3)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Send size={20} className={isTyping ? 'opacity-0' : 'opacity-100'} />
            </button>
          </form>
          <div className="flex gap-2 mt-4 px-1 overflow-x-auto no-scrollbar pb-1">
             {['Add my resume', 'Modify my resume', 'How can I network with recruiters?', 'Network with employees'].map(suggestion => (
               <button 
                 key={suggestion}
                 type="button"
                 onClick={() => handleSend(suggestion)}
                 className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:bg-neon-blue/10 hover:border-neon-blue/40 hover:text-neon-blue transition-all whitespace-nowrap"
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
