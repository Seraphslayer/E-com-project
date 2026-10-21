import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RoleSelect from "./pages/RoleSelect";
import StorefrontLayout from "./pages/storefront/StorefrontLayout";
import Shop from "./pages/storefront/Shop";
import AllProductsPage from "./pages/storefront/AllProductsPage";
import ProductDetailPage from "./pages/storefront/ProductDetailPage";
import CartPage from "./pages/storefront/CartPage";
import CheckoutPage from "./pages/storefront/CheckoutPage";
import OrdersPage from "./pages/storefront/OrdersPage";
import MicroblogPage from "./pages/storefront/MicroblogPage";
import QuoteRequestPage from "./pages/storefront/QuoteRequestPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import InventoryPage from "./pages/admin/InventoryPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminCustomersPage from "./pages/admin/AdminCustomersPage";
import PaymentsPage from "./pages/admin/PaymentsPage";
import AdminReviewsPage from "./pages/admin/AdminReviewsPage";
import AdminContentPage from "./pages/admin/AdminContentPage";
import QRPage from "./pages/admin/QRPage";
import AdminChatPage from "./pages/admin/AdminChatPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelect />} />

        <Route path="/store" element={<StorefrontLayout />}>
          <Route index element={<Shop />} />
          <Route path="products" element={<AllProductsPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="community" element={<MicroblogPage />} />
          <Route path="quote" element={<QuoteRequestPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="content" element={<AdminContentPage />} />
          <Route path="qr" element={<QRPage />} />
          <Route path="chat" element={<AdminChatPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
