import Carousel from "../Layout/Carousel";
import CategoryCard from "../Product/components/CategoryCard";
import { fetchCategoriesAPI } from "../Product/product.apiService";
import { Truck, ShieldCheck, RefreshCcw, Headset, ArrowRight, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategoriesAPI().then(res => res.data.data),
  });

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white gap-4">
      <img src="/logo.png" alt="Vaniga" className="w-16 h-16 animate-pulse" />
      <div className="h-1 w-24 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-progress origin-left w-full"></div>
      </div>
    </div>
  );

  return (
    <div className="font-sans space-y-24 pb-20 bg-white">
      <Carousel />

      {/* 1. Trust Badges - Enhanced Professional Version */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x border rounded-2xl border-slate-100 shadow-sm bg-white overflow-hidden">
          {[
            { icon: <Truck />, title: "Free Shipping", sub: "On orders over $2000" },
            { icon: <ShieldCheck />, title: "Secure Pay", sub: "100% encrypted" },
            { icon: <RefreshCcw />, title: "Easy Return", sub: "30 days policy" },
            { icon: <Headset />, title: "24/7 Help", sub: "Dedicated support" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-5 p-8 hover:bg-slate-50 transition-colors group cursor-default">
              <div className="p-3 rounded-2xl bg-purple-50 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                {item.icon}
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-tight italic">{item.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-tight">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Shop by Category */}
      <section className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
             <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
                <Star className="w-4 h-4 fill-current" />
                Featured Collections
             </div>
             <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-slate-900 uppercase leading-none">
                Shop By <span className="text-primary underline decoration-4 underline-offset-8">Category</span>
             </h2>
          </div>
          <p className="text-slate-500 font-medium max-w-xs md:text-right">Carefully curated selections designed for your lifestyle.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat: { name: string, image: string }) => (
            <CategoryCard key={cat.name} name={cat.name} image={cat.image} />
          ))}
        </div>
      </section>

      {/* 3. Promotional Banner - High Contrast Professional Version */}
      <section className="container mx-auto px-6">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-primary px-8 py-16 md:px-20 md:py-24 text-white shadow-2xl shadow-purple-200 border-b-8 border-purple-800">
          {/* Static Decorative Elements */}
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-black opacity-[0.05] rounded-full" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-3xl text-center md:text-left space-y-8">
              <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85]">
                Upgrade your <br /> 
                <span className="text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.2)]">Wardrobe</span>
              </h2>
              <p className="text-lg md:text-xl font-medium text-purple-100 max-w-lg leading-relaxed">
                Our season finale is here. Discover premium brands with exclusive prices you won't find anywhere else.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Link to="/products">
                  <Button className="bg-white text-primary hover:bg-slate-900 hover:text-white px-12 h-16 text-lg font-black italic uppercase rounded-full transition-all shadow-xl hover:shadow-2xl">
                    Shop Now 
                    <ArrowRight className="ml-2 w-6 h-6" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Premium Price Badge */}
            <div className="flex flex-col items-center justify-center p-1 relative">
                <div className="bg-white text-primary h-48 w-48 rounded-full flex flex-col items-center justify-center rotate-12 shadow-2xl border-[12px] border-white/20">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Up to</span>
                    <span className="text-7xl font-black tracking-tighter leading-none">70</span>
                    <div className="flex items-center">
                        <span className="text-2xl font-black">%</span>
                        <span className="text-sm font-bold uppercase ml-1">Off</span>
                    </div>
                </div>
                {/* Accent line */}
                <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-[10px] px-4 py-1 rounded-full font-bold uppercase tracking-widest -rotate-12">
                    Limited Time
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}