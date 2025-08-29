import { Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Gramaje() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Star className="h-12 w-12 text-yellow-400" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Sistema de gramaje</h1>
          <p className="text-gray-600 mb-6">
            No disponible actualmente. Estamos trabajando para habilitar el cálculo por peso y unidades fraccionadas.
          </p>
          <Button asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
