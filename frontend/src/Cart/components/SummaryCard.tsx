import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ticket, ArrowRight, ShieldCheck, Loader2, X } from "lucide-react";
import { validateCouponAPI } from "../cart.apiService";
import { toast } from "sonner";

interface SummaryCardProps {
  subtotal: number;
  onCheckout: (data: { total: number; appliedCoupon: any }) => void;
  isCheckoutPage?: boolean;
  showCoupon?: boolean;
  couponData?: { code: string; discount: number }; 
  setCouponData?: (data: { code: string; discount: number }) => void;
}

export default function SummaryCard({ 
  subtotal, 
  onCheckout, 
  isCheckoutPage = false, 
  showCoupon = true, // Default to true
  couponData: externalCouponData, 
  setCouponData: externalSetCouponData 
}: SummaryCardProps) {
  const [localCoupon, setLocalCoupon] = useState({ code: "", discount: 0 });
  const [couponInput, setCouponInput] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const activeCoupon = externalCouponData || localCoupon;
  const setActiveCoupon = externalSetCouponData || setLocalCoupon;

  const formatINR = (p: number) => new Intl.NumberFormat('en-IN', { 
    style: 'currency', currency: 'INR', maximumFractionDigits: 0 
  }).format(p);

  const autoSavings = subtotal * 0.1; 
  const couponDiscount = activeCoupon?.discount || 0;
  const deliveryFee = subtotal > 2000 ? 0 : 40;
  const gst = subtotal * 0.18;
  const total = subtotal - autoSavings - couponDiscount + deliveryFee + gst;

  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    setIsValidating(true);
    try {
      const data = await validateCouponAPI(couponInput);
      if (data.success) {
        setActiveCoupon({ code: data.code, discount: data.discount });
        toast.success(`Coupon applied!`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid Coupon");
      setActiveCoupon({ code: "", discount: 0 });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon({ code: "", discount: 0 });
    setCouponInput("");
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-xl space-y-6 sticky top-24 font-sans">
      <h3 className="text-xl font-black italic uppercase tracking-tighter border-b pb-4">Order Summary</h3>
      
      <div className="space-y-3 text-sm font-bold uppercase tracking-tight">
        <div className="flex justify-between text-slate-500"><span>Sub-total</span> <span>{formatINR(subtotal)}</span></div>
        <div className="flex justify-between text-green-600"><span>Auto Savings (10%)</span> <span>- {formatINR(autoSavings)}</span></div>
        
        {/* Only show discount line if a coupon is active */}
        {showCoupon && activeCoupon?.code && (
          <div className="flex justify-between text-primary items-center animate-in slide-in-from-left-2">
            <span className="font-black italic uppercase text-[10px] flex items-center">
              <Ticket size={12} className="mr-1"/> ({activeCoupon.code})
            </span> 
            <span className="font-black italic flex items-center gap-2">
              - {formatINR(activeCoupon.discount)}
              <button onClick={handleRemoveCoupon} className="text-red-500 hover:bg-red-50 p-1 rounded-full"><X size={14} /></button>
            </span>
          </div>
        )}

        <div className="flex justify-between text-slate-500"><span>Delivery Fee</span> <span>{deliveryFee === 0 ? "FREE" : formatINR(deliveryFee)}</span></div>
        <div className="flex justify-between text-slate-500"><span>Tax (GST 18%)</span> <span>{formatINR(gst)}</span></div>
      </div>

      {/* CONDITIONAL COUPON INPUT SECTION */}
      {showCoupon && (
        <div className="pt-4 border-t space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400">Coupon Code</label>
            <div className="flex gap-2">
            <Input 
                placeholder="COUPON" 
                className="rounded-xl uppercase font-bold text-xs h-11" 
                value={couponInput}
                disabled={!!activeCoupon?.code}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            />
            {activeCoupon?.code ? (
                <Button variant="destructive" className="rounded-xl h-11 px-4 font-black italic uppercase text-xs cursor-pointer" onClick={handleRemoveCoupon}>Remove</Button>
            ) : (
                <Button variant="outline" className="rounded-xl h-11 px-4 font-black italic uppercase text-xs cursor-pointer" onClick={handleApplyCoupon} disabled={isValidating || !couponInput}>
                {isValidating ? <Loader2 className="animate-spin" size={14} /> : "Apply"}
                </Button>
            )}
            </div>
        </div>
      )}

      <div className="pt-6 border-t flex justify-between items-center">
        <span className="font-black italic uppercase text-slate-400">Total</span>
        <span className="text-3xl font-black italic text-primary tracking-tighter">{formatINR(total > 0 ? total : 0)}</span>
      </div>

      {!isCheckoutPage ? (
        <Button 
          onClick={() => onCheckout({ total, appliedCoupon: activeCoupon })} 
          className="w-full bg-primary hover:bg-purple-700 h-16 rounded-2xl font-black italic uppercase text-lg shadow-xl shadow-primary/20 cursor-pointer"
        >
          Checkout <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      ) : (
        <div className="bg-slate-50 p-4 rounded-2xl border flex items-center gap-3">
            <ShieldCheck className="text-green-500 shrink-0" size={20} />
            <p className="text-[10px] font-bold text-slate-500 uppercase leading-tight">Secure SSL Checkout Enabled.</p>
        </div>
      )}
    </div>
  );
}