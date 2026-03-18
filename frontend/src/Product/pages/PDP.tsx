import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // Added useState and useEffect
import { useQuery } from "@tanstack/react-query";
import { fetchProductDetailsAPI } from "../product.apiService";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Loader2, ShoppingCart, Zap, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCartAPI } from "../../Cart/cart.apiService";
import { toast } from "sonner";

export default function PDP() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mainImage, setMainImage] = useState<string>(""); // State for image swap

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductDetailsAPI(id!),
    staleTime: 1000 * 60 * 10,
  });

  // Sync main image when data loads or product ID changes
  useEffect(() => {
    if (data?.product?.images?.length > 0) {
      setMainImage(data.product.images[0]);
    }
  }, [data, id]);

    const cartMutation = useMutation({
    mutationFn: () => addToCartAPI(id!, 1),
    onSuccess: () => {
      toast.success("Added to cart successfully!");
      queryClient.invalidateQueries({ queryKey: ["cart"] }); // Update header count
    },
    onError: () => toast.error("Failed to add to cart. Please login."),
  });

  const handleBuyNow = () => {
    navigate(`/checkout?productId=${id}`);
  };


  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;
  if (error || !data) return <div className="p-20 text-center font-black italic text-red-500">PRODUCT NOT FOUND</div>;

  const { product, related } = data;
  const formatINR = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  const oldPrice = product.price + (product.price * 0.25);


  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      {/* 1. Breadcrumbs */}
      <div className="container mx-auto px-4 md:px-6 py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink asChild><Link to={`/products?category=${product.category}`}>{product.category}</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="font-bold text-primary italic uppercase truncate max-w-[200px]">{product.name}</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* 2. Left: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-100">
              <img
                src={mainImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img: string, i: number) => (
                <div
                  key={i}
                  onClick={() => setMainImage(img)} // Click to reflect in main image
                  className={`aspect-square rounded-xl overflow-hidden border bg-slate-50 cursor-pointer transition-all ${mainImage === img ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* 3. Right: Product Info */}
          <div className="flex flex-col space-y-8 sticky top-24 h-fit">
            <div className="space-y-2">
              {/* Category Tag removed from here as requested */}
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-slate-900 uppercase leading-[0.9]">
                {product.name}
              </h1>
              <p className="text-slate-400 text-sm font-medium">Sold by: <span className="text-slate-900 font-bold underline">{product.seller?.name}</span></p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black italic text-primary tracking-tighter">{formatINR(product.price)}</span>
                <span className="text-xl text-slate-400 line-through font-bold italic">{formatINR(oldPrice)}</span>
              </div>
              <p className="text-green-600 font-bold text-sm italic animate-pulse">Save 25% OFF - Limited Time Deal!</p>
            </div>

            <p className="text-slate-600 leading-relaxed text-sm">
              {product.description}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={() => cartMutation.mutate()}
                disabled={cartMutation.isPending}
                className="cursor-pointer flex-1 bg-primary hover:bg-purple-700 h-14 text-lg font-black italic uppercase rounded-2xl shadow-xl shadow-primary/20"
              >
                {cartMutation.isPending ? <Loader2 className="animate-spin" /> : <><ShoppingCart className="mr-2 w-5 h-5" /> Add to Cart</>}
              </Button>

              <Button
                onClick={handleBuyNow}
                variant="outline"
                className="cursor-pointer flex-1 border-primary text-primary hover:bg-primary hover:text-white h-14 text-lg font-black italic uppercase rounded-2xl"
              >
                <Zap className="mr-2 w-5 h-5" /> Buy Now
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-100">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="text-primary w-5 h-5" />
                <span className="text-[10px] font-bold uppercase text-slate-500">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="text-primary w-5 h-5" />
                <span className="text-[10px] font-bold uppercase text-slate-500">Secure Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw className="text-primary w-5 h-5" />
                <span className="text-[10px] font-bold uppercase text-slate-500">7 Days Return</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Related Products Section */}
        {related.length > 0 && (
          <div className="mt-32 space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">
                You May Also <span className="text-primary">Like</span>
              </h2>
              <Link to={`/products?category=${product.category}`} className="text-primary font-bold italic uppercase text-xs hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {related.map((item: any) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}