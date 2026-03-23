import React, { useState } from 'react';
import { X, Linkedin, Lock, User } from 'lucide-react';

interface LinkedInLoginModalProps {
  onClose: () => void;
  onConnect: () => void;
}

export function LinkedInLoginModal({ onClose, onConnect }: LinkedInLoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onConnect();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#131B2B] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="bg-[#0077b5]/20 p-2 rounded-lg border border-[#0077b5]/30">
              <Linkedin size={20} className="text-[#0077b5]" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Connect LinkedIn</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">LinkedIn Email / Username</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  required 
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-[#0077b5] focus:ring-1 focus:ring-[#0077b5]/50 transition-all" 
                  placeholder="name@example.com" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  required 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-[#0077b5] focus:ring-1 focus:ring-[#0077b5]/50 transition-all" 
                  placeholder="••••••••" 
                />
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 leading-relaxed italic">
            Integrating your LinkedIn account allows **JobVerse** to automatically sync connection status and message sequences across your networking pipeline.
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 bg-[#0077b5] hover:bg-[#0087d1] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-[#0077b5]/20 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              'Verify & Connect Account'
            )}
          </button>
          
          <p className="text-center text-[10px] text-slate-600">
            By connecting, you agree to allow JobVerse to access your profile data for workflow automation.
          </p>
        </form>
      </div>
    </div>
  );
}
