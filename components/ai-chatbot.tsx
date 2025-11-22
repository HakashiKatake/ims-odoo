'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Cpu, Sparkles } from 'lucide-react';
import { Product, StockOperation } from '../types/dashboard';

// Message interface for chat messages
interface Message {
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

// Props interface for AIChat component
interface AIChatProps {
  inventory: Product[];
  history: StockOperation[];
}

const AIChat: React.FC<AIChatProps> = ({ inventory, history }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hi! I\'m your inventory assistant. I can help you with stock levels, product information, and inventory management questions. How can I help you today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    const userMessage: Message = {
      role: 'user',
      text: userMsg,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          role: 'ai',
          text: data.response || 'No response received.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage: Message = {
          role: 'ai',
          text: errorData.error || 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'ai',
        text: 'Sorry, I\'m having trouble connecting. Please try again later.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)] z-50 transition-all hover:scale-105 hover:rotate-3 flex items-center gap-2 border border-indigo-400"
      >
        <Cpu size={24} className="animate-pulse" />
        <span className="font-bold text-xs tracking-widest hidden md:inline">AI HELP</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-[380px] h-[550px] bg-[#0f172a]/95 backdrop-blur-xl rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 flex flex-col border border-indigo-500/50 animate-fade-in overflow-hidden ring-1 ring-cyan-500/30">
      {/* Header */}
      <div className="p-4 bg-indigo-950/50 text-white flex justify-between items-center border-b border-indigo-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 animate-pulse"></div>
        <div className="flex items-center gap-3 relative z-10">
            <div className="bg-cyan-950/50 p-2 rounded border border-cyan-500/50">
                <Cpu size={18} className="text-cyan-400" />
            </div>
            <div>
                <h3 className="font-bold text-sm tracking-widest text-white">AI ASSISTANT</h3>
                <p className="text-[10px] text-cyan-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    ONLINE
                </p>
            </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="relative z-10 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#0f172a] to-[#020617]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed border ${
                msg.role === 'user' 
                ? 'bg-indigo-600/80 text-white border-indigo-500 rounded-tr-none shadow-[0_0_15px_rgba(79,70,229,0.2)]' 
                : 'bg-slate-800/80 text-cyan-100 border-slate-700 rounded-tl-none shadow-[0_0_10px_rgba(0,0,0,0.3)]'
            }`}>
               {msg.role === 'ai' ? (
                 <div className="flex gap-3">
                     <Sparkles size={14} className="mt-1 text-cyan-400 shrink-0" />
                     <div className="font-mono text-xs opacity-90" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                 </div>
              ) : (
                 <span className="font-sans font-medium tracking-wide">{msg.text}</span>
              )}
            </div>
          </div>
        ))}
        {loading && (
             <div className="flex justify-start">
                <div className="bg-slate-800/50 p-3 rounded-lg rounded-tl-none border border-slate-700">
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                </div>
            </div>
        )}
        
        {messages.length === 1 && !loading && (
          <div className="space-y-3">
            <p className="text-sm text-cyan-400 font-medium">Quick questions:</p>
            <div className="grid gap-2">
              {[
                'What products are low in stock?',
                'Show me recent receipts',
                'What deliveries are scheduled?',
                'Show me recent transfers',
                'What are the recent adjustments?',
                'How do I create a stock transfer?'
              ].map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(question);
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="text-left text-sm p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500 hover:bg-slate-800/80 transition-all text-cyan-100"
                  disabled={loading}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-[#0f172a] border-t border-indigo-500/30">
        <div className="flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask a question..."
                className="flex-1 bg-slate-900/80 border-slate-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 font-mono disabled:opacity-50"
                disabled={loading}
                autoFocus
            />
            <button 
                onClick={handleSend} 
                disabled={loading || !input.trim()}
                className="bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 border border-cyan-500/50 p-2 rounded transition-all disabled:opacity-50 hover:shadow-[0_0_10px_cyan]"
            >
                {loading ? (
                  <div className="animate-spin">
                    <Cpu size={18} />
                  </div>
                ) : (
                  <Send size={18} />
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
export { AIChat as AIChatbot };