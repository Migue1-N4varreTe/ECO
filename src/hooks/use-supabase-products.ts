import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Product } from "@/lib/data";
import { supabase } from "@/services/api";

export function useSupabaseProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState("popular");
  const [priceFilter, setPriceFilter] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const sp = searchParams.get("search") || "";
    const cat = searchParams.get("category") || "";
    if (sp !== searchQuery) setSearchQuery(sp);
    if (cat !== selectedCategory) setSelectedCategory(cat);
  }, [searchParams]);

  const updateUrlParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v && v.trim()) newParams.set(k, v); else newParams.delete(k);
    });
    setSearchParams(newParams);
  };

  const updateSearchQuery = (q: string) => { setSearchQuery(q); updateUrlParams({ search: q }); };
  const updateCategory = (c: string) => { setSelectedCategory(c); updateUrlParams({ category: c }); };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!supabase) return;
      setLoading(true); setError(null);
      try {
        let query = (supabase as any)
          .from("products")
          .select("id,name,description,price,unit,stock_quantity,brand,barcode,image_url,category_id,categories(id,name)", { count: "exact" })
          .eq("is_active", true)
          .limit(1000);

        const q = searchQuery.trim();
        if (q) {
          const like = `%${q.replace(/%/g, "")}%`;
          query = query.or(`name.ilike.${like},description.ilike.${like},brand.ilike.${like}`);
        }
        if (selectedCategory) {
          // First try by category_id
          query = query.eq("category_id", selectedCategory);
        }
        if (priceFilter) {
          const [min, max] = priceFilter.split("-").map(Number);
          if (!isNaN(min)) query = query.gte("price", min);
          if (!isNaN(max)) query = query.lte("price", max);
        }
        switch (sortBy) {
          case "price-low": query = query.order("price", { ascending: true }); break;
          case "price-high": query = query.order("price", { ascending: false }); break;
          case "name": query = query.order("name", { ascending: true }); break;
          default: query = query.order("updated_at", { ascending: false });
        }

        const { data, error } = await query;
        if (error) throw error;
        if (!cancelled) setRows(data || []);
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Error al cargar productos");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [searchQuery, selectedCategory, sortBy, priceFilter]);

  const filteredProducts: Product[] = useMemo(() => {
    return rows.map((r) => ({
      id: String(r.id),
      name: r.name || "",
      price: Number(r.price) || 0,
      originalPrice: undefined,
      category: String(r.category_id || r.categories?.id || ""),
      subcategory: undefined,
      aisle: undefined,
      image: r.image_url || "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Producto",
      description: r.description || "",
      inStock: (r.stock_quantity ?? 0) > 0,
      stock: Number(r.stock_quantity ?? 0),
      brand: r.brand || undefined,
      tags: [],
      rating: 4.8,
      reviewCount: 12,
      isNew: false,
      isOffer: false,
      deliveryTime: "15-20 min",
      barcode: r.barcode || undefined,
      organic: false,
      unit: (r.unit as any) || "pieza",
      sellByWeight: String(r.unit).toLowerCase() === "kg",
    }));
  }, [rows]);

  const clearFilters = () => { setSearchQuery(""); setSelectedCategory(""); setPriceFilter(""); setSearchParams({}); };
  const activeFiltersCount = [searchQuery, selectedCategory, priceFilter].filter(Boolean).length;

  return {
    searchQuery,
    selectedCategory,
    sortBy,
    priceFilter,
    filteredProducts,
    activeFiltersCount,
    updateSearchQuery,
    updateCategory,
    setSortBy,
    setPriceFilter,
    clearFilters,
    hasActiveFilters: activeFiltersCount > 0,
    resultCount: filteredProducts.length,
    loading,
    error,
  };
}
