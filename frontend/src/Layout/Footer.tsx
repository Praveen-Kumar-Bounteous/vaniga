import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard,
  LockKeyhole, 
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t font-sans">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link to="/" className="text-3xl font-black text-primary tracking-tighter italic">
              VANIGA
            </Link>
            <p className="text-slate-500 leading-relaxed text-sm">
              The ultimate destination for premium shopping. Experience the best quality and seamless delivery across the globe.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <Facebook className="w-5 h-5 hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 hover:text-primary cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products" className="text-slate-500 hover:text-primary transition-colors">Shop All Products</Link></li>
              <li><Link to="/featured" className="text-slate-500 hover:text-primary transition-colors">Featured Collections</Link></li>
              <li><Link to="/new-arrivals" className="text-slate-500 hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link to="/offers" className="text-slate-500 hover:text-primary transition-colors">Special Offers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Customer Service</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/faq" className="text-slate-500 hover:text-primary transition-colors">Help Center / FAQ</Link></li>
              <li><Link to="/returns" className="text-slate-500 hover:text-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/shipping" className="text-slate-500 hover:text-primary transition-colors">Shipping Information</Link></li>
              <li><Link to="/terms" className="text-slate-500 hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-slate-500">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Gloabal Infocity, Tech Park, <br/> Chennai, India</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+91 91235 63252</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>support@vaniga.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t bg-slate-50/50 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} <span className="text-primary font-bold">VANIGA</span>. Developed by Intern Team.
          </p>
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Secure Payments</span>
            <div className="flex gap-2">
              <LockKeyhole className="w-8 h-8 text-slate-400 border rounded p-1 bg-white" /> {/* Placeholder for Visa Logo */}
              <CreditCard className="w-8 h-8 text-slate-400 border rounded p-1 bg-white" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;