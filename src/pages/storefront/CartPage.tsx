import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../store/cartStore";
import { formatPHP } from "../../data/companyInfo";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total, count } = useCart();
  const navigate = useNavigate();

  const shipping = total > 20000 ? 0 : 850;
  const tax = total * 0.12;
  const orderTotal = total + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-[#D0D0D0] mb-4" />
        <h2 className="font-display font-semibold text-2xl text-[#0D0D0D] mb-2">
          Your cart is empty
        </h2>
        <p className="text-[#6B6B6B] mb-6 font-sans text-sm">
          Add products from the shop to get started.
        </p>
        <button
          onClick={() => navigate("/store")}
          className="bg-[#EACD51] text-[#0D0D0D] px-6 py-3 font-mono text-sm tracking-wide hover:bg-[#D4B63A] transition-colors"
        >
          Browse Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-1">
          Cart — Service 01
        </p>
        <h1 className="font-display font-bold text-3xl text-[#0D0D0D] tracking-tight">
          Your Cart{" "}
          <span className="text-[#6B6B6B] font-normal text-xl">
            ({count} items)
          </span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-0">
          <div className="grid grid-cols-12 gap-4 pb-2 border-b border-[#E2E2E2] font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {cart.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="grid grid-cols-12 gap-4 py-4 border-b border-[#E2E2E2] items-center"
            >
              <div className="col-span-6 flex items-center gap-3">
                <Link
                  to={`/store/product/${product.id}`}
                  className="w-16 h-16 bg-[#EBF0F0] flex-shrink-0 overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div>
                  <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase">
                    {product.brand}
                  </p>
                  <Link to={`/store/product/${product.id}`}>
                    <p className="font-display font-semibold text-sm text-[#0D0D0D] leading-snug hover:text-[#856A00] transition-colors">
                      {product.name}
                    </p>
                  </Link>
                  <p className="font-mono text-[10px] text-[#6B6B6B]">
                    SKU: {product.sku}
                  </p>
                </div>
              </div>

              <div className="col-span-2 text-center">
                <span className="font-display font-semibold text-[#0D0D0D]">
                  {formatPHP(product.price)}
                </span>
              </div>

              <div className="col-span-2 flex items-center justify-center gap-2">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-6 h-6 border border-[#E2E2E2] flex items-center justify-center hover:border-[#0D0D0D] transition-colors"
                >
                  <Minus size={10} />
                </button>
                <span className="font-mono text-sm w-6 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="w-6 h-6 border border-[#E2E2E2] flex items-center justify-center hover:border-[#0D0D0D] transition-colors"
                >
                  <Plus size={10} />
                </button>
              </div>

              <div className="col-span-2 flex items-center justify-end gap-3">
                <span className="font-display font-bold text-[#0D0D0D]">
                  {formatPHP(product.price * quantity)}
                </span>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-[#D0D0D0] hover:text-[#FF3B00] transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white border border-[#E2E2E2] p-6">
            <h2 className="font-display font-bold text-lg text-[#0D0D0D] mb-5">
              Order Summary
            </h2>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B6B6B] font-sans">
                  Subtotal ({count} items)
                </span>
                <span className="font-display font-semibold">
                  {formatPHP(total)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B6B6B] font-sans">Shipping</span>
                <span
                  className={`font-display font-semibold ${shipping === 0 ? "text-[#00875A]" : ""}`}
                >
                  {shipping === 0 ? "Free" : formatPHP(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B6B6B] font-sans">VAT (12%)</span>
                <span className="font-display font-semibold">
                  {formatPHP(tax)}
                </span>
              </div>
            </div>

            {shipping === 0 && (
              <div className="bg-[#00875A]/10 border border-[#00875A]/20 px-3 py-2 mb-5">
                <p className="font-mono text-[11px] text-[#00875A] tracking-wide">
                  Free delivery applied (orders over ₱20,000)
                </p>
              </div>
            )}

            <div className="border-t border-[#E2E2E2] pt-4 mb-5">
              <div className="flex justify-between">
                <span className="font-display font-bold text-[#0D0D0D]">
                  Order Total
                </span>
                <span className="font-display font-bold text-xl text-[#856A00]">
                  {formatPHP(orderTotal)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/store/checkout")}
              className="w-full bg-[#EACD51] text-[#0D0D0D] py-3.5 font-mono text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#D4B63A] transition-colors"
            >
              Checkout
              <ArrowRight size={14} />
            </button>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {["Card", "GCash", "Maya", "GrabPay"].map((method) => (
                <div key={method} className="border border-[#E2E2E2] px-2 py-1.5 text-center">
                  <p className="font-mono text-[9px] text-[#6B6B6B] tracking-wide">
                    {method}
                  </p>
                </div>
              ))}
            </div>
            <p className="font-mono text-[9px] text-[#B0B0B0] mt-2 text-center">Secured by PayMongo</p>
          </div>

          {/* Promo code */}
          <div className="mt-4 bg-white border border-[#E2E2E2] p-4">
            <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-3">
              Promo Code
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter code"
                className="flex-1 border border-[#E2E2E2] px-3 py-2 font-mono text-sm outline-none focus:border-[#D4B63A] transition-colors"
              />
              <button className="px-4 py-2 border border-[#0D0D0D] font-mono text-xs tracking-wide hover:bg-[#0D0D0D] hover:text-white transition-colors">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
