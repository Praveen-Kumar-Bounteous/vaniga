import React from "react";
import type { CookieCategory } from "@/types/onetrust";
import { Check } from "lucide-react";

interface CategoryToggleProps {
  category: CookieCategory;
  active: boolean;
  onToggle: (value: boolean) => void;
}

export const CategoryToggle: React.FC<CategoryToggleProps> = ({
  category,
  active,
  onToggle,
}) => {
  const isLocked = category.isAlwaysActive;

  return (
    <div className={`flex items-start justify-between gap-6 p-5 rounded-2xl border transition-all duration-300 ${active ? 'border-primary/20 bg-primary/5' : 'border-slate-100 bg-white'}`}>
      
      {/* --- TEXT CONTENT --- */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-sm text-slate-900 uppercase tracking-tight italic">
            {category.name}
          </h4>
          {isLocked && (
            <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-200">
              <Check size={10} strokeWidth={4} /> Always Active
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          {category.description}
        </p>
      </div>

      {/* --- TOGGLE SWITCH --- */}
      <div className="shrink-0 mt-1">
        {isLocked ? (
          // Locked State (Always On)
          <div className="relative w-11 h-6 bg-emerald-500 rounded-full cursor-not-allowed transition-opacity opacity-80 shadow-inner">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
          </div>
        ) : (
          // Interactive State
          <button
            role="switch"
            aria-checked={active}
            onClick={() => onToggle(!active)}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-inner
              ${active ? "bg-primary" : "bg-slate-200"}`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ease-in-out
                ${active ? "left-6" : "left-1"}`}
            />
          </button>
        )}
      </div>
    </div>
  );
};