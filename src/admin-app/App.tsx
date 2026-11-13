import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import InventoryPage from "../pages/admin/InventoryPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminCustomersPage from "../pages/admin/AdminCustomersPage";
import PaymentsPage from "../pages/admin/PaymentsPage";
import AdminReviewsPage from "../pages/admin/AdminReviewsPage";
import AdminContentPage from "../pages/admin/AdminContentPage";
import QRPage from "../pages/admin/QRPage";
import AdminChatPage from "../pages/admin/AdminChatPage";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage";
import QuoteRequestsPage from "../pages/admin/QuoteRequestsPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// The admin portal. It is built and deployed on its own (see vite.config.ts and DEPLOYMENT.md),
// so none of the customer storefront code ships with it.
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="quotes" element={<QuoteRequestsPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="content" element={<AdminContentPage />} />
          <Route path="qr" element={<QRPage />} />
          <Route path="chat" element={<AdminChatPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
