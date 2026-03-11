import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { fetchProductsAPI, fetchCategoriesAPI } from "../product.apiService";
import ProductCard from "../components/ProductCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Loader2, Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import PLPSkeleton from "../components/PLPSkeleton";

export default function PLP() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const { ref, inView } = useInView();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategoriesAPI().then(res => res.data.data),
    staleTime: 1000 * 60 * 60,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["products", category, debouncedSearch],
    queryFn: ({ pageParam = 0 }) => fetchProductsAPI({
      category,
      pageParam,
      search: debouncedSearch,
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => lastPage.length === 8 ? allPages.length * 8 : undefined,

    // --- STAGE 2 PERFORMANCE FIXES ---
    staleTime: 1000 * 60 * 5,    // Data is fresh for 5 mins
    gcTime: 1000 * 60 * 30,       // Keep in cache for 30 mins
    refetchOnWindowFocus: false, // STOP API calls when clicking back on the window
    refetchOnMount: false,       // Don't re-fetch if data is already in cache when component mounts
  });

  useEffect(() => { if (inView && hasNextPage) fetchNextPage(); }, [inView, hasNextPage, fetchNextPage]);


  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Breadcrumb - Mobile Responsive Padding */}
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 border-b border-slate-50">
        <Breadcrumb className="mb-2">
          <BreadcrumbList className="flex-wrap">
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="font-bold text-primary italic uppercase tracking-tighter truncate max-w-[150px]">
              {category === "all" ? "All Products" : category}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Sticky Header - Mobile Optimization */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 md:px-6 py-4 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar - Full width on mobile */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search premium items..."
                className="pl-10 border-primary/20 focus-visible:ring-primary rounded-full w-full"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Tabs - Horizontal Scroll on mobile */}
            <Tabs
              value={category}
              onValueChange={(v) => setSearchParams({ category: v })}
              className="w-full lg:w-auto"
            >
              <TabsList className="bg-slate-100 p-1 rounded-full w-full lg:w-auto flex overflow-x-auto no-scrollbar justify-start lg:justify-center">
                <TabsTrigger value="all" className="rounded-full px-4 md:px-6 uppercase text-[10px] font-black italic shrink-0">
                  All
                </TabsTrigger>
                {categories?.map((cat: any) => (
                  <TabsTrigger
                    key={cat.name}
                    value={cat.name}
                    className="rounded-full px-4 md:px-6 uppercase text-[10px] font-black italic shrink-0"
                  >
                    {cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Product Grid - Responsive Columns */}
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <PLPSkeleton key={i} />
            ))
          ) : (
            data?.pages.map((group, i) => (
              <div key={i} className="contents">
                {group.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ))
          )}
        </div>

        {/* Scroll Trigger */}
        <div ref={ref} className="mt-10 md:mt-20 flex justify-center py-10">
          {isFetchingNextPage ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          ) : !hasNextPage && (
            <p className="text-slate-400 font-bold italic uppercase text-[10px] tracking-[0.3em] text-center">
              The End of Vaniga Catalog
            </p>
          )}
        </div>
      </div>
    </div>
  );
}