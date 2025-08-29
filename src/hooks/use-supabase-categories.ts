import { useEffect, useMemo, useState } from "react";
import type { Category } from "@/lib/data";
import { supabase } from "@/services/api";

export function useSupabaseCategories() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!supabase) return;
      setLoading(true); setError(null);
      try {
        const { data, error } = await (supabase as any)
          .from("categories")
          .select("id,name,color,aisle,description,image,icon,product_count")
          .order("aisle", { ascending: true });
        if (error) throw error;
        const results: Category[] = (data || []).map((r: any) => ({
          id: String(r.id),
          name: r.name || "",
          image: r.image || "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Categor%C3%ADa",
          icon: r.icon || "🛒",
          color: r.color || "bg-brand-500",
          productCount: Number(r.product_count ?? 0),
          aisle: Number(r.aisle ?? 0),
          description: r.description || "",
          subcategories: [],
        }));
        if (!cancelled) setItems(results);
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Error al cargar categorías");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const totals = useMemo(() => {
    const totalProducts = items.reduce((sum, c) => sum + (c.productCount || 0), 0);
    return { totalProducts, categories: items.length };
  }, [items]);

  return { items, loading, error, totals };
}
