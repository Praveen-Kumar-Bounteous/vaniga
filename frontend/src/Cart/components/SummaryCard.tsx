import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ticket, ArrowRight, ShieldCheck } from "lucide-react";

export default function SummaryCard({ subtotal, onCheckout }: any) {
  const formatINR = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const savings = subtotal * 0.1; // 10% auto-savings
  const deliveryFee = subtotal > 2000 ? 0 : 40;
  const gst = subtotal * 0.18;
  const total = subtotal - savings + deliveryFee + gst;

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl space-y-6 sticky top-24 font-sans">
      <h3 className="text-xl font-black italic uppercase tracking-tighter border-b pb-4">Order Summary</h3>
      <div className="space-y-3 text-sm font-bold uppercase tracking-tight">
        <div className="flex justify-between text-slate-500"><span>Sub-total</span> <span>{formatINR(subtotal)}</span></div>
        <div className="flex justify-between text-green-600"><span>You Save (10%)</span> <span>- {formatINR(savings)}</span></div>
        <div className="flex justify-between text-slate-500"><span>Delivery Fee</span> <span>{deliveryFee === 0 ? "FREE" : formatINR(deliveryFee)}</span></div>
        <div className="flex justify-between text-slate-500"><span>Tax (GST 18%)</span> <span>{formatINR(gst)}</span></div>
      </div>
      <div className="pt-4 border-t space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Ticket size={12} /> Coupon Code</label>
        <div className="flex gap-2">
          <Input placeholder="COUPON" className="rounded-xl uppercase font-bold text-xs" />
          <Button variant="outline" className="rounded-xl font-black italic uppercase text-xs">Apply</Button>
        </div>
      </div>
      <div className="pt-6 border-t flex justify-between items-center">
        <span className="font-black italic uppercase text-slate-400">Total</span>
        <span className="text-3xl font-black italic text-primary tracking-tighter">{formatINR(total)}</span>
      </div>
      <Button onClick={onCheckout} className="w-full bg-primary hover:bg-purple-700 h-16 rounded-2xl font-black italic uppercase text-lg shadow-lg shadow-primary/20">
        Checkout <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
      <div className="flex justify-center items-center gap-2 text-[10px] text-slate-400 font-bold uppercase"><ShieldCheck size={14} className="text-green-500" /> Secure SSL Encryption</div>
    </div>
  );
}