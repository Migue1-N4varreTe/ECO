import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Receipt, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface LocalReceipt {
  id: string;
  date: string;
  items: ReceiptItem[];
  subtotal: number;
  delivery: number;
  fees: number;
  total: number;
  payment_method: string;
  customer?: { name?: string; email?: string };
}

const CheckoutSuccess = () => {
  const [receipt, setReceipt] = useState<LocalReceipt | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("last_order_receipt");
    if (raw) {
      try {
        setReceipt(JSON.parse(raw));
      } catch {}
    }
  }, []);

  if (!receipt) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container px-4 py-16 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900 mb-2">
            ¡Pago procesado!
          </h1>
          <p className="text-gray-600 mb-6">Tu pedido ha sido confirmado.</p>
          <Button asChild>
            <Link to="/orders">Ver mis pedidos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h1 className="font-display font-bold text-3xl text-gray-900">
              ¡Gracias por tu compra!
            </h1>
            <p className="text-gray-600 mt-1">Pedido #{receipt.id} • {new Date(receipt.date).toLocaleString()}</p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-brand-600" />
                <span className="font-medium">Detalle del ticket</span>
              </div>

              <Separator />

              <div className="space-y-3">
                {receipt.items.map((item) => {
                  const displayName = prettifyProductName(item.name, item.id, item.category);
                  const src = (item.image && item.image.includes("placeholder"))
                    ? `https://via.placeholder.com/96x96/f3f4f6/9ca3af?text=${encodeURIComponent(displayName)}`
                    : item.image;
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={src} alt={displayName} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{displayName}</p>
                        <p className="text-xs text-gray-600">{item.quantity} x ${item.price.toFixed(2)}</p>
                      </div>
                      <div className="text-sm font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>${receipt.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Envío</span><span>{receipt.delivery === 0 ? "Gratis" : `$${receipt.delivery.toFixed(2)}`}</span></div>
                {receipt.fees > 0 && (
                  <div className="flex justify-between"><span>Comisión de pago</span><span>${receipt.fees.toFixed(2)}</span></div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold"><span>Total</span><span>${receipt.total.toFixed(2)}</span></div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button asChild className="flex-1">
                  <Link to="/shop">Seguir comprando</Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <a href="#" onClick={() => window.print()}>
                    Imprimir ticket
                  </a>
                </Button>
              </div>

              <div className="text-right text-xs text-gray-500 pt-2">
                Método de pago: {receipt.payment_method.toUpperCase()}
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Button asChild variant="ghost">
              <Link to="/orders" className="inline-flex items-center">Ir a mis pedidos <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
