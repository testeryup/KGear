import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Layouts
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Buyer Pages
import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { ProductDetailsPage } from '@/pages/ProductDetailsPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrderConfirmationPage } from '@/pages/OrderConfirmationPage';
import { MyOrdersPage } from '@/pages/MyOrdersPage';
import { LoginPage } from '@/pages/LoginPage';

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { ProductsManager } from '@/pages/admin/ProductsManager';
import { OrdersManager } from '@/pages/admin/OrdersManager';
import { CouponManager } from '@/pages/admin/CouponManager';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Buyer Routes - Public */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="my-orders" element={<MyOrdersPage />} />
          {/* Placeholder routes */}
          <Route path="categories" element={<ShopPage />} />
          <Route path="about" element={<div className="container mx-auto px-4 py-16 text-center"><h1 className="text-3xl font-bold">About KGear</h1><p className="mt-4 text-muted-foreground">Premium mechanical keyboards and accessories for enthusiasts.</p></div>} />
        </Route>

        {/* Login - Outside MainLayout for clean design */}
        <Route path="login" element={<LoginPage />} />

        {/* Admin Routes - Protected */}
        <Route
          path="admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductsManager />} />
          <Route path="orders" element={<OrdersManager />} />
          <Route path="coupons" element={<CouponManager />} />
          <Route path="customers" element={<div className="text-center py-16"><h1 className="text-2xl font-bold">Customers</h1><p className="text-muted-foreground">Coming soon…</p></div>} />
          <Route path="settings" element={<div className="text-center py-16"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Coming soon…</p></div>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<MainLayout />}>
          <Route path="*" element={
            <div className="container mx-auto px-4 py-16 text-center">
              <h1 className="text-6xl font-bold">404</h1>
              <p className="mt-4 text-muted-foreground">Page not found</p>
            </div>
          } />
        </Route>
      </Routes>

      {/* Toast notifications */}
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  );
}

export default App;
