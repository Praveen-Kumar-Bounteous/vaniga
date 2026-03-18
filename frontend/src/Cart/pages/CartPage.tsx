import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchCartAPI, updateQuantityAPI, removeFromCartAPI } from "../cart.apiService";
import CartItem from "../components/CartItem";
import SummaryCard from "../components/SummaryCard";
import { Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: cart, isLoading } = useQuery({ queryKey: ['cart'], queryFn: fetchCartAPI });

  const updateMut = useMutation({
    mutationFn: ({ id, q }: any) => updateQuantityAPI(id, q),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  });

  const removeMut = useMutation({
    mutationFn: (id: string) => removeFromCartAPI(id),
    onSuccess: () => { toast.success("Item removed"); queryClient.invalidateQueries({ queryKey: ['cart'] }); }
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  const subtotal = cart?.items.reduce((acc: number, i: any) => acc + (i.product.price * i.quantity), 0) || 0;

  if (!cart?.items.length) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans">
      <ShoppingBag size={80} className="text-slate-100 mb-4" />
      <h2 className="text-2xl font-black italic uppercase">Cart is empty</h2>
      <Button onClick={() => navigate('/products')} variant="link" className="text-primary font-bold uppercase mt-2">Go Shopping</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans px-4 md:px-6">
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-10 border-l-8 border-primary pl-6">Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item: any) => (
              <CartItem key={item.id} item={item} onUpdate={(id: any, q: any) => { if(q < 1) return; updateMut.mutate({ id, q })}} onRemove={(id: any) => removeMut.mutate(id)} />
            ))}
          </div>
          <SummaryCard
            subtotal={subtotal}
            showCoupon={false}
            onCheckout={() => navigate('/checkout')}
          />
        </div>
      </div>
    </div>
  );
}