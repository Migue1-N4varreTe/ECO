import { Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Celebration() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Star className="h-16 w-16 text-yellow-400 animate-pulse" />
          </div>
          <h1 className="font-display text-4xl font-bold mb-3">¡Celebración!</h1>
          <p className="text-gray-600 mb-6">
            Página de estrella de celebración para anuncios y logros especiales.
          </p>
          <Button asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
