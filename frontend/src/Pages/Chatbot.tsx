import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Package, History } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import apiClient from "@/API/api-client";
import { Button } from "@/components/ui/button";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{id: number, text: string, sender: 'bot' | 'user'}[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuthStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const addMessage = (text: string, sender: 'bot' | 'user') => {
    setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        addMessage(user ? `Hi ${user.name}! How can I help with your orders?` : "Hello! Please login to track orders.", 'bot');
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, manualMsg?: string) => {
    e?.preventDefault();
    const textToSend = manualMsg || userInput;
    if (!textToSend.trim() || isTyping) return;

    addMessage(textToSend, 'user');
    setUserInput("");
    setIsTyping(true);

    try {
      const res = await apiClient.post('/users/bot/chat', { message: textToSend });
      setTimeout(() => {
        addMessage(res.data.reply, 'bot');
        setIsTyping(false);
      }, 800);
    } catch (err) {
      addMessage("Connection lost. Please try again.", 'bot');
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            // MOBILE RESPONSIVE WIDTHS
            className="mb-4 w-[calc(100vw-2rem)] sm:w-[360px] h-[70vh] sm:h-[550px] bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-5 md:p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl"><Bot size={20} /></div>
                <div>
                    <h3 className="font-black italic uppercase text-[10px] md:text-xs tracking-widest">Vaniga Assistant</h3>
                    <p className="text-[8px] font-bold opacity-70 uppercase tracking-tighter">Powered by AI</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg"><X size={20} /></button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/40">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] p-4 rounded-2xl text-[13px] font-medium shadow-sm whitespace-pre-wrap
                    ${m.sender === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border'}
                  `}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border px-4 py-3 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-1 h-1 bg-primary/40 rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-1 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions (Mobile optimized) */}
            {!isTyping && user && (
                <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t bg-white">
                    <button onClick={() => handleSendMessage(undefined, "Track Recent Order")} className="shrink-0 bg-slate-50 border text-slate-600 text-[9px] font-black uppercase px-3 py-2 rounded-full hover:bg-primary hover:text-white transition-all flex items-center gap-1.5">
                        <Package size={12}/> Recent Order
                    </button>
                    <button onClick={() => handleSendMessage(undefined, "Show My Order History")} className="shrink-0 bg-slate-50 border text-slate-600 text-[9px] font-black uppercase px-3 py-2 rounded-full hover:bg-primary hover:text-white transition-all flex items-center gap-1.5">
                        <History size={12}/> History
                    </button>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2">
               <input 
                 value={userInput}
                 onChange={(e) => setUserInput(e.target.value)}
                 placeholder="Paste Order ID or ask..." 
                 className="flex-1 bg-slate-100 rounded-xl px-4 py-2 text-xs font-bold border-none focus:ring-1 focus:ring-primary/20" 
               />
               <Button type="submit" size="icon" disabled={isTyping || !userInput.trim()} className="rounded-xl h-10 w-10 shrink-0">
                 <Send size={16}/>
               </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <Button 
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        className={`w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl transition-all duration-500 ${isOpen ? 'bg-slate-900 rotate-90' : 'bg-primary'}`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>
    </div>
  );
}