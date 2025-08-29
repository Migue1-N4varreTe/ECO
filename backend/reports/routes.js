import express from "express";
import { authenticateToken, requirePermission } from "../auth/middleware.js";
import { PERMISSIONS } from "../users/roles.js";

const router = express.Router();

// Sales reports
router.get(
  "/sales",
  authenticateToken,
  requirePermission(PERMISSIONS.REPORTS.VIEW_SALES),
  async (req, res) => {
    try {
      const { range = "daily", from_date, to_date } = req.query;
      const { supabase } = await import("../config/supabase.js");

      let q = supabase.from("orders").select("id, total_amount, payment_method, created_at").eq("status", "completed");
      if (from_date) q = q.gte("created_at", from_date);
      if (to_date) q = q.lte("created_at", to_date);

      const { data: orders, error } = await q;
      if (error) return res.status(500).json({ error: error.message });

      const totalSales = orders.length;
      const totalRevenue = orders.reduce((s, o) => s + Number(o.total_amount || 0), 0);
      const avgTicket = totalSales ? totalRevenue / totalSales : 0;

      const byMethod = orders.reduce((acc, o) => {
        acc[o.payment_method] = (acc[o.payment_method] || 0) + 1;
        return acc;
      }, {});

      const byPeriod = {};
      for (const o of orders) {
        const d = new Date(o.created_at);
        const key = range === "hourly" ? d.toISOString().slice(0, 13) : d.toISOString().slice(0, 10);
        byPeriod[key] = (byPeriod[key] || 0) + Number(o.total_amount || 0);
      }

      res.json({
        period: { from: from_date, to: to_date, range },
        metrics: { total_sales: totalSales, total_revenue: totalRevenue, average_ticket: avgTicket },
        breakdown: { payment_methods: byMethod, by_period: byPeriod },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Top products
router.get(
  "/products/top",
  authenticateToken,
  requirePermission(PERMISSIONS.REPORTS.VIEW_INVENTORY),
  async (req, res) => {
    try {
      res.json({ message: "Top products report coming soon" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Employee performance
router.get(
  "/employees",
  authenticateToken,
  requirePermission(PERMISSIONS.REPORTS.VIEW_EMPLOYEES),
  async (req, res) => {
    try {
      res.json({ message: "Employee reports coming soon" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Client reports
router.get(
  "/clients",
  authenticateToken,
  requirePermission(PERMISSIONS.CUSTOMERS.VIEW_DETAILED),
  async (req, res) => {
    try {
      res.json({ message: "Client reports coming soon" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

export default router;
