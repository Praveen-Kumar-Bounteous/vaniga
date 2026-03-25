import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { logoutAPI } from '../Auth/auth.apiService';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart,
  User,
  LogOut,
  Menu,
  Loader2,
  UserCircle,
  LayoutDashboard,
  ChevronDown,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { useQuery } from '@tanstack/react-query';
import { fetchCartAPI } from '@/Cart/cart.apiService';

const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCartAPI,
  });

  const cartCount =
    cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) ?? 0;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAPI();
      logout();
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/products' },
    { name: 'Deals', path: '/products?category=Deals' },
  ];

  const promoText = "Free Delivery on orders above ₹2000 | Use FLAT200 for instant ₹200 OFF on All Orders";

  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 20s linear infinite;
        }
        @media (min-width: 768px) {
          .animate-marquee {
            animation: none;
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      {/* Logout Loading Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col items-center gap-4 max-w-xs w-full">
            <div className="bg-purple-50 p-4 rounded-full">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
            <div className="text-center">
              <p className="font-black italic uppercase text-slate-900 text-lg tracking-tighter">Securing Session</p>
              <p className="text-slate-400 text-xs font-bold uppercase mt-1">Please wait...</p>
            </div>
          </div>
        </div>
      )}

      {/* --- PROMOTIONAL ANNOUNCEMENT BAR (Marquee on Mobile) --- */}
      <div className="bg-slate-900 text-white py-2.5 overflow-hidden border-b border-white/10 relative">
        <div className="animate-marquee flex items-center gap-10 whitespace-nowrap">
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em] italic flex items-center gap-3">
            <Zap size={14} className="text-primary fill-primary shrink-0" />
            {promoText}
            <Zap size={14} className="text-primary fill-primary shrink-0 hidden md:block" />
          </p>
          {/* Duplicate for seamless loop on mobile */}
          <p className="text-[10px] md:hidden font-black uppercase tracking-[0.25em] italic flex items-center gap-3">
            <Zap size={14} className="text-primary fill-primary shrink-0" />
            {promoText}
          </p>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 font-sans">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center cursor-pointer group">
            <span className="text-2xl font-black text-primary tracking-tighter italic transition-all group-hover:scale-105 active:scale-95">
              VANIGA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative text-[11px] font-black uppercase tracking-[0.2em] transition-all group h-16 flex items-center
                  ${location.pathname === link.path ? 'text-primary' : 'text-slate-500 hover:text-primary'}
                `}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ease-out
                  ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}
                />
              </Link>
            ))}

            {user?.role === 'SELLER' && (
              <Link to="/admin/dashboard" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 flex items-center gap-2 border-l pl-8 border-slate-200 hover:text-primary transition-colors h-6">
                <LayoutDashboard size={14} className="text-primary" />
                Seller Panel
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="cursor-pointer relative hover:bg-primary/5 rounded-full w-10 h-10 transition-all">
                <ShoppingCart className="w-5 h-5 text-slate-700" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-black border-2 border-white shadow-lg animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 px-2 md:px-3 rounded-full border border-slate-100 hover:bg-slate-50 flex items-center gap-2 group transition-all">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <User size={14} />
                    </div>
                    <span className="cursor-pointer text-[10px] font-black uppercase tracking-widest text-slate-600 hidden lg:inline-block">Account</span>
                    <ChevronDown size={12} className="text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 p-2 mt-2 shadow-2xl rounded-2xl border-slate-100">
                  <DropdownMenuLabel className="p-3">
                    <p className="text-[9px] font-black uppercase text-primary tracking-widest mb-1">Signed In As</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer gap-2 p-3 rounded-xl hover:bg-primary/5 focus:bg-primary/5 transition-colors">
                    <UserCircle className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-xs uppercase tracking-widest text-slate-700">Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-2 p-3 rounded-xl text-red-500 hover:bg-red-50 font-bold transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button className="bg-slate-900 hover:bg-primary h-10 px-6 font-black italic uppercase text-xs tracking-widest rounded-full transition-all active:scale-95 shadow-lg shadow-slate-200">
                  Login
                </Button>
              </Link>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-purple-50 rounded-full w-10 h-10 border border-slate-100">
                  <Menu className="w-6 h-6 text-slate-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-white p-0 rounded-l-[2rem]">
                <div className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle >
                  <SheetDescription>Access home, shop, and account settings</SheetDescription>
                </div>
                <div className="flex flex-col h-full">
                  <div className="p-8 border-b">
                    <span className="text-2xl font-black italic tracking-tighter text-primary">VANIGA</span>
                  </div>
                  <nav className="flex flex-col p-6 gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        className={`p-4 text-xs font-black uppercase tracking-widest rounded-2xl flex justify-between items-center
                          ${location.pathname === link.path ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-slate-50 text-slate-600'}
                        `}
                      >
                        {link.name}
                        <ChevronRight size={14} className={location.pathname === link.path ? 'text-white' : 'text-slate-300'} />
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};

const ChevronRight = ({ className, size }: { className?: string, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
);

export default Header;