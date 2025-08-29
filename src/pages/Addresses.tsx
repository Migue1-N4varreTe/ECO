import React from "react";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { Link } from "react-router-dom";

export default function Addresses() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-2">Direcciones</h1>
        <p className="text-gray-600 mb-6">Gestiona múltiples direcciones de entrega.</p>
        <EmptyState
          icon={<span>📍</span>}
          title="Aún no tienes direcciones"
          description="Agrega una dirección para agilizar tus compras y entregas."
          action={<Button asChild><Link to="/profile">Agregar dirección</Link></Button>}
          className="bg-white rounded-xl"
        />
      </main>
    </div>
  );
}
