'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCyberStore } from '@/store/cyberStore';
import { 
  Send, Bot, User, Sparkles, ShieldAlert, CheckCircle, FileText, ArrowRight
} from 'lucide-react';

export default function CopilotPanel() {
  // Granular Zustand selectors
  const copilotMessages = useCyberStore(state => state.copilotMessages);
  const copilotLoading = useCyberStore(state => state.copilotLoading);
  const sendCopilotMessage = useCyberStore(state => state.sendCopilotMessage);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || copilotLoading) return;
    sendCopilotMessage(input);
    setInput('');
  };

  const handleQuickAction = (text: string) => {
    if (copilotLoading) return;
    sendCopilotMessage(text);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotMessages, copilotLoading]);

  return (
    <div className="flex flex-col h-full bg-[#070b19]/90 border border-cyan-500/10 rounded-xl overflow-hidden backdrop-blur-md">
      {/* Copilot Header */}
      <div className="p-4 border-b border-cyan-500/10 flex items-center justify-between bg-gradient-to-r from-cyan-950/40 to-indigo-950/40">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bot className="h-5 w-5 text-cyan-400" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
              ShieldCore AI Security Copilot (Demo RAG Provider)
            </h3>
            <span className="text-[9px] font-mono text-cyan-400/80">
              Linked to National CNI Multi-Agent Mesh
            </span>
          </div>
        </div>
        <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
      </div>

      {/* Messages area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 font-mono text-[11px] leading-relaxed">
        {copilotMessages.map((msg, i) => (
          <div 
            key={`${msg.timestamp}-${i}`} 
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role !== 'user' && (
              <div className="h-6 w-6 rounded-full bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Bot className="h-3.5 w-3.5 text-cyan-400" />
              </div>
            )}

            <div className={`max-w-[85%] rounded-lg p-3 ${
              msg.role === 'user' 
                ? 'bg-cyan-950/50 border border-cyan-500/20 text-cyan-100' 
                : 'bg-[#0b1426] border border-cyan-500/5 text-gray-300'
            }`}>
              <div className="space-y-2 whitespace-pre-wrap">
                {msg.content}
              </div>

              {msg.evidence && (
                <div className="mt-3 pt-3 border-t border-cyan-500/10 space-y-2 text-[10px]">
                  <div className="flex items-center gap-1.5 text-orange-400 font-bold uppercase tracking-wider text-[9px]">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    AI Explainability & Evidence
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-gray-400">
                    {msg.evidence.mitre && (
                      <div>
                        MITRE technique: <span className="text-white">{msg.evidence.mitre}</span>
                      </div>
                    )}
                    {msg.evidence.cve && (
                      <div>
                        Associated CVE: <span className="text-white">{msg.evidence.cve}</span>
                      </div>
                    )}
                    {msg.evidence.score && (
                      <div>
                        Confidence Score: <span className="text-emerald-400 font-bold">{msg.evidence.score}%</span>
                      </div>
                    )}
                  </div>
                  {msg.evidence.actionsTaken && (
                    <div className="mt-1.5">
                      <div className="text-gray-400 mb-1">Actions Executed by Auto Response AI:</div>
                      <div className="space-y-1">
                        {msg.evidence.actionsTaken.map((act: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle className="h-3 w-3" />
                            {act}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="h-6 w-6 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center shrink-0">
                <User className="h-3.5 w-3.5 text-cyan-300" />
              </div>
            )}
          </div>
        ))}

        {copilotLoading && (
          <div className="flex gap-3 justify-start">
            <div className="h-6 w-6 rounded-full bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center shrink-0 animate-spin">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="bg-[#0b1426] border border-cyan-500/5 text-gray-500 rounded-lg p-3 italic">
              Coordinating with AI Agents (Sentinel, Behavior, Correlation)...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions */}
      <div className="p-3 border-t border-cyan-500/10 bg-[#060a15]/80 space-y-1.5 font-mono text-[9px] text-cyan-400/90">
        <div className="uppercase tracking-widest text-gray-500 mb-1">Suggested CNI Prompts</div>
        <div className="flex flex-wrap gap-1.5">
          <button 
            onClick={() => handleQuickAction('Why was this endpoint isolated?')}
            className="flex items-center gap-1 bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-500/20 px-2 py-1 rounded transition duration-150"
          >
            Explain Isolation of AIIMS DB
            <ArrowRight className="h-2.5 w-2.5" />
          </button>
          <button 
            onClick={() => handleQuickAction('Predict the next attack stage')}
            className="flex items-center gap-1 bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-500/20 px-2 py-1 rounded transition duration-150"
          >
            Predict Next Attack Stages
            <ArrowRight className="h-2.5 w-2.5" />
          </button>
          <button 
            onClick={() => handleQuickAction('Recommend vulnerability patch priority')}
            className="flex items-center gap-1 bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-500/20 px-2 py-1 rounded transition duration-150"
          >
            Show Patch Priorities
            <ArrowRight className="h-2.5 w-2.5" />
          </button>
          <button 
            onClick={() => handleQuickAction('Generate executive incident report')}
            className="flex items-center gap-1 bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-500/20 px-2 py-1 rounded transition duration-150"
          >
            <FileText className="h-2.5 w-2.5" />
            Generate Incident Report
          </button>
        </div>
      </div>

      {/* Input bar */}
      <form 
        onSubmit={handleSubmit}
        className="p-3 border-t border-cyan-500/10 flex gap-2 bg-[#080d1f]"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Security Copilot (e.g. 'Status of power grid?')..."
          disabled={copilotLoading}
          className="flex-grow bg-[#040815] border border-cyan-500/20 rounded px-3 py-2 text-[11px] font-mono text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
        />
        <button
          type="submit"
          disabled={copilotLoading || !input.trim()}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-950 disabled:text-gray-600 text-white p-2 rounded transition flex items-center justify-center shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
