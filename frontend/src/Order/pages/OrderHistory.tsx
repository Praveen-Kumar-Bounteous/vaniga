import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchOrderHistoryAPI } from "../order.apiService";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { Loader2, Package, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderHistory() {
  const navigate = useNavigate();
  const formatINR = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const { data: orders, isLoading } = useQuery({ 
    queryKey: ['orders'], 
    queryFn: fetchOrderHistoryAPI 
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  if (!orders || orders.length === 0) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <ShoppingBag size={60} className="text-slate-200" />
      <h2 className="text-2xl font-black italic uppercase">No Orders Found</h2>
      <Button onClick={() => navigate('/products')} variant="link" className="text-primary font-bold">Start Shopping</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans px-4">
      <div className="container mx-auto py-10 max-w-4xl">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-10 border-l-8 border-primary pl-6">
          Order <span className="text-primary">History</span>
        </h1>

        <div className="space-y-4">
          {orders.map((order: any) => (
            <div 
              key={order.id} 
              onClick={() => navigate(`/order-details/${order.id}`, { state: { order } })}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                
                {/* ID and Date */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-primary/10 transition-colors">
                    <Package className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Order ID</p>
                    <p className="font-bold text-sm tracking-tight">{order.id.split('-')[0].toUpperCase()}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase italic">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Amount and Status */}
                <div className="flex justify-between md:justify-end items-center gap-8 flex-1">
                   <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-slate-400">Grand Total</p>
                    <p className="font-black italic text-primary text-lg">{formatINR(order.totalAmount)}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <OrderStatusBadge status={order.status} />
                    {/* Payment Status Label */}
                    <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-[9px] font-black uppercase text-slate-500 italic">
                          Payment {order.paymentStatus}
                        </span>
                    </div>
                  </div>

                  <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-colors hidden md:block" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}