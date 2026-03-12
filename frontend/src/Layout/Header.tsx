import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  LayoutDashboard
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
import { useQuery } from '@tanstack/react-query';
import { fetchCartAPI } from '@/Cart/cart.apiService';

const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
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
      navigate('/login');
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Logout Loading Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 flex flex-col items-center gap-4 max-w-xs w-full">
            <div className="bg-purple-50 p-4 rounded-full">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-900 text-lg">Logging out...</p>
              <p className="text-slate-500 text-sm">Securing your session</p>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            <img src="/logo.png" alt="Vaniga Logo" className="w-9 h-9 object-contain" />
            <span className="text-2xl font-black text-primary tracking-tighter italic">
              VANIGA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors cursor-pointer">Home</Link>
            <Link to="/products" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors cursor-pointer">Shop</Link>
            {user?.role === 'SELLER' && (
              <Link to="/admin/dashboard" className="text-sm font-bold text-primary hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1">
                <LayoutDashboard className="w-4 h-4" />
                Seller Panel
              </Link>
            )}
          </nav>

          {/* Icons & Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <Link to="/cart" className="cursor-pointer">
              <Button variant="ghost" size="icon" className="relative hover:bg-purple-50 transition-colors">
                <ShoppingCart className="w-8 h-8 text-slate-700" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full border border-slate-200 hover:bg-purple-50 transition-all cursor-pointer">
                    <User className="w-5 h-5 text-slate-700" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 mt-2 shadow-xl border-slate-100 rounded-xl">
                  <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none text-slate-900">{user.name}</p>
                      <p className="text-xs leading-none text-slate-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-2 p-3 cursor-pointer rounded-lg hover:bg-purple-50 focus:bg-purple-50 focus:text-primary"
                  >
                    <UserCircle className="w-4 h-4" />
                    <span className="font-medium">View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 p-3 cursor-pointer rounded-lg text-red-500 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="cursor-pointer">
                <Button className="bg-primary hover:bg-purple-700 h-10 px-6 font-bold shadow-md shadow-purple-100">
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Icon */}
            <Button variant="ghost" size="icon" className="md:hidden cursor-pointer hover:bg-purple-50 text-slate-700">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;