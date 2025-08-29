import { Receipt, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Tickets() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Receipt className="h-10 w-10 text-gray-500" />
            <Star className="h-8 w-8 text-yellow-400" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Sistema de tickets</h1>
          <p className="text-gray-600 mb-6">
            No disponible por el momento. Pronto podrás generar y consultar tickets y comprobantes.
          </p>
          <Button asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
