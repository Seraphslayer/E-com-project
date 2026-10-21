import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Check,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  CheckCircle,
  ThumbsUp,
  FileText,
} from "lucide-react";
import { products, reviews } from "../../data/mockData";
import { useCart } from "../../store/cartStore";
import FeatureTag from "../../components/FeatureTag";
import { formatPHP } from "../../data/companyInfo";

type Tab = "description" | "specs" | "reviews";

function StarRow({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={
            n <= Math.round(rating)
              ? "text-[#FF8C00] fill-[#FF8C00]"
              : "text-[#D0D0D0]"
          }
        />
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();

  const product = products.find((p) => p.id === id);

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState<Tab>("description");

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-2">
          404
        </p>
        <h1 className="font-display font-bold text-2xl text-[#0D0D0D] mb-4">
          Product not found
        </h1>
        <p className="text-[#6B6B6B] text-sm mb-6">
          This item may have been removed or the link is out of date.
        </p>
        <Link
          to="/store/products"
          className="bg-[#0047FF] text-white px-6 py-3 font-mono text-sm tracking-wide hover:bg-[#0035CC] transition-colors"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  const inCart = cart.some((i) => i.product.id === product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;
  const productReviews = reviews.filter((r) => r.productId === product.id);
  const avgRating = productReviews.length
    ? productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length
    : product.rating;

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate("/store/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#6B6B6B] tracking-wide mb-6 flex-wrap">
        <Link to="/store" className="hover:text-[#0047FF] transition-colors">
          Store
        </Link>
        <ChevronRight size={11} />
        <Link
          to={`/store/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-[#0047FF] transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight size={11} />
        <span className="text-[#0D0D0D] truncate max-w-[240px]">
          {product.name}
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[#F5F5F5]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {discount && (
            <div className="absolute top-4 left-4 bg-[#FF3B00] text-white font-mono text-xs px-2.5 py-1 tracking-wide">
              −{discount}%
            </div>
          )}
          {product.stock < 30 && (
            <div className="absolute top-4 right-4 bg-[#0D0D0D] text-white font-mono text-[11px] px-2.5 py-1 tracking-wide">
              Only {product.stock} left
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-2">
            {product.brand}
          </p>
          <h1 className="font-display font-bold text-3xl text-[#0D0D0D] tracking-tight leading-snug mb-3">
            {product.name}
          </h1>

          <button
            onClick={() => setTab("reviews")}
            className="flex items-center gap-2 mb-5 hover:opacity-70 transition-opacity"
          >
            <StarRow rating={avgRating} />
            <span className="font-mono text-[11px] text-[#6B6B6B] underline underline-offset-2">
              {avgRating.toFixed(1)} ({product.reviews} reviews)
            </span>
          </button>

          <div className="flex items-baseline gap-3 mb-5">
            <span className="font-display font-bold text-3xl text-[#0D0D0D]">
              {formatPHP(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-sans text-lg text-[#B0B0B0] line-through">
                {formatPHP(product.originalPrice)}
              </span>
            )}
            {discount && (
              <span className="font-mono text-xs text-[#00875A] tracking-wide">
                You save {formatPHP(product.originalPrice! - product.price)}
              </span>
            )}
          </div>
          {product.quoteOnly && (
            <p className="font-mono text-[11px] text-[#6B6B6B] tracking-wide mb-5 -mt-3">
              Listed price is indicative — final pricing depends on quantity, installation, and site requirements.
            </p>
          )}

          <p className="text-[#6B6B6B] text-sm leading-relaxed mb-5 max-w-md">
            {product.description}
          </p>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-6">
              {product.tags.map((t) => (
                <FeatureTag key={t} tag={t} size="md" />
              ))}
            </div>
          )}

          {/* Quantity + actions */}
          {product.quoteOnly ? (
            <Link
              to={`/store/quote?product=${encodeURIComponent(product.name)}`}
              className="w-full flex items-center justify-center gap-2 py-3.5 font-mono text-sm tracking-widest uppercase bg-[#0047FF] text-white hover:bg-[#0035CC] transition-colors mb-6"
            >
              <FileText size={15} />
              Request a Quote
            </Link>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border border-[#E2E2E2]">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-11 flex items-center justify-center hover:bg-[#F5F5F5] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-10 text-center font-mono text-sm">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="w-10 h-11 flex items-center justify-center hover:bg-[#F5F5F5] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 font-mono text-sm tracking-widest uppercase transition-colors ${
                    added || inCart
                      ? "bg-[#00875A] text-white"
                      : "bg-[#0047FF] text-white hover:bg-[#0035CC]"
                  }`}
                >
                  {added ? <Check size={15} /> : <ShoppingCart size={15} />}
                  {added ? "Added" : inCart ? "In Cart — Add More" : "Add to Cart"}
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full border border-[#0D0D0D] text-[#0D0D0D] py-3 font-mono text-sm tracking-widest uppercase hover:bg-[#0D0D0D] hover:text-white transition-colors mb-3"
              >
                Buy Now
              </button>

              <Link
                to={`/store/quote?product=${encodeURIComponent(product.name)}`}
                className="w-full flex items-center justify-center gap-2 py-3 font-mono text-xs tracking-widest uppercase text-[#6B6B6B] hover:text-[#0047FF] transition-colors mb-6 border border-dashed border-[#E2E2E2] hover:border-[#0047FF]"
              >
                <FileText size={13} />
                Need bulk pricing or installation? Request a Quote
              </Link>
            </>
          )}

          {/* Trust row */}
          <div className="grid grid-cols-3 gap-3 border-t border-[#E2E2E2] pt-5">
            <div className="flex flex-col items-center text-center gap-1.5">
              <Truck size={17} className="text-[#0047FF]" />
              <p className="font-mono text-[9px] text-[#6B6B6B] tracking-wide">
                Free Shipping $75+
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5">
              <RotateCcw size={17} className="text-[#0047FF]" />
              <p className="font-mono text-[9px] text-[#6B6B6B] tracking-wide">
                30-Day Returns
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5">
              <ShieldCheck size={17} className="text-[#0047FF]" />
              <p className="font-mono text-[9px] text-[#6B6B6B] tracking-wide">
                Secure Checkout
              </p>
            </div>
          </div>

          <p className="font-mono text-[10px] text-[#6B6B6B] mt-5">
            SKU: {product.sku}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <section className="mb-16">
        <div className="flex gap-0 border-b border-[#E2E2E2]">
          {(
            [
              { key: "description", label: "Description" },
              { key: "specs", label: "Specifications" },
              { key: "reviews", label: `Reviews (${productReviews.length})` },
            ] as { key: Tab; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-3 font-mono text-xs tracking-widest uppercase transition-colors border-b-2 -mb-px ${
                tab === key
                  ? "border-[#0047FF] text-[#0047FF]"
                  : "border-transparent text-[#6B6B6B] hover:text-[#0D0D0D]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="py-8 max-w-3xl">
          {tab === "description" && (
            <p className="text-[#0D0D0D] text-sm leading-relaxed">
              {product.description}
            </p>
          )}

          {tab === "specs" && (
            <div className="space-y-3">
              {[
                ["Brand", product.brand],
                ["Category", product.category],
                ["SKU", product.sku],
                ["In Stock", `${product.stock} units`],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex gap-6 py-2 border-b border-[#E2E2E2] last:border-0"
                >
                  <span className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase w-32 shrink-0">
                    {k}
                  </span>
                  <span className="font-sans text-sm text-[#0D0D0D]">{v}</span>
                </div>
              ))}
              {product.tags.length > 0 && (
                <div className="flex gap-6 py-2">
                  <span className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase w-32 shrink-0">
                    Features
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {product.tags.map((t) => (
                      <FeatureTag key={t} tag={t} size="md" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "reviews" && (
            <div>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E2E2E2]">
                <span className="font-display font-bold text-4xl text-[#0D0D0D]">
                  {avgRating.toFixed(1)}
                </span>
                <div>
                  <StarRow rating={avgRating} size={14} />
                  <p className="font-mono text-[11px] text-[#6B6B6B] mt-1">
                    {productReviews.length} reviews for this product
                  </p>
                </div>
              </div>

              {productReviews.length === 0 ? (
                <p className="text-[#6B6B6B] text-sm">
                  No reviews yet for this product.
                </p>
              ) : (
                <div className="space-y-6">
                  {productReviews.map((review) => (
                    <div key={review.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#F0F0F0] flex items-center justify-center font-mono text-[10px] font-semibold text-[#0D0D0D] flex-shrink-0">
                        {review.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-sans text-sm font-semibold text-[#0D0D0D]">
                            {review.author}
                          </span>
                          {review.verified && (
                            <span className="flex items-center gap-0.5 font-mono text-[10px] text-[#00875A]">
                              <CheckCircle size={10} /> Verified
                            </span>
                          )}
                        </div>
                        <StarRow rating={review.rating} size={11} />
                        <p className="font-sans font-medium text-sm text-[#0D0D0D] mt-1.5 mb-1">
                          {review.title}
                        </p>
                        <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed">
                          {review.body}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button className="flex items-center gap-1 font-mono text-[10px] text-[#6B6B6B] hover:text-[#0047FF] transition-colors">
                            <ThumbsUp size={10} /> {review.helpful} helpful
                          </button>
                          <span className="font-mono text-[10px] text-[#D0D0D0]">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="pb-8">
          <h2 className="font-display font-bold text-2xl text-[#0D0D0D] tracking-tight mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/store/product/${p.id}`}
                className="group bg-white border border-[#E2E2E2] hover:border-[#0047FF] transition-colors duration-200 block"
              >
                <div className="aspect-square overflow-hidden bg-[#F5F5F5]">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-400"
                  />
                </div>
                <div className="p-4">
                  <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1">
                    {p.brand}
                  </p>
                  <h3 className="font-display font-semibold text-[#0D0D0D] text-sm leading-snug mb-2">
                    {p.name}
                  </h3>
                  <span className="font-display font-bold text-[#0D0D0D]">
                    {formatPHP(p.price)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
