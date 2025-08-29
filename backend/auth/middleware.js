import { verifyToken } from "../utils/jwt.js";
import { supabase, supabaseAdmin } from "../config/supabase.js";
import { hasPermission } from "../users/permissions.js";
import { ROLES } from "../users/roles.js";

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token de acceso requerido" });
  }

  try {
    // 1) Try app JWT first
    try {
      const decoded = verifyToken(token);

      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", decoded.userId)
        .single();

      if (error || !user) {
        return res.status(401).json({ error: "Usuario no válido" });
      }

      if (user.is_active === false) {
        return res.status(401).json({ error: "Usuario desactivado" });
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        level: user.level,
        store_id: user.store_id,
      };

      return next();
    } catch (jwtErr) {
      // 2) Fallback: accept Supabase access tokens
      if (!supabaseAdmin) {
        return res.status(403).json({ error: "Token inválido" });
      }

      const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
      if (authError || !authData?.user) {
        return res.status(403).json({ error: "Token inválido" });
      }

      const su = authData.user;
      const meta = (su.user_metadata || {});

      // Prefer local users table if present (for store/ACL linkage)
      let role = meta.role || ROLES.CASHIER;
      let level = Number(meta.level ?? 1);
      let store_id = meta.store_id || null;

      if (supabase) {
        const { data: dbUser } = await supabase
          .from("users")
          .select("id,email,role,level,store_id,is_active")
          .eq("email", (su.email || "").toLowerCase())
          .single();

        if (dbUser) {
          if (dbUser.is_active === false) {
            return res.status(401).json({ error: "Usuario desactivado" });
          }
          role = dbUser.role || role;
          level = typeof dbUser.level === 'number' ? dbUser.level : level;
          store_id = dbUser.store_id ?? store_id;
        }
      }

      req.user = {
        id: su.id,
        email: su.email || "",
        role,
        level,
        store_id,
      };

      return next();
    }
  } catch (error) {
    return res.status(403).json({ error: "Token inválido" });
  }
};

const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({
        error: "No tienes permiso para realizar esta acción",
        required_permission: permission,
      });
    }

    next();
  };
};

const requireRole = (roles) => {
  const roleArray = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!roleArray.includes(req.user.role)) {
      return res.status(403).json({
        error: "No tienes el rol necesario para esta acción",
        required_roles: roleArray,
      });
    }

    next();
  };
};

const requireLevel = (minLevel) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (req.user.level < minLevel) {
      return res.status(403).json({
        error: "Nivel de acceso insuficiente",
        required_level: minLevel,
        user_level: req.user.level,
      });
    }

    next();
  };
};

export { authenticateToken, requirePermission, requireRole, requireLevel };
