import React from "react";

import Navbar from "@/components/Navbar";
import EmptyState from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Reviews() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-2">Reseñas y Calificaciones</h1>
        <p className="text-gray-600 mb-6">Valora productos con un sistema de 1 a 5 estrellas.</p>
        <EmptyState
          icon={<span>⭐</span>}
          title="Aún no hay reseñas"
          description="Cuando califiques productos, tus reseñas aparecerán aquí."
          action={<Button asChild variant="outline"><Link to="/orders">Ver pedidos</Link></Button>}
          className="bg-white rounded-xl"
        />
      </main>
    </div>
  );
}
