import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartItem({ item, onUpdate, onRemove }: any) {
  const formatINR = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(p);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-white border border-slate-100 rounded-3xl transition-all hover:shadow-lg">
      <img src={item.product.images[0]} className="w-24 h-24 rounded-2xl object-cover bg-slate-50 border" />
      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-bold text-slate-800 uppercase italic tracking-tighter">{item.product.name}</h3>
        <p className="text-[10px] font-black text-primary uppercase italic">{item.product.category}</p>
        <p className="text-sm font-black mt-1">{formatINR(item.product.price)}</p>
      </div>
      <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-full border">
        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full cursor-pointer" onClick={() => onUpdate(item.id, item.quantity - 1)}><Minus size={14}/></Button>
        <span className="font-black italic text-sm w-4 text-center">{item.quantity}</span>
        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full cursor-pointer" onClick={() => onUpdate(item.id, item.quantity + 1)}><Plus size={14}/></Button>
      </div>
      <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 rounded-full cursor-pointer" onClick={() => onRemove(item.id)}><Trash2 size={18}/></Button>
    </div>
  );
}