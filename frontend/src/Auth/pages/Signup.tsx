import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { signupAPI } from "../auth.apiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Quote, Loader2 } from "lucide-react";

export default function Signup() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await signupAPI(data);
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans bg-white">
      {/* Left Side: Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-10">
          {/* Mobile Logo Branding */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <img src="/logo.png" alt="Vaniga" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold italic text-primary">Vaniga</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create account</h2>
            <p className="text-slate-500 text-base">Join Vaniga today and start managing your marketplace.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <Input 
                {...register("name", { required: "Name is required" })} 
                placeholder="John Doe" 
                disabled={isSubmitting}
                className="h-12 border-slate-200 focus:ring-primary focus:border-primary transition-all disabled:bg-slate-50 cursor-text"
              />
              {errors.name && <span className="text-xs text-red-500 font-medium">{errors.name.message as string}</span>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <Input 
                {...register("email", { required: "Email is required" })} 
                type="email" 
                placeholder="john@example.com" 
                disabled={isSubmitting}
                className="h-12 border-slate-200 focus:ring-primary focus:border-primary transition-all disabled:bg-slate-50 cursor-text"
              />
              {errors.email && <span className="text-xs text-red-500 font-medium">{errors.email.message as string}</span>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <Input 
                {...register("password", { 
                  required: "Password is required", 
                  minLength: { value: 6, message: "Minimum 6 characters" } 
                })} 
                type="password" 
                placeholder="••••••••" 
                disabled={isSubmitting}
                className="h-12 border-slate-200 focus:ring-primary focus:border-primary transition-all disabled:bg-slate-50 cursor-text"
              />
              {errors.password && <span className="text-xs text-red-500 font-medium">{errors.password.message as string}</span>}
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-purple-700 text-white font-bold transition-all h-12 text-base shadow-sm active:scale-[0.98] disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-slate-600">
            Already have an account? 
            <Link to="/login" className="text-primary font-bold ml-1 hover:underline underline-offset-4 cursor-pointer">
              Log in
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side: Professional Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative items-center justify-center p-16">
        {/* Subtle Static Pattern */}
        <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:30px_30px]"></div>
        
        {/* Background Depth Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white opacity-[0.03] rounded-full"></div>

        <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center">
            {/* Logo Image in Premium Static Container */}
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
          
          <div className="w-full space-y-8 text-left">
            <div className="relative">
              <Quote className="text-white/20 w-12 h-12 absolute -top-6 -left-6" />
              <p className="text-2xl font-medium text-purple-50 leading-relaxed italic relative z-10">
                "The best way to predict the future is to create it. Start your journey with us today."
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-white/30"></div>
              <p className="text-purple-200 text-sm font-semibold tracking-widest uppercase">
                Peter Drucker
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}