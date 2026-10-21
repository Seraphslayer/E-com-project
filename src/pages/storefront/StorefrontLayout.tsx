import { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  X,
  ArrowLeft,
  ShoppingCart,
  Search,
  Camera,
  User,
  LogOut,
  FileText,
} from "lucide-react";
import { useCart } from "../../store/cartStore";
import ChatWidget from "../../components/ChatWidget";
import PromoBar from "../../components/PromoBar";
import Footer from "../../components/Footer";
import { AllProductsMenu, CategoryMenu } from "../../components/MegaMenu";
import { company } from "../../data/companyInfo";

const FEATURED_CATEGORY = "CCTV Surveillance";

type ActiveMenu = "all" | "featured" | null;

export default function StorefrontLayout() {
  const navigate = useNavigate();
  const { count } = useCart();
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const handleMenuNavigate = (path: string) => {
    navigate(path);
    setActiveMenu(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(
      q ? `/store/products?search=${encodeURIComponent(q)}` : "/store/products",
    );
    setSearchOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <PromoBar />

      {/* Top nav */}
      <header
        className="sticky top-0 z-40 bg-white border-b border-[#E2E2E2]"
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => navigate("/")}
              className="hidden lg:flex items-center gap-1.5 text-[#6B6B6B] hover:text-[#0D0D0D] transition-colors"
            >
              <ArrowLeft size={14} />
              <span className="font-mono text-[11px] tracking-widest uppercase">
                Exit
              </span>
            </button>
            <div className="hidden lg:block w-px h-4 bg-[#E2E2E2]" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#0047FF] flex items-center justify-center">
                <span className="font-display font-bold text-white text-sm">
                  F
                </span>
              </div>
              <span className="font-display font-semibold text-lg text-[#0D0D0D] tracking-tight leading-none">
                {company.shortName}
                <span className="block font-mono text-[8px] text-[#6B6B6B] tracking-widest uppercase font-normal">
                  Trading OPC
                </span>
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 shrink-0">
            <NavLink
              to="/store"
              end
              onMouseEnter={() => setActiveMenu("all")}
              className={({ isActive }) =>
                `relative flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  isActive || activeMenu === "all"
                    ? "text-[#0047FF] font-medium"
                    : "text-[#6B6B6B] hover:text-[#0D0D0D]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <ShoppingBag size={14} />
                  <span className="font-sans">Shop</span>
                  {(isActive || activeMenu === "all") && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0047FF]" />
                  )}
                </>
              )}
            </NavLink>

            <button
              onMouseEnter={() => setActiveMenu("featured")}
              onClick={() =>
                handleMenuNavigate(`/store/products?category=${encodeURIComponent(FEATURED_CATEGORY)}`)
              }
              className={`relative flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                activeMenu === "featured"
                  ? "text-[#0047FF] font-medium"
                  : "text-[#6B6B6B] hover:text-[#0D0D0D]"
              }`}
            >
              <Camera size={14} />
              <span className="font-sans">CCTV Surveillance</span>
              {activeMenu === "featured" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0047FF]" />
              )}
            </button>
          </nav>

          <div className="flex-1" />

          <div className="flex items-center justify-end">
            <form
              onSubmit={handleSearchSubmit}
              className={`flex items-center overflow-hidden border bg-[#F5F5F5] transition-all duration-300 ease-out h-9 ${
                searchOpen
                  ? "w-56 sm:w-72 border-[#E2E2E2] focus-within:border-[#0047FF] opacity-100 px-3 mr-2"
                  : "w-0 border-transparent opacity-0 px-0 mr-0"
              }`}
            >
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchOpen(false);
                }}
                placeholder="Search products…"
                tabIndex={searchOpen ? 0 : -1}
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-[#9B9B9B] min-w-0"
              />
            </form>
            <button
              type="button"
              onClick={() => setSearchOpen((o) => !o)}
              onMouseEnter={() => setActiveMenu(null)}
              aria-label={searchOpen ? "Close search" : "Open search"}
              className="w-9 h-9 flex items-center justify-center text-[#6B6B6B] hover:text-[#0D0D0D] transition-colors"
            >
              {searchOpen ? <X size={17} /> : <Search size={17} />}
            </button>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <NavLink
              to="/store/quote"
              onMouseEnter={() => setActiveMenu(null)}
              className="hidden sm:flex items-center gap-1.5 border border-[#0047FF] text-[#0047FF] px-3 py-1.5 font-mono text-[11px] tracking-wide uppercase hover:bg-[#0047FF] hover:text-white transition-colors"
            >
              <FileText size={12} />
              Request a Quote
            </NavLink>
            <NavLink
              to="/store/cart"
              onMouseEnter={() => setActiveMenu(null)}
              className={({ isActive }) =>
                `relative w-9 h-9 flex items-center justify-center transition-colors ${
                  isActive
                    ? "text-[#0047FF]"
                    : "text-[#6B6B6B] hover:text-[#0D0D0D]"
                }`
              }
            >
              <ShoppingCart size={17} />
              {count > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#0047FF] text-white font-mono text-[10px] flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </NavLink>
            <div className="w-px h-5 bg-[#E2E2E2]" />
            <div className="relative">
              <button
                onClick={() => setAccountOpen((o) => !o)}
                onBlur={() => setTimeout(() => setAccountOpen(false), 150)}
                className="w-7 h-7 bg-[#F0F0F0] flex items-center justify-center text-xs font-mono text-[#0D0D0D] shrink-0 hover:bg-[#E2E2E2] transition-colors"
              >
                EV
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E2E2E2] shadow-lg z-50">
                  <div className="px-4 py-3 border-b border-[#E2E2E2]">
                    <p className="font-sans text-sm font-medium text-[#0D0D0D]">
                      Elena Vasquez
                    </p>
                    <p className="font-mono text-[10px] text-[#6B6B6B]">
                      elena.v@email.com
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/store/orders");
                      setAccountOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left font-sans text-sm text-[#0D0D0D] hover:bg-[#F5F5F5] transition-colors"
                  >
                    <User size={14} className="text-[#6B6B6B]" /> My Orders
                  </button>
                  <button
                    onClick={() => {
                      navigate("/");
                      setAccountOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left font-sans text-sm text-[#0D0D0D] hover:bg-[#F5F5F5] transition-colors border-t border-[#E2E2E2]"
                  >
                    <LogOut size={14} className="text-[#6B6B6B]" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {activeMenu === "all" && (
          <AllProductsMenu onNavigate={handleMenuNavigate} />
        )}
        {activeMenu === "featured" && (
          <CategoryMenu
            category={FEATURED_CATEGORY}
            onNavigate={handleMenuNavigate}
          />
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
