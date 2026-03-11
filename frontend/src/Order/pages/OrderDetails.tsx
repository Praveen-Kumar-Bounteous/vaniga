import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, CheckCircle2, CreditCard } from "lucide-react";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { Button } from "@/components/ui/button";

export default function OrderDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;
  const formatINR = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(p);

  if (!order) return <div className="p-20 text-center uppercase font-black italic">Order Not Found</div>;

  const addr = typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans px-4 print:bg-white print:pb-0">
      <div className="container mx-auto py-10 max-w-4xl">
        
        {/* Header - Hidden on Print */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] hover:text-primary transition-colors">
            <ArrowLeft size={14} /> Back to History
          </button>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="rounded-xl font-bold uppercase text-[10px] gap-2">
            <Printer size={14} /> Print Invoice
          </Button>
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-[2.5rem] border shadow-2xl overflow-hidden print:shadow-none print:border-none print:rounded-none">
          
          {/* Invoice Top Section */}
          <div className="p-8 md:p-12 border-b bg-slate-900 text-white flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-black italic tracking-tighter">VANIGA</h1>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Shipping address:</p>
                <p className="text-sm text-slate-300">{addr.street}, {addr.city}</p>
                <p className="text-sm text-slate-300">{addr.state}, {addr.zip}</p>
                <p className="text-sm text-slate-300">Phone: {addr.phone}</p>
              </div>
            </div>
            
            <div className="md:text-right space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Invoice Details:</p>
                <p className="text-xl font-mono font-bold">#{order.id.split('-')[0].toUpperCase()}</p>
                <p className="text-sm text-slate-300">Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              
              {/* Payment Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full">
                <CheckCircle2 size={14} className="text-green-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Payment {order.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Table Header */}
          <div className="p-8 md:p-12">
            <div className="w-full mb-8">
              <div className="grid grid-cols-12 pb-4 border-b-2 border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <div className="col-span-6 md:col-span-8">Product Description</div>
                <div className="col-span-3 md:col-span-2 text-center">Qty</div>
                <div className="col-span-3 md:col-span-2 text-right">Price</div>
              </div>

              {/* Items Loop */}
              {order.items.map((item: any) => (
                <div key={item.id} className="grid grid-cols-12 py-6 border-b border-slate-50 items-center">
                  <div className="col-span-6 md:col-span-8">
                    <p className="font-bold text-slate-800 uppercase italic">{item.name}</p>
                  </div>
                  <div className="col-span-3 md:col-span-2 text-center font-bold text-slate-600">
                    x{item.quantity}
                  </div>
                  <div className="col-span-3 md:col-span-2 text-right font-black italic text-slate-900">
                    {formatINR(item.price)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Bottom Section */}
            <div className="flex flex-col md:flex-row justify-between gap-10">
              {/* Left: Notes & Payment Info */}
              <div className="flex-1 space-y-6">
                {order.customMessage && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-slate-400">Order Notes:</p>
                    <p className="text-sm font-medium text-slate-500 bg-slate-50 p-4 rounded-2xl italic border-l-4 border-primary">
                      "{order.customMessage}"
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400">Payment Method:</p>
                  <div className="flex items-center gap-3 text-slate-600">
                    <CreditCard size={18} />
                    <p className="text-xs font-bold uppercase italic">Cashfree Secure Transaction</p>
                  </div>
                  <p className="text-[9px] font-mono text-slate-400">Ref: {order.paymentId}</p>
                </div>
              </div>

              {/* Right: Totals Summary */}
              <div className="w-full md:w-64 space-y-3">
                <div className="flex justify-between text-sm font-bold text-slate-400 uppercase">
                  <span>Order Status</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="flex justify-between pt-4 border-t-2 border-slate-900 items-center">
                  <span className="text-sm font-black italic uppercase text-slate-900">Grand Total</span>
                  <span className="text-2xl font-black italic text-primary tracking-tighter">
                    {formatINR(order.totalAmount)}
                  </span>
                </div>
                <p className="text-[10px] text-right text-slate-400 font-bold uppercase italic">Includes GST (18%)</p>
              </div>
            </div>
          </div>

          {/* Footer - Only visible on print or screen footer */}
          <div className="p-8 text-center border-t bg-slate-50">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Thank you for choosing Vaniga</p>
          </div>
        </div>
      </div>
    </div>
  );
}