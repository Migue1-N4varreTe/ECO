import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/api";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  level: number;
  store_id?: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  name?: string;
  phone?: string;
  address?: any;
  birthday?: string;
}

interface RegisterInput {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string | string[]) => boolean;
  hasLevel: (minLevel: number) => boolean;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_PERMISSIONS = {
  LEVEL_5_DEVELOPER: ["*"],
  LEVEL_4_OWNER: [
    "sales:create",
    "sales:create_order",
    "sales:process_payment",
    "sales:apply_discount",
    "sales:handle_return",
    "sales:view_sales",
    "inventory:view",
    "inventory:add_item",
    "inventory:update_item",
    "inventory:delete_item",
    "inventory:manage_suppliers",
    "inventory:view_low_stock",
    "reports:view",
    "reports:view_sales",
    "reports:view_financial",
    "reports:view_inventory",
    "reports:view_employees",
    "reports:export_data",
    "staff:view",
    "staff:create",
    "staff:update",
    "staff:delete",
    "staff:manage_roles",
    "staff:view_attendance",
    "business:manage_pricing",
    "business:manage_stores",
    "business:manage_policies",
    "business:view_analytics",
    "clients:view",
    "customers:view_basic",
    "customers:view_detailed",
    "customers:manage_loyalty",
    "customers:handle_complaints",
    "system:config",
    "system:deploy",
  ],
  LEVEL_3_MANAGER: [
    "sales:create",
    "sales:create_order",
    "sales:process_payment",
    "sales:apply_discount",
    "sales:handle_return",
    "sales:view_sales",
    "inventory:view",
    "inventory:add_item",
    "inventory:update_item",
    "inventory:view_low_stock",
    "reports:view",
    "reports:view_sales",
    "reports:view_inventory",
    "reports:view_employees",
    "staff:view",
    "staff:update",
    "staff:view_attendance",
    "clients:view",
    "customers:view_basic",
    "customers:view_detailed",
    "customers:handle_complaints",
  ],
  LEVEL_2_SUPERVISOR: [
    "sales:create",
    "sales:create_order",
    "sales:process_payment",
    "sales:view_sales",
    "inventory:view",
    "inventory:view_low_stock",
    "reports:view",
    "reports:view_sales",
    "staff:view",
    "staff:view_attendance",
    "clients:view",
    "customers:view_basic",
    "customers:handle_complaints",
  ],
  LEVEL_1_CASHIER: [
    "sales:create",
    "sales:create_order",
    "sales:process_payment",
    "inventory:view",
    "customers:view_basic",
  ],
} as const;

function mapSupabaseUser(u: any | null): User | null {
  if (!u) return null;
  const meta = (u.user_metadata || {}) as Record<string, any>;
  const fullName = meta.name || `${meta.first_name || ""} ${meta.last_name || ""}`.trim();
  const [first, ...rest] = (meta.first_name ? [meta.first_name, meta.last_name] : fullName.split(" ")).filter(Boolean);
  const last = meta.last_name ?? (rest || []).join(" ");
  return {
    id: u.id,
    email: u.email || "",
    first_name: first || "",
    last_name: last || "",
    role: meta.role || "LEVEL_1_CASHIER",
    level: Number(meta.level ?? 1),
    is_active: meta.is_active ?? true,
    created_at: u.created_at || new Date().toISOString(),
    last_login_at: undefined,
    name: fullName || undefined,
    phone: meta.phone,
    address: meta.address,
    birthday: meta.birthday,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login: AuthContextType["login"] = async (email, password) => {
    if (!supabase) return { success: false, error: "Supabase no está inicializado" };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    setUser(mapSupabaseUser(data.user));
    return { success: true };
  };

  const register: AuthContextType["register"] = async (userData) => {
    if (!supabase) return { success: false, error: "Supabase no está inicializado" };
    const role = userData.role || "LEVEL_1_CASHIER";
    const level = role === "LEVEL_4_OWNER" ? 4 : role === "LEVEL_3_MANAGER" ? 3 : role === "LEVEL_2_SUPERVISOR" ? 2 : 1;
    const first = userData.first_name || userData.name?.split(" ")[0] || "";
    const last = userData.last_name || userData.name?.split(" ").slice(1).join(" ") || "";

    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name ?? `${first} ${last}`.trim(),
          first_name: first,
          last_name: last,
          phone: userData.phone,
          role,
          level,
          is_active: true,
        },
      },
    });

    if (error) return { success: false, error: error.message };
    setUser(mapSupabaseUser(data.user));
    return { success: true };
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  };

  const refreshUser = async () => {
    if (!supabase) return;
    const { data } = await supabase.auth.getUser();
    setUser(mapSupabaseUser(data.user));
  };

  const updateProfile: AuthContextType["updateProfile"] = async (data) => {
    if (!supabase) return { success: false, error: "Supabase no está inicializado" };
    const metadata: Record<string, any> = { ...data };
    if (data.first_name || data.last_name) {
      metadata.name = `${data.first_name ?? user?.first_name ?? ""} ${data.last_name ?? user?.last_name ?? ""}`.trim();
    }
    const { error } = await supabase.auth.updateUser({ data: metadata });
    if (error) return { success: false, error: error.message };
    await refreshUser();
    return { success: true };
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const userPermissions = (ROLE_PERMISSIONS as any)[user.role];
    if (!userPermissions) return false;
    if (userPermissions.includes("*")) return true;
    return userPermissions.includes(permission);
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  };

  const hasLevel = (minLevel: number): boolean => {
    if (!user) return false;
    return user.level >= minLevel;
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      await refreshUser();
      if (!mounted) return;
      setLoading(false);
    })();

    const { data: sub } = supabase?.auth.onAuthStateChange(async () => {
      await refreshUser();
    }) || { data: { subscription: { unsubscribe: () => {} } } } as any;

    return () => {
      mounted = false;
      (sub as any)?.subscription?.unsubscribe?.();
    };
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    hasPermission,
    hasRole,
    hasLevel,
    refreshUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
