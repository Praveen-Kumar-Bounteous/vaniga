import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirmOrderAPI } from "../order.apiService";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState(false);
  const queryClient = useQueryClient();
  const hasCalledAPI = useRef(false);
  const cfOrderId = params.get("order_id");

  useEffect(() => {
    if (hasCalledAPI.current) return;

    const finalize = async () => {
      if (!cfOrderId) {
        setError(true);
        setLoading(false);
        return;
      }

      hasCalledAPI.current = true; 

      try {
        // Only need the ID now! Backend handles the rest from DB.
        const response = await confirmOrderAPI(cfOrderId);
        
        if (response.data?.success) {
          setOrder(response.data.data);
          queryClient.invalidateQueries({ queryKey: ['cart'] });
          sessionStorage.removeItem('temp_checkout_payload'); // Clean up just in case
          setLoading(false);
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (err) {
        console.error("Order verification failed", err);
        hasCalledAPI.current = false; 
        setError(true);
        setLoading(false);
      }
    };

    finalize();
  }, [cfOrderId, queryClient]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-primary w-10 h-10 mb-4" />
      <h2 className="text-sm font-black italic uppercase tracking-widest text-slate-400">Verifying Payment...</h2>
    </div>
  );

  if (error && !order) return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-6 bg-slate-50">
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-xs w-full space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h1 className="text-xl font-black italic uppercase">Order Error</h1>
        <p className="text-slate-500 text-xs font-medium leading-relaxed">We couldn't confirm your transaction. It might be pending. Please check your history.</p>
        <Button onClick={() => navigate('/order-history')} className="w-full bg-primary h-12 rounded-xl font-black uppercase text-xs">View History</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-6 font-sans">
      <div className="max-w-sm w-full bg-white rounded-[2.5rem] shadow-xl p-8 text-center space-y-6 border border-slate-50">
        <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-100">
          <Check className="w-8 h-8 text-white" strokeWidth={5} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter">Purchase Success</h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">Thank's for your order at <span className="text-primary font-bold">Vaniga</span>.</p>
        </div>
        <div className="text-[13px] text-slate-500 font-medium space-y-4 leading-relaxed">
          <p>Order number: <span className="text-slate-900 font-black italic underline decoration-primary underline-offset-4">{order?.id?.split('-')[0].toUpperCase()}</span></p>
          <p className="text-purple-700 text-xs italic font-bold uppercase">You will receive an email invoice shortly.</p>
        </div>
        <div className="pt-4 flex flex-col gap-3">
          <Button onClick={() => navigate('/products')} className="w-full bg-primary h-14 rounded-2xl font-black italic uppercase text-md">Continue Shopping</Button>
          <button onClick={() => navigate('/order-history')} className="text-[10px] font-black uppercase text-slate-400 py-2">View Order History</button>
        </div>
      </div>
    </div>
  );
}