import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PageLoader } from "@/components/LoadingSpinner";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { CartProvider } from "@/contexts/CartContext";
import { SafeWebSocketProvider } from "@/contexts/SafeWebSocketContext";
import PermissionGuard from "@/components/PermissionGuard";
import AccessDenied from "@/components/AccessDenied";

// Core pages (loaded immediately)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy loaded pages
const Favorites = lazy(() => import("./pages/Favorites"));
const Shop = lazy(() => import("./pages/Shop"));
const Categories = lazy(() => import("./pages/Categories"));
const Offers = lazy(() => import("./pages/Offers"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const Profile = lazy(() => import("./pages/Profile"));
const Orders = lazy(() => import("./pages/Orders"));
const Settings = lazy(() => import("./pages/Settings"));
const Help = lazy(() => import("./pages/Help"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NewProducts = lazy(() => import("./pages/NewProducts"));

// Admin pages (lazy loaded)
const Admin = lazy(() => import("./pages/Admin"));
const Inventory = lazy(() => import("./pages/Inventory"));
const POS = lazy(() => import("./pages/POS"));
const Reports = lazy(() => import("./pages/Reports"));
const Employees = lazy(() => import("./pages/Employees"));
const Clients = lazy(() => import("./pages/Clients"));
const SystemConfig = lazy(() => import("./pages/SystemConfig"));
const Deployment = lazy(() => import("./pages/Deployment"));

// User onboarding pages (lazy loaded)
const TutorialPrimerPedido = lazy(() => import("./pages/TutorialPrimerPedido"));
const GestionarPerfil = lazy(() => import("./pages/GestionarPerfil"));
const SeguimientoPedidos = lazy(() => import("./pages/SeguimientoPedidos"));
const ProgramaLealtad = lazy(() => import("./pages/ProgramaLealtad"));

// Extended feature pages (lazy loaded)
const ShoppingList = lazy(() => import("./pages/ShoppingList"));
const Addresses = lazy(() => import("./pages/Addresses"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Pickup = lazy(() => import("./pages/Pickup"));
const DeliveryManagement = lazy(() => import("./pages/DeliveryManagement"));
const DeliveryStaff = lazy(() => import("./pages/DeliveryStaff"));
const RecurringOrders = lazy(() => import("./pages/RecurringOrders"));
const Compare = lazy(() => import("./pages/Compare"));
const LiveTracking = lazy(() => import("./pages/LiveTracking"));
const DeliveryRoutes = lazy(() => import("./pages/DeliveryRoutes"));
const FlashSales = lazy(() => import("./pages/FlashSales"));
const Warehouse = lazy(() => import("./pages/Warehouse"));
const AdvancedReports = lazy(() => import("./pages/AdvancedReports"));
const Referrals = lazy(() => import("./pages/Referrals"));
const Premium = lazy(() => import("./pages/Premium"));
const ExecutiveDashboard = lazy(() => import("./pages/ExecutiveDashboard"));
const B2B = lazy(() => import("./pages/B2B"));
const Franchises = lazy(() => import("./pages/Franchises"));
const ARView = lazy(() => import("./pages/ARView"));
const Social = lazy(() => import("./pages/Social"));
const Assistant = lazy(() => import("./pages/Assistant"));
const Wallet = lazy(() => import("./pages/Wallet"));
const DynamicPricing = lazy(() => import("./pages/DynamicPricing"));
const EmailCampaigns = lazy(() => import("./pages/EmailCampaigns"));
const DroneDelivery = lazy(() => import("./pages/DroneDelivery"));

const Gramaje = lazy(() => import("./pages/Gramaje"));
const Tickets = lazy(() => import("./pages/Tickets"));
const Celebration = lazy(() => import("./pages/Celebration"));


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 2,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <SafeWebSocketProvider>
                <Sonner />
                <BrowserRouter>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/offers" element={<Offers />} />
                      <Route path="/new" element={<NewProducts />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                      />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/checkout/success" element={<CheckoutSuccess />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/help" element={<Help />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route
                        path="/tutorial-primer-pedido"
                        element={<TutorialPrimerPedido />}
                      />
                      <Route
                        path="/gestionar-perfil"
                        element={<GestionarPerfil />}
                      />
                      <Route
                        path="/seguimiento-pedidos"
                        element={<SeguimientoPedidos />}
                      />
                      <Route
                        path="/programa-lealtad"
                        element={<ProgramaLealtad />}
                      />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/pos" element={<POS />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/employees" element={<Employees />} />
                      <Route path="/clients" element={<Clients />} />
                      <Route path="/system-config" element={<SystemConfig />} />
                      <Route path="/deployment" element={<Deployment />} />
                      <Route path="/shopping-list" element={<ShoppingList />} />
                      <Route path="/addresses" element={<Addresses />} />
                      <Route path="/reviews" element={<Reviews />} />
                      <Route path="/pickup" element={<Pickup />} />
                      <Route path="/delivery-management" element={<DeliveryManagement />} />
                      <Route path="/delivery-staff" element={<DeliveryStaff />} />
                      <Route path="/recurring-orders" element={<RecurringOrders />} />
                      <Route path="/compare" element={<Compare />} />
                      <Route path="/live-tracking" element={<LiveTracking />} />
                      <Route path="/delivery-routes" element={<DeliveryRoutes />} />
                      <Route path="/flash-sales" element={<FlashSales />} />
                      <Route path="/warehouse" element={<Warehouse />} />
                      <Route path="/advanced-reports" element={<AdvancedReports />} />
                      <Route path="/referrals" element={<Referrals />} />
                      <Route path="/premium" element={<Premium />} />
                      <Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
                      <Route path="/b2b" element={<B2B />} />
                      <Route path="/franchises" element={<Franchises />} />
                      <Route path="/ar-view" element={<ARView />} />
                      <Route path="/social" element={<Social />} />
                      <Route path="/assistant" element={<Assistant />} />
                      <Route path="/wallet" element={<Wallet />} />
                      <Route path="/dynamic-pricing" element={<DynamicPricing />} />
                      <Route path="/email-campaigns" element={<EmailCampaigns />} />
                      <Route path="/drone-delivery" element={<DroneDelivery />} />

                      <Route path="/gramaje" element={<Gramaje />} />
                      <Route path="/tickets" element={<Tickets />} />
                      <Route path="/celebracion" element={<Celebration />} />


                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<CatchAll />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </SafeWebSocketProvider>
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
