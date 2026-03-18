import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    title: "Elevate Your Style",
    desc: "Discover the new Summer Collection with up to 40% off.",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070",
    cta: "Shop Fashion",
    link: "/products?category=Fashion+Lifestyle"
  },
  {
    title: "Next-Gen Electronics",
    desc: "Premium gadgets for a premium lifestyle. Free shipping included.",
    img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070",
    cta: "Shop Now",
    link: "/products?category=Mobiles+%26+Tablets"
  }
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[400px] md:h-[600px] w-full overflow-hidden font-sans">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <img src={slide.img} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
          
          <div className="container mx-auto px-6 relative z-10 text-white space-y-4">
            <h1 className="text-4xl md:text-70xl font-black italic tracking-tighter uppercase leading-tight animate-in fade-in slide-in-from-left-5">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl font-light max-w-lg opacity-90">
              {slide.desc}
            </p>
            <Button
            onClick={() => navigate(slide.link)}
            className="bg-primary hover:bg-white hover:text-primary text-white font-bold px-8 h-12 transition-all rounded-none uppercase tracking-widest">
              {slide.cta}
            </Button>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button onClick={() => setCurrent(current === 0 ? slides.length - 1 : current - 1)} className="absolute left-4 top-1/2 z-20 bg-white/20 p-2 rounded-full text-white hover:bg-primary transition-colors">
        <ChevronLeft size={24} />
      </button>
      <button onClick={() => setCurrent((current + 1) % slides.length)} className="absolute right-4 top-1/2 z-20 bg-white/20 p-2 rounded-full text-white hover:bg-primary transition-colors">
        <ChevronRight size={24} />
      </button>
    </section>
  );
}