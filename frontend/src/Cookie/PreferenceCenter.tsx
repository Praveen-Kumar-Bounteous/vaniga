import * as Dialog from "@radix-ui/react-dialog";
import { X, ShieldCheck } from "lucide-react";
import { useState } from "react";
import type { ConsentState } from "@/types/onetrust";
import { CategoryToggle } from "./CategoryToggle";

const CATEGORIES = [
  { id: "C0001", name: "Strictly Necessary", description: "Essential for site security and core features.", isAlwaysActive: true },
  { id: "C0002", name: "Performance", description: "Helps us measure traffic and improve performance.", isAlwaysActive: false },
  { id: "C0003", name: "Functional", description: "Enables enhanced features like live chat and videos.", isAlwaysActive: false },
  { id: "C0004", name: "Targeting", description: "Used to show relevant ads based on your interests.", isAlwaysActive: false },
];

export const PreferenceCenter = ({ isOpen, onClose, consent, onAcceptAll, onRejectAll }: any) => {
  const [tempConsent, setTempConsent] = useState<ConsentState>(consent);

  const handleSave = () => {
    // Logic to save granular groups to OneTrust
    // For standard SDK, we trigger their save flow
    window.OneTrust.Close();
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-lg bg-white rounded-[2.5rem] shadow-2xl z-[10001] overflow-hidden focus:outline-none font-sans">
          
          {/* ACCESSIBILITY FIX */}
          <Dialog.Title className="sr-only">Cookie Preference Center</Dialog.Title>
          <Dialog.Description className="sr-only">Manage your privacy settings for Vaniga.</Dialog.Description>

          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-primary font-black italic uppercase text-sm tracking-widest">
                <ShieldCheck size={18} /> Privacy Center
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              {CATEGORIES.map(cat => (
                <CategoryToggle 
                  key={cat.id} 
                  category={cat} 
                  active={cat.isAlwaysActive || (tempConsent as any)[cat.name.toLowerCase()]}
                  onToggle={(val: boolean) => setTempConsent(prev => ({ ...prev, [cat.name.toLowerCase()]: val }))}
                />
              ))}
            </div>
          </div>

          <div className="p-6 bg-slate-50 flex flex-col sm:flex-row gap-3">
            <button onClick={onRejectAll} className="flex-1 px-6 py-3 border rounded-full font-black italic uppercase text-[10px] hover:bg-white transition-all">Reject All</button>
            <button onClick={handleSave} className="flex-1 px-6 py-3 border border-primary text-primary rounded-full font-black italic uppercase text-[10px] hover:bg-primary/5 transition-all">Save Preferences</button>
            <button onClick={onAcceptAll} className="flex-1 px-6 py-3 bg-primary text-white rounded-full font-black italic uppercase text-[10px] hover:bg-purple-700 transition-all shadow-lg shadow-primary/20">Accept All</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};