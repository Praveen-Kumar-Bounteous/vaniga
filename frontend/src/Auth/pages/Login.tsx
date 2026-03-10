import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { loginAPI } from "../auth.apiService";
import { useAuthStore } from "../../store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Quote, Loader2 } from "lucide-react";
import logo from "../../../public/logo.png";

export default function Login() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      const response = await loginAPI(data);
      setUser(response.data.data);
      toast.success(`Welcome back, ${response.data.data.name}!`);
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-10">
          {/* Logo for Mobile/Tablet */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <img src={logo} alt="Vaniga" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold italic text-primary">Vaniga</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Sign in</h2>
            <p className="text-slate-500 text-base">Enter your email and password</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <Input 
                {...register("email")} 
                type="email" 
                placeholder="name@company.com" 
                required 
                disabled={isSubmitting}
                className="h-12 border-slate-200 focus:ring-primary focus:border-primary transition-all disabled:bg-slate-50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link to="#" className="text-sm font-medium text-primary hover:text-purple-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input 
                {...register("password")} 
                type="password" 
                placeholder="••••••••" 
                required 
                disabled={isSubmitting}
                className="h-12 border-slate-200 focus:ring-primary focus:border-primary transition-all disabled:bg-slate-50"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="cursor-pointer w-full bg-primary hover:bg-purple-700 text-white font-bold transition-all h-12 text-base shadow-sm active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-slate-600">
            Don't have an account? 
            <Link to="/signup" className="text-primary font-bold ml-1 hover:underline underline-offset-4">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side: Professional Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative items-center justify-center p-16">
        {/* Subtle Background Pattern (Minimalist Dots) */}
        <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:30px_30px]"></div>
        
        {/* Static decorative circle for depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white opacity-[0.03] rounded-full"></div>

        <div className="relative z-10 max-w-lg w-full flex flex-col items-center">
            {/* Logo in Static Premium Container */}
            <div className="mb-10 bg-white p-6 rounded-2xl border border-white/10 shadow-2xl">
                <img 
                  src="/logo.png" 
                  alt="Vaniga Logo" 
                  className="w-20 h-20 object-contain" 
                />
            </div>
          
          <h1 className="text-5xl font-extrabold italic text-white mb-8 tracking-tighter">
            Vaniga
          </h1>
          
          <div className="w-full space-y-8">
            <div className="relative">
              <Quote className="text-white/20 w-12 h-12 absolute -top-6 -left-6" />
              <p className="text-2xl font-medium text-purple-50 leading-relaxed italic relative z-10">
                "The secret of business is to know something that nobody else knows."
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-white/30"></div>
              <p className="text-purple-200 text-sm font-semibold tracking-widest uppercase">
                Aristotle Onassis
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}