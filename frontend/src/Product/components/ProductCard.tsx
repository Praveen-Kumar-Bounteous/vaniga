import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCartAPI } from "../../Cart/cart.apiService";
import { toast } from "sonner";

export default function ProductCard({ product }: { product: any }) {
  const queryClient = useQueryClient();

  // Indian Price Formatter
  const formatINR = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const oldPrice = product.price + product.price * 0.2;

  // ✅ Add to Cart Mutation
  const cartMutation = useMutation({
    mutationFn: () => addToCartAPI(product.id, 1),
    onSuccess: () => {
      toast.success("Added to cart!");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast.error("Please login to add items.");
    },
  });

  return (
    <div className="group bg-white border border-slate-100 rounded-2xl overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2">
      
      {/* ✅ Clickable Area */}
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative h-64 overflow-hidden bg-slate-50">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        <div className="p-5 space-y-3">
          <div>
            <h3 className="text-md font-bold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-slate-500 text-xs mt-1 line-clamp-2 h-8">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-black italic text-primary tracking-tighter">
                {formatINR(product.price)}
              </span>
              <span className="text-[10px] text-slate-400 line-through font-bold">
                {formatINR(oldPrice)}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* ✅ Buttons Section */}
      <div className="flex gap-2 p-5 pt-0 justify-end">
        <Link to={`/products/${product.id}`}>
          <Button
            size="icon"
            variant="outline"
            className="cursor-pointer rounded-full w-8 h-8 hover:bg-primary hover:text-white transition-all"
          >
            <Eye size={14} />
          </Button>
        </Link>

        <Button
          size="icon"
          onClick={(e) => {
            e.stopPropagation(); // prevent navigation
            cartMutation.mutate();
          }}
          disabled={cartMutation.isPending}
          className="cursor-pointer bg-primary w-8 h-8 rounded-full hover:bg-purple-700 shadow-lg shadow-primary/20"
        >
          <ShoppingCart size={14} />
        </Button>
      </div>
    </div>
  );
}