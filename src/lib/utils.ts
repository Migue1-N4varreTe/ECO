import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stableHash(input: string): number {
  let h = 0 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h >>> 0;
}

export function prettifyProductName(name: string, id: string, category?: string): string {
  if (!/\s\d+$/.test(name)) return name;
  const base = name.replace(/\s+\d+$/, "");

  const flavorMap: Record<string, string[]> = {
    congelados: [
      "Clásico",
      "Napolitano",
      "Chocolate",
      "Vainilla",
      "Fresa",
      "Mango",
      "Limón",
      "Capricho",
      "Cookies & Cream",
      "Caramelo",
    ],
    "lacteos-huevos": [
      "Entera",
      "Light",
      "Deslactosada",
      "Griego",
      "Natural",
      "Con fruta",
    ],
    default: [
      "Premium",
      "Selecto",
      "Del Campo",
      "Fresco",
      "Gourmet",
      "Tradicional",
      "Artesanal",
      "Especial",
      "Integral",
      "Orgánico",
    ],
  };

  const sizeMap: Record<string, string[]> = {
    congelados: ["Chico", "Mediano", "Grande"],
    default: ["250g", "500g", "1kg", "Pack"],
  };

  const key = `${id}-${name}-${category || ""}`;
  const h = stableHash(key);
  const flavors = flavorMap[category || ""] || flavorMap.default;
  const sizes = sizeMap[category || ""] || sizeMap.default;
  const flavor = flavors[h % flavors.length];
  const size = sizes[(Math.floor(h / 97) % sizes.length + sizes.length) % sizes.length];

  return `${base} ${flavor} ${size}`.replace(/\s+/g, " ").trim();
}
