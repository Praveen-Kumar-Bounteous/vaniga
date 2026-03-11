import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProfileAPI, updateProfileAPI } from "../user.apiService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, MapPin, Package, 
  CreditCard, LogOut, ShieldCheck, 
  ShoppingCart, Save
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import OrderHistory from "@/Order/pages/OrderHistory";
import { useEffect } from "react";
import CartPage from "@/Cart/pages/CartPage";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const logout = useAuthStore(s => s.logout);
  
  const { data: profile, isLoading } = useQuery({ 
    queryKey: ['profile-dashboard'], 
    queryFn: fetchProfileAPI 
  });

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (profile) reset({
        name: profile.name,
        email: profile.email,
        address: profile.address || { street: "", city: "", state: "", zip: "", country: "India" }
    });
  }, [profile, reset]);

  const updateMut = useMutation({
    mutationFn: updateProfileAPI,
    onSuccess: () => {
      toast.success("Account updated successfully");
      queryClient.invalidateQueries({ queryKey: ['profile-dashboard'] });
    },
    onError: () => toast.error("Failed to update account")
  });

  if (isLoading) return <div className="h-96 flex items-center justify-center font-black italic text-primary animate-pulse text-2xl">VANIGA...</div>;

  const formatINR = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(p);

  return (
    <div className="bg-[#F8F9FA] font-sans min-h-screen">
      <div className="container mx-auto px-4 py-8 lg:pb-8 pb-24">
        
        <Tabs defaultValue="personal" className="w-full">
          {/* 
              WRAPPER DIV: 
              This is the "Fix" - we put the flex logic on a standard div 
              instead of the Tabs component itself.
          */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* --- LEFT SIDEBAR (Desktop) / BOTTOM NAV (Mobile) --- */}
            <aside className="w-full lg:w-[280px] fixed bottom-0 left-0 z-50 lg:relative lg:bottom-auto lg:z-0 lg:flex-shrink-0">
              <div className="bg-white border-t lg:border border-slate-200 lg:rounded-[2rem] p-2 lg:p-6 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] lg:shadow-sm flex flex-row lg:flex-col items-center lg:items-stretch h-auto lg:h-full lg:min-h-[500px]">
                
                {/* User Identity - Hidden on mobile bottom bar */}
                <div className="hidden lg:flex flex-col items-center text-center space-y-4 mb-8 pt-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary border-2 border-primary/20">
                    <User size={32} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 leading-tight truncate w-full px-2">{profile?.name}</h2>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{profile?.role}</p>
                  </div>
                </div>

                {/* Navigation Links */}
                <TabsList className="flex flex-row lg:flex-col w-full bg-transparent h-auto p-0 space-y-0 lg:space-y-1 items-center lg:items-start flex-1 justify-around lg:justify-start">
                  {[
                    { value: "personal", label: "Personal", icon: <User size={20}/> },
                    { value: "billing", label: "Payments", icon: <CreditCard size={20}/> },
                    { value: "orders", label: "History", icon: <Package size={20}/> },
                    { value: "address", label: "Address", icon: <MapPin size={20}/> },
                    { value: "cart", label: "Cart", icon: <ShoppingCart size={20}/> },
                  ].map((tab) => (
                    <TabsTrigger 
                      key={tab.value}
                      value={tab.value} 
                      className="flex flex-col lg:flex-row w-auto lg:w-full justify-center lg:justify-start gap-1 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-xl font-bold text-[10px] lg:text-xs bg-transparent data-[state=active]:bg-primary/5 data-[state=active]:text-primary transition-all border-none shadow-none"
                    >
                      {tab.icon} 
                      <span className="hidden lg:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Logout */}
                <Button 
                  onClick={logout}
                  variant="ghost" 
                  className="lg:mt-8 w-auto lg:w-full justify-center lg:justify-start gap-3 px-4 py-3 text-red-500 font-bold text-xs hover:bg-red-50 hover:text-red-600 rounded-xl"
                >
                  <LogOut size={20} /> <span className="hidden lg:inline">Sign Out</span>
                </Button>
              </div>
            </aside>

            {/* --- RIGHT CONTENT AREA --- */}
            <main className="flex-1 w-full min-w-0">
              
              <TabsContent value="personal" className="mt-0 outline-none space-y-6">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-6">Personal details</h1>
                <form onSubmit={handleSubmit(d => updateMut.mutate(d))} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoBox label="Full Name">
                     <Input {...register("name")} className="border-none bg-transparent p-0 text-lg font-bold text-slate-800 focus-visible:ring-0 h-auto" />
                  </InfoBox>
                  <InfoBox label="Email ID" locked>
                     <Input value={profile?.email} disabled className="border-none bg-transparent p-0 text-lg font-bold text-slate-400 focus-visible:ring-0 h-auto" />
                  </InfoBox>
                  <InfoBox label="Country">
                     <Input {...register("address.country")} className="border-none bg-transparent p-0 text-lg font-bold text-slate-800 focus-visible:ring-0 h-auto" />
                  </InfoBox>
                  <InfoBox label="Role">
                     <p className="text-lg font-bold text-primary italic uppercase">{profile?.role}</p>
                  </InfoBox>
                  <div className="md:col-span-2 mt-4">
                    <Button disabled={updateMut.isPending} className="bg-primary hover:bg-purple-700 px-8 h-12 rounded-full font-black italic uppercase text-xs tracking-widest shadow-lg shadow-primary/20 transition-all">
                      <Save size={16} className="mr-2" /> {updateMut.isPending ? "Updating..." : "Update Info"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="billing" className="mt-0 outline-none space-y-6">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-6">Billing & Payments</h1>
                <div className="space-y-3">
                  {profile?.orders?.map((order: any) => (
                    <Card key={order.id} className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
                      <div className="p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                         <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-slate-50 text-primary rounded-xl border"><CreditCard size={18}/></div>
                            <div>
                               <p className="text-sm font-bold text-slate-800 tracking-tight">Ref: {order.paymentId || "ONLINE_PAYMENT"}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase">Paid on {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <p className="font-black italic text-slate-900">{formatINR(order.totalAmount)}</p>
                            <span className="text-[9px] font-black uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{order.paymentStatus}</span>
                         </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="orders" className="mt-0 outline-none">
                <OrderHistory />
              </TabsContent>

              <TabsContent value="address" className="mt-0 outline-none space-y-6">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-6">Delivery Address</h1>
                <form onSubmit={handleSubmit(d => updateMut.mutate(d))} className="max-w-xl">
                   <Card className="rounded-[2rem] border-slate-100 shadow-sm p-8 bg-white space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400">Street</label>
                        <Input {...register("address.street")} className="rounded-xl h-12 bg-slate-50 border-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">City</label>
                            <Input {...register("address.city")} className="rounded-xl h-12 bg-slate-50 border-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">State</label>
                            <Input {...register("address.state")} className="rounded-xl h-12 bg-slate-50 border-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">Zip</label>
                            <Input {...register("address.zip")} className="rounded-xl h-12 bg-slate-50 border-none" />
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-slate-900 rounded-full h-12 font-black italic uppercase text-xs tracking-widest mt-4">Save Address</Button>
                   </Card>
                </form>
              </TabsContent>

              <TabsContent value="cart" className="mt-0 outline-none">
                <CartPage />
              </TabsContent>

            </main>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

function InfoBox({ label, children, locked }: { label: string, children: React.ReactNode, locked?: boolean }) {
    return (
        <Card className={`rounded-2xl border-slate-100 shadow-sm ${locked ? 'bg-slate-50 opacity-70' : 'bg-white hover:shadow-md transition-all'}`}>
            <CardContent className="p-6 space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</label>
                    {locked ? <ShieldCheck size={12} className="text-green-500" /> : <Save size={12} className="text-primary/30" />}
                </div>
                {children}
            </CardContent>
        </Card>
    );
}