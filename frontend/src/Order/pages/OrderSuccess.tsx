import { useEffect, useState, useRef } from "react"; // Added useRef
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirmOrderAPI } from "../order.apiService";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState(false);
  
  // Use a Ref to track API call. State is too slow to prevent double-firing in StrictMode
  const hasCalledAPI = useRef(false);

  const cfOrderId = params.get("order_id");

  useEffect(() => {
    // 1. If we've already started the API call, don't do it again
    if (hasCalledAPI.current) return;

    const finalize = async () => {
      const rawPayload = sessionStorage.getItem('temp_checkout_payload');
      
      if (!cfOrderId) { 
        setError(true); 
        setLoading(false); 
        return; 
      }

      // Mark as called immediately before async operations
      hasCalledAPI.current = true;

      // Handle both Initial Landing (with payload) and Reload (without payload)
      let payload = rawPayload ? JSON.parse(rawPayload) : {};
      payload.cashfreeOrderId = cfOrderId;

      try {
        const response = await confirmOrderAPI(payload);
        if (response.data?.success) {
          setOrder(response.data.data);
          sessionStorage.removeItem('temp_checkout_payload');
          setLoading(false);
        } else { 
          setError(true); 
          setLoading(false);
        }
      } catch (err) { 
        console.error("Order verification failed", err);
        setError(true); 
        setLoading(false); 
      }
    };

    finalize();
  }, [cfOrderId]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-primary w-10 h-10 mb-4" />
      <h2 className="text-sm font-black italic uppercase tracking-widest text-slate-400">Verifying...</h2>
    </div>
  );

  if (error && !order) return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-6 bg-slate-50">
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-xs w-full space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h1 className="text-xl font-black italic uppercase">Order Error</h1>
        <p className="text-slate-500 text-xs font-medium leading-relaxed">We couldn't confirm your transaction. Please check your history.</p>
        <Button onClick={() => navigate('/order-history')} className="w-full bg-primary h-12 rounded-xl font-black uppercase text-xs">View History</Button>
      </div>
    </div>
  );

  const displayId = order?.id?.split('-')[0].toUpperCase() || cfOrderId?.split('_')[1] || cfOrderId;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-6 font-sans">
      <div className="max-w-sm w-full bg-white rounded-[2.5rem] shadow-xl p-8 text-center space-y-6 border border-slate-50">
        
        <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-100">
          <Check className="w-8 h-8 text-white" strokeWidth={5} />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter">Purchase Success</h1>
          <p className="text-slate-500 font-medium text-sm leading-relaxed">
            Thank's for your order at <span className="text-primary font-bold">Vaniga</span>. Your order will be processed as soon as possible.
          </p>
        </div>

        <div className="text-[13px] text-slate-500 font-medium space-y-4 leading-relaxed">
          <p>
            Make sure you note of your order number which is <span className="text-slate-900 font-black italic underline decoration-primary underline-offset-4">{displayId}</span>
          </p>
          <p className="text-purple-700 text-xs italic font-bold uppercase">
            will be receiving an email shortly with invoice from your order
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Button 
            onClick={() => navigate('/products')} 
            className="cursor-pointer w-full bg-primary hover:bg-purple-700 h-14 rounded-2xl font-black italic uppercase text-md shadow-lg shadow-primary/20"
          >
            Continue Shopping
          </Button>
          <button 
            onClick={() => navigate('/order-history')} 
            className=" cursor-pointer text-[10px] font-black uppercase text-slate-400 hover:text-primary tracking-widest transition-colors py-2"
          >
            View Order History
          </button>
        </div>
      </div>
    </div>
  );
}