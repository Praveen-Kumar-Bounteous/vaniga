import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCartAPI } from "../cart.apiService";
import { fetchProductDetailsAPI } from "../../Product/product.apiService";
import { initiatePaymentAPI } from "../../Order/order.apiService";
import SummaryCard from "../components/SummaryCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const COUNTRIES = ["India", "United States", "United Kingdom", "UAE", "Canada"];

export default function CheckoutPage() {
  const [params] = useSearchParams();
  const productId = params.get("productId");
  const user = useAuthStore(s => s.user);

  const [couponData, setCouponData] = useState({ code: "", discount: 0 });
  const [address, setAddress] = useState({
    companyName: "",
    country: "India",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    customMessage: ""
  });

  const { data: cart } = useQuery({ queryKey: ['cart'], queryFn: fetchCartAPI, enabled: !productId });
  const { data: buyNowData } = useQuery({ queryKey: ['product', productId], queryFn: () => fetchProductDetailsAPI(productId!), enabled: !!productId });

  // 1. Calculate Prices
  const subtotal = productId ? (buyNowData?.product?.price || 0) : (cart?.items.reduce((acc: any, i: any) => acc + (i.product.price * i.quantity), 0) || 0);
  const savings = subtotal * 0.1;
  const deliveryFee = subtotal > 2000 ? 0 : 40;
  const gst = subtotal * 0.18;
  const total = subtotal - savings - couponData.discount + deliveryFee + gst;

  // 2. Order Review Items
  const orderItems = productId ? [{ product: buyNowData?.product, quantity: 1 }] : cart?.items || [];

  const handleCheckout = async () => {
    if (!address.street || !address.city || !address.phone || !address.zip) {
      return toast.error("Please fill in all required (*) address fields.");
    }

    try {
      const { data } = await initiatePaymentAPI({
        totalAmount: total,
        userId: user.id,
        email: user.email,
        name: user.name,
        phone: address.phone
      });

      const cashfree = new (window as any).Cashfree({ mode: "sandbox" });
      
      sessionStorage.setItem('temp_checkout_payload', JSON.stringify({
        address,
        productId,
        cashfreeOrderId: data.order_id, 
        couponCode: couponData.code,
        discountAmount: couponData.discount
      }));

      await cashfree.checkout({ paymentSessionId: data.payment_session_id, redirectTarget: "_self" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Payment failed to start");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans px-4">
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            <h1 className="text-3xl font-black italic uppercase text-primary tracking-tighter">Checkout</h1>

            {/* Address Form */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border shadow-xl space-y-6">
              <h3 className="font-black italic uppercase text-slate-400 text-xs tracking-widest">1. Billing Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input value={user?.name} disabled className="bg-slate-50 font-bold" />
                <Input value={user?.email} disabled className="bg-slate-50 font-bold" />
                <Input placeholder="Company Name (Optional)" onChange={e => setAddress({...address, companyName: e.target.value})} />
                <select className="h-10 border rounded-md px-3 text-sm" onChange={e => setAddress({...address, country: e.target.value})}>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <Input placeholder="Street Address *" onChange={e => setAddress({...address, street: e.target.value})} />
                <Input placeholder="City *" onChange={e => setAddress({...address, city: e.target.value})} />
                <Input placeholder="State *" onChange={e => setAddress({...address, state: e.target.value})} />
                <Input placeholder="Zip Code *" onChange={e => setAddress({...address, zip: e.target.value})} />
                <Input placeholder="Phone Number *" onChange={e => setAddress({...address, phone: e.target.value})} />
              </div>
              <Textarea placeholder="Order Notes (Optional)" className="rounded-xl" onChange={e => setAddress({...address, customMessage: e.target.value})} />
            </div>

            {/* Order Items Review */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border shadow-xl space-y-6">
              <h3 className="font-black italic uppercase text-slate-400 text-xs tracking-widest flex items-center gap-2">
                <ShoppingBag size={14}/> 2. Review Your Order
              </h3>
              <div className="divide-y">
                {orderItems.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between py-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden">
                        <img src={item.product?.images?.[0]} className="object-cover w-full h-full" alt="" />
                      </div>
                      <div>
                        <p className="font-bold text-sm uppercase italic">{item.product?.name}</p>
                        <p className="text-[10px] font-bold text-slate-400">QTY: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-black italic text-sm">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.product?.price)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Place Order Button */}
            <div className="pt-4">
              <Button onClick={handleCheckout} className="w-full bg-primary hover:bg-purple-700 h-16 rounded-2xl font-black italic uppercase text-xl shadow-xl shadow-primary/20">
                Place Order <ArrowRight className="ml-2" />
              </Button>
              <p className="text-center text-[10px] text-slate-400 font-bold uppercase mt-4 flex items-center justify-center gap-2">
                <ShieldCheck size={14} className="text-green-500" /> Secure SSL Encryption Enabled
              </p>
            </div>
          </div>

          {/* Sidebar Summary (Calculations & Coupon Only) */}
          <div className="lg:col-span-1">
             <SummaryCard 
                subtotal={subtotal} 
                onCheckout={() => {}}
                showCoupon={true}
                isCheckoutPage={true} 
                couponData={couponData} 
                setCouponData={setCouponData} 
             />
          </div>
        </div>
      </div>
    </div>
  );
}