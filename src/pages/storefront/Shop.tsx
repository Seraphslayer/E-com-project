import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Check,
  SlidersHorizontal,
  ArrowRight,
  Heart,
  MessageCircle,
  FileText,
  Plus,
  Minus,
} from "lucide-react";
import { products, blogPosts, Product } from "../../data/mockData";
import { useCart } from "../../store/cartStore";
import ReviewsPanel from "../../components/ReviewsPanel";
import { megaCategoryTiles } from "../../components/MegaMenu";
import { company, categories, majorClients, brandsByGroup, formatPHP } from "../../data/companyInfo";

const categoryNames = ["All", ...categories.map((c) => c.name)];
const sortOptions = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "Best Rated",
  "Most Reviews",
];

const capabilities = [
  {
    title: "Supply & Delivery",
    body: "Branded, in-stock equipment sourced directly from authorized distributors — ready for immediate deployment across Cavite and nationwide.",
  },
  {
    title: "Installation & Commissioning",
    body: "Our technicians handle site surveys, cabling, mounting, and system configuration, so what we supply arrives working on day one.",
  },
  {
    title: "Project Design & Consultation",
    body: "From a single camera to a citywide monitoring network, we scope the right system for your coverage area, budget, and growth plans.",
  },
  {
    title: "Maintenance & Support",
    body: "Ongoing servicing, firmware updates, and troubleshooting for communication, surveillance, and IT infrastructure already in the field.",
  },
  {
    title: "Government Procurement",
    body: "Experienced with LGU and government bidding requirements, documentation, and compliance for public-sector projects.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={11}
          className={n <= Math.round(rating) ? "text-[#FF8C00] fill-[#FF8C00]" : "text-[#D0D0D0]"}
        />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart, cart } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = cart.some((i) => i.product.id === product.id);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="group bg-white border border-[#E2E2E2] hover:border-[#D4B63A] transition-colors duration-200">
      <Link to={`/store/product/${product.id}`} className="block relative overflow-hidden bg-[#EBF0F0] aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-400"
        />
        {discount && (
          <div className="absolute top-3 left-3 bg-[#FF3B00] text-white font-mono text-[11px] px-2 py-0.5 tracking-wide">
            −{discount}%
          </div>
        )}
        {product.stock < 30 && (
          <div className="absolute top-3 right-3 bg-[#0D0D0D] text-white font-mono text-[10px] px-2 py-0.5 tracking-wide">
            {product.stock} left
          </div>
        )}
      </Link>

      <div className="p-4">
        <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1">{product.brand}</p>
        <Link to={`/store/product/${product.id}`}>
          <h3 className="font-display font-semibold text-[#0D0D0D] text-sm leading-snug mb-2 hover:text-[#856A00] transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
          <span className="font-mono text-[10px] text-[#6B6B6B]">{product.rating} ({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-[#0D0D0D] text-lg">{formatPHP(product.price)}</span>
            {product.originalPrice && (
              <span className="font-sans text-sm text-[#B0B0B0] line-through">{formatPHP(product.originalPrice)}</span>
            )}
          </div>
          {product.quoteOnly ? (
            <Link
              to={`/store/quote?product=${encodeURIComponent(product.name)}`}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono tracking-wide border border-[#D4B63A] text-[#856A00] hover:bg-[#EACD51] hover:text-[#0D0D0D] transition-colors"
            >
              Quote
            </Link>
          ) : (
            <button
              onClick={handleAdd}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono tracking-wide transition-colors ${
                added || inCart ? "bg-[#00875A] text-white" : "bg-[#EACD51] text-[#0D0D0D] hover:bg-[#D4B63A]"
              }`}
            >
              {added ? <Check size={12} /> : <ShoppingCart size={12} />}
              {added ? "Added" : inCart ? "In Cart" : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ExpandableCapability({ title, body, defaultOpen = false }: { title: string; body: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/10 py-4">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 text-left group">
        <span className="font-display font-semibold text-white text-base group-hover:text-[#EACD51] transition-colors">{title}</span>
        <span className="w-7 h-7 border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:border-[#EACD51] transition-colors">
          {open ? <Minus size={13} className="text-white" /> : <Plus size={13} className="text-white" />}
        </span>
      </button>
      {open && <p className="text-white/50 text-sm leading-relaxed mt-3 max-w-md">{body}</p>}
    </div>
  );
}

export default function Shop() {
  const [searchParams] = useSearchParams();
  const paramCategory = searchParams.get("category");
  const [category, setCategory] = useState(
    paramCategory && categoryNames.includes(paramCategory) ? paramCategory : "All"
  );
  const [sort, setSort] = useState("Featured");
  const [showReviews, setShowReviews] = useState(false);
  const [showMiniNav, setShowMiniNav] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Keep the shop in sync when a mega-menu link (or any other page) sends
  // us here with a ?category= param, e.g. /store?category=CCTV Surveillance
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && categoryNames.includes(cat)) {
      setCategory(cat);
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchParams]);

  // Sticky mini-nav appears once the hero has scrolled out of view —
  // the Apple-style "product name + jump links" bar.
  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowMiniNav(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const filtered = products
    .filter((p) => category === "All" || p.category === category)
    .sort((a, b) => {
      if (sort === "Price: Low to High") return a.price - b.price;
      if (sort === "Price: High to Low") return b.price - a.price;
      if (sort === "Best Rated") return b.rating - a.rating;
      if (sort === "Most Reviews") return b.reviews - a.reviews;
      return 0;
    });

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div>
      {/* ---- Sticky mini-nav (Apple-style scroll reveal) ---- */}
      <div
        className={`fixed top-0 left-0 right-0 z-30 bg-[#0D0D0D]/95 backdrop-blur border-b border-white/10 transition-transform duration-300 ${
          showMiniNav ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <span className="font-mono text-[11px] text-white tracking-widest uppercase">{company.name}</span>
          <div className="hidden md:flex items-center gap-6">
            {[
              { id: "capabilities", label: "Capabilities" },
              { id: "categories", label: "Categories" },
              { id: "clients", label: "Clients" },
              { id: "products", label: "Products" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="font-mono text-[11px] text-white/60 hover:text-white tracking-wide transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
          <Link
            to="/store/quote"
            className="bg-[#EACD51] text-[#0D0D0D] font-mono text-[11px] tracking-wide px-4 py-1.5 hover:bg-[#D4B63A] transition-colors"
          >
            Request a Quote
          </Link>
        </div>
      </div>

      {/* ---- Hero ---- */}
      <section ref={heroRef} className="relative bg-[#0D0D0D] overflow-hidden" style={{ minHeight: 480 }}>
        <img
          src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1600&h=900&fit=crop&auto=format"
          alt="Surveillance and communication infrastructure"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/60 to-[#0D0D0D]/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center" style={{ minHeight: 480 }}>
          <div className="py-20 max-w-2xl">
            <p className="font-mono text-[11px] text-white/50 tracking-widest uppercase mb-3">
              {company.foundedNote} · Cavite, Philippines
            </p>
            <h1 className="font-display font-bold text-4xl sm:text-6xl text-white tracking-tight leading-[1.05] mb-4">
              {company.tagline}
            </h1>
            <p className="text-white/60 text-sm sm:text-base max-w-lg mb-8 leading-relaxed">
              {company.subtagline}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => scrollTo("products")}
                className="bg-[#EACD51] text-[#0D0D0D] font-mono text-xs tracking-wide px-6 py-3 hover:bg-[#D4B63A] transition-colors"
              >
                BROWSE CATALOG
              </button>
              <Link
                to="/store/quote"
                className="flex items-center gap-2 border border-white/30 text-white font-mono text-xs tracking-wide px-6 py-3 hover:border-white transition-colors"
              >
                <FileText size={13} /> REQUEST A QUOTE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Stat band (Apple "major upgrade" pattern) ---- */}
      <section className="bg-[#0D0D0D] border-t border-white/10 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="font-mono text-[11px] text-white/40 tracking-widest uppercase mb-2">A trusted partner</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight mb-6">
            Built for public safety and<br className="hidden sm:block" /> business infrastructure.
          </h2>
          <p className="text-white/50 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-12">
            {company.mission}
          </p>
          <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
            <div>
              <p className="font-display font-bold text-3xl sm:text-4xl text-white mb-1">30+</p>
              <p className="font-mono text-[10px] sm:text-[11px] text-white/40 tracking-widest uppercase">Years in Business</p>
            </div>
            <div>
              <p className="font-display font-bold text-3xl sm:text-4xl text-white mb-1">{majorClients.length}+</p>
              <p className="font-mono text-[10px] sm:text-[11px] text-white/40 tracking-widest uppercase">LGU & Gov't Clients</p>
            </div>
            <div>
              <p className="font-display font-bold text-3xl sm:text-4xl text-white mb-1">{categories.length}</p>
              <p className="font-mono text-[10px] sm:text-[11px] text-white/40 tracking-widest uppercase">Solution Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Capability highlight reel (Apple scroll-reveal pattern) ---- */}
      <section id="capabilities" className="bg-[#0D0D0D] border-t border-white/10 py-16 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center justify-between">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">What we supply & install</h2>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-4 px-6 max-w-7xl mx-auto scrollbar-thin">
          {categories.map((c) => {
            const tile = megaCategoryTiles.find((t) => t.name === c.name);
            return (
              <Link
                key={c.slug}
                to={`/store/products?category=${encodeURIComponent(c.name)}`}
                className="group shrink-0 w-72 bg-white/5 border border-white/10 hover:border-[#EACD51] transition-colors"
              >
                {tile && (
                  <div className="aspect-video overflow-hidden">
                    <img src={tile.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-display font-semibold text-white text-base mb-2 group-hover:text-[#EACD51] transition-colors">{c.name}</h3>
                  <p className="text-white/50 text-xs leading-relaxed mb-3">{c.blurb}</p>
                  <span className="font-mono text-[10px] text-white/40 tracking-wide flex items-center gap-1 group-hover:text-[#EACD51] transition-colors">
                    EXPLORE <ArrowRight size={11} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---- Capabilities expandable list (Apple "Design" pattern) ---- */}
      <section className="bg-[#0D0D0D] border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="font-mono text-[11px] text-white/40 tracking-widest uppercase mb-3">End-to-end service</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-8">
              More than a supplier.<br />A project partner.
            </h2>
            <div className="aspect-[4/3] overflow-hidden bg-white/5 border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&auto=format"
                alt="Technician installing equipment"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            {capabilities.map((cap, i) => (
              <ExpandableCapability key={cap.title} {...cap} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {/* ---- Category grid ---- */}
        <section id="categories" className="py-14 scroll-mt-20">
          <h2 className="font-display font-bold text-2xl text-[#0D0D0D] tracking-tight mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {megaCategoryTiles.map((tile) => (
              <button
                key={tile.name}
                onClick={() => {
                  setCategory(tile.name);
                  scrollTo("products");
                }}
                className="group text-left"
              >
                <div className="aspect-square overflow-hidden bg-[#EBF0F0] mb-3">
                  <img
                    src={tile.image}
                    alt={tile.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="font-display font-semibold text-sm text-[#0D0D0D] group-hover:text-[#856A00] transition-colors leading-snug">
                  {tile.name}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* ---- Quote banner ---- */}
        <section className="relative mb-14 overflow-hidden bg-[#0D0D0D]" style={{ minHeight: 220 }}>
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&h=500&fit=crop&auto=format"
            alt="Project consultation"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative z-10 px-8 sm:px-12 py-14 max-w-md">
            <p className="font-mono text-[10px] text-white/40 tracking-widest uppercase mb-2">Project-based solutions</p>
            <h3 className="font-display font-bold text-2xl text-white tracking-tight mb-2">Need a custom system?</h3>
            <p className="text-white/60 text-sm mb-6">
              Tell us your coverage area, site, or project scope and our team will prepare a formal quotation.
            </p>
            <Link
              to="/store/quote"
              className="bg-[#EACD51] text-[#0D0D0D] font-mono text-xs tracking-wide px-6 py-3 hover:bg-[#D4B63A] transition-colors flex items-center gap-2 w-fit"
            >
              REQUEST A QUOTE <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        {/* ---- Products ---- */}
        <section id="products" className="py-4 scroll-mt-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl text-[#0D0D0D] tracking-tight">Catalog</h2>
            <Link
              to="/store/products"
              className="font-mono text-xs text-[#6B6B6B] hover:text-[#856A00] transition-colors underline underline-offset-2"
            >
              View all →
            </Link>
          </div>

          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-1 flex-wrap">
              {categoryNames.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 font-mono text-xs tracking-wide transition-colors ${
                    category === cat
                      ? "bg-[#0D0D0D] text-white"
                      : "bg-white border border-[#E2E2E2] text-[#6B6B6B] hover:border-[#0D0D0D] hover:text-[#0D0D0D]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowReviews(!showReviews)}
                className={`flex items-center gap-2 px-3 py-1.5 font-mono text-xs tracking-wide border transition-colors ${
                  showReviews ? "border-[#D4B63A] text-[#856A00] bg-[#EACD51]/15" : "border-[#E2E2E2] text-[#6B6B6B] hover:border-[#0D0D0D]"
                }`}
              >
                <Star size={12} />
                Reviews
              </button>
              <div className="flex items-center gap-2 border border-[#E2E2E2] px-3 py-1.5">
                <SlidersHorizontal size={12} className="text-[#6B6B6B]" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="font-mono text-xs text-[#0D0D0D] bg-transparent border-none outline-none cursor-pointer"
                >
                  {sortOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className={`grid gap-6 ${showReviews ? "lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-4"}`}>
            {showReviews ? (
              <>
                <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-start">
                  {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
                <div>
                  <ReviewsPanel />
                </div>
              </>
            ) : (
              filtered.map((p) => <ProductCard key={p.id} product={p} />)
            )}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-[#6B6B6B]">
              <p className="font-mono text-sm">No products in this category.</p>
            </div>
          )}
        </section>

        {/* ---- Trusted by LGUs & businesses ---- */}
        <section id="clients" className="py-14 scroll-mt-20">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0D0D0D] tracking-tight mb-3">
            Trusted by Local Governments & Businesses
          </h2>
          <p className="text-[#6B6B6B] text-sm leading-relaxed mb-8 max-w-2xl">{company.vision}</p>
          <div className="flex flex-wrap gap-2 mb-12">
            {majorClients.map((client) => (
              <span
                key={client}
                className="font-mono text-[11px] text-[#0D0D0D] border border-[#E2E2E2] px-3 py-1.5 tracking-wide"
              >
                {client}
              </span>
            ))}
          </div>

          <h3 className="font-display font-bold text-xl text-[#0D0D0D] tracking-tight mb-6">Brands We Carry</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {brandsByGroup.map(({ group, brands }) => (
              <div key={group}>
                <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-2">{group}</p>
                <div className="flex flex-wrap gap-1.5">
                  {brands.map((b) => (
                    <span key={b} className="font-sans text-xs text-[#0D0D0D] bg-[#EBF0F0] px-2 py-1">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---- Blog / journal ---- */}
        <section className="py-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl text-[#0D0D0D] tracking-tight">Updates & Guides</h2>
            <Link
              to="/store/community"
              className="font-mono text-xs text-[#6B6B6B] hover:text-[#856A00] transition-colors underline underline-offset-2"
            >
              View all
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <Link to="/store/community" key={post.id} className="group block">
                <div className="aspect-video overflow-hidden bg-[#EBF0F0] mb-3">
                  <img
                    src={post.image || "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&h=400&fit=crop&auto=format"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="font-mono text-[10px] text-[#856A00] tracking-widest uppercase mb-1.5">{post.category}</p>
                <h3 className="font-display font-semibold text-[#0D0D0D] leading-snug mb-2 group-hover:text-[#856A00] transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center gap-3 font-mono text-[10px] text-[#6B6B6B]">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1"><Heart size={10} /> {post.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={10} /> {post.comments}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
