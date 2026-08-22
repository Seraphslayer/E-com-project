import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RoleSelect from './pages/RoleSelect'
import StorefrontLayout from './pages/storefront/StorefrontLayout'
import Shop from './pages/storefront/Shop'
import AllProductsPage from './pages/storefront/AllProductsPage'
import CartPage from './pages/storefront/CartPage'
import CheckoutPage from './pages/storefront/CheckoutPage'
import OrdersPage from './pages/storefront/OrdersPage'
import MicroblogPage from './pages/storefront/MicroblogPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import InventoryPage from './pages/admin/InventoryPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import PaymentsPage from './pages/admin/PaymentsPage'
import QRPage from './pages/admin/QRPage'
import AdminChatPage from './pages/admin/AdminChatPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelect />} />

        <Route path="/store" element={<StorefrontLayout />}>
          <Route index element={<Shop />} />
          <Route path="products" element={<AllProductsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="community" element={<MicroblogPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="qr" element={<QRPage />} />
          <Route path="chat" element={<AdminChatPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
