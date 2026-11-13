import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import StorefrontLayout from "../pages/storefront/StorefrontLayout";
import Shop from "../pages/storefront/Shop";
import AllProductsPage from "../pages/storefront/AllProductsPage";
import ProductDetailPage from "../pages/storefront/ProductDetailPage";
import CartPage from "../pages/storefront/CartPage";
import CheckoutPage from "../pages/storefront/CheckoutPage";
import OrdersPage from "../pages/storefront/OrdersPage";
import MicroblogPage from "../pages/storefront/MicroblogPage";
import QuoteRequestPage from "../pages/storefront/QuoteRequestPage";
import InfoPage from "../pages/storefront/InfoPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/store" replace />} />

        <Route path="/store" element={<StorefrontLayout />}>
          <Route index element={<Shop />} />
          <Route path="products" element={<AllProductsPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="community" element={<MicroblogPage />} />
          <Route path="quote" element={<QuoteRequestPage />} />
          <Route path="info/:topic" element={<InfoPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/store" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
