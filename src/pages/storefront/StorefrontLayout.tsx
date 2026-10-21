import { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  X,
  ArrowRight,
  ArrowLeft,
  ShoppingCart,
  Search,
  Camera,
  Radio,
  Fingerprint,
  Speaker,
  Laptop,
  User,
  LogOut,
  FileText,
} from "lucide-react";
import { useCart } from "../../store/cartStore";
import ChatWidget from "../../components/ChatWidget";
import PromoBar from "../../components/PromoBar";
import Footer from "../../components/Footer";
import { AllProductsMenu, CategoryMenu } from "../../components/MegaMenu";
import { categories, company } from "../../data/companyInfo";

const navCategories = [
  { name: "Land Mobile Communication", label: "Land Mobile", icon: Radio },
  { name: "CCTV Surveillance", label: "CCTV", icon: Camera },
  { name: "Access Control", label: "Access Control", icon: Fingerprint },
  { name: "Audio & Visual", label: "Audio & Visual", icon: Speaker },
  { name: "IT Equipment", label: "IT Equipment", icon: Laptop },
];

// "all" opens the Shop mega menu; any other string is a category name.
type ActiveMenu = string | null;

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
    <div className="min-h-screen bg-[#F0F1F1] flex flex-col">
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
              <div className="w-7 h-7 bg-[#EACD51] flex items-center justify-center">
                <span className="font-display font-bold text-[#0D0D0D] text-sm">
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
                    ? "text-[#856A00] font-medium"
                    : "text-[#6B6B6B] hover:text-[#0D0D0D]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <ShoppingBag size={14} />
                  <span className="font-sans">Shop</span>
                  {(isActive || activeMenu === "all") && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EACD51]" />
                  )}
                </>
              )}
            </NavLink>

            {navCategories.map(({ name, label, icon: Icon }) => (
              <button
                key={name}
                onMouseEnter={() => setActiveMenu(name)}
                onClick={() =>
                  handleMenuNavigate(
                    `/store/products?category=${encodeURIComponent(name)}`,
                  )
                }
                className={`relative hidden lg:flex items-center gap-2 px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                  activeMenu === name
                    ? "text-[#856A00] font-medium"
                    : "text-[#6B6B6B] hover:text-[#0D0D0D]"
                }`}
              >
                <Icon size={14} />
                <span className="font-sans">{label}</span>
                {activeMenu === name && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EACD51]" />
                )}
              </button>
            ))}
          </nav>

          <div className="flex-1" />

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => {
                setActiveMenu(null);
                setSearchOpen((o) => !o);
              }}
              aria-label={searchOpen ? "Close search" : "Open search"}
              className={`w-9 h-9 flex items-center justify-center transition-colors ${
                searchOpen ? "text-[#856A00]" : "text-[#6B6B6B] hover:text-[#0D0D0D]"
              }`}
            >
              {searchOpen ? <X size={17} /> : <Search size={17} />}
            </button>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <NavLink
              to="/store/quote"
              onMouseEnter={() => setActiveMenu(null)}
              className="hidden sm:flex items-center gap-1.5 border border-[#D4B63A] text-[#856A00] px-3 py-1.5 font-mono text-[11px] tracking-wide uppercase hover:bg-[#EACD51] hover:text-[#0D0D0D] transition-colors"
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
                    ? "text-[#856A00]"
                    : "text-[#6B6B6B] hover:text-[#0D0D0D]"
                }`
              }
            >
              <ShoppingCart size={17} />
              {count > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#EACD51] text-[#0D0D0D] font-mono text-[10px] flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </NavLink>
            <div className="w-px h-5 bg-[#E2E2E2]" />
            <div className="relative">
              <button
                onClick={() => setAccountOpen((o) => !o)}
                onBlur={() => setTimeout(() => setAccountOpen(false), 150)}
                className="w-7 h-7 bg-[#E4EBEB] flex items-center justify-center text-xs font-mono text-[#0D0D0D] shrink-0 hover:bg-[#E2E2E2] transition-colors"
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
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left font-sans text-sm text-[#0D0D0D] hover:bg-[#EBF0F0] transition-colors"
                  >
                    <User size={14} className="text-[#6B6B6B]" /> My Orders
                  </button>
                  <button
                    onClick={() => {
                      navigate("/");
                      setAccountOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left font-sans text-sm text-[#0D0D0D] hover:bg-[#EBF0F0] transition-colors border-t border-[#E2E2E2]"
                  >
                    <LogOut size={14} className="text-[#6B6B6B]" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {!searchOpen && activeMenu === "all" && (
          <AllProductsMenu onNavigate={handleMenuNavigate} />
        )}
        {!searchOpen && activeMenu && activeMenu !== "all" && (
          <CategoryMenu
            category={activeMenu}
            onNavigate={handleMenuNavigate}
          />
        )}
        {searchOpen && (
          <>
            <div
              className="absolute top-full left-0 right-0 h-screen bg-black/30"
              onClick={() => setSearchOpen(false)}
            />
            <div className="absolute top-full left-0 right-0 bg-white border-b border-[#E2E2E2] shadow-sm">
              <div className="max-w-7xl mx-auto px-6 py-8">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center gap-3 border-b border-[#E2E2E2] focus-within:border-[#D4B63A] pb-3 transition-colors"
                >
                  <Search size={20} className="text-[#6B6B6B] shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setSearchOpen(false);
                    }}
                    placeholder="Search FGT products"
                    className="flex-1 bg-transparent outline-none font-display text-2xl sm:text-3xl text-[#0D0D0D] placeholder:text-[#B0B0B0] min-w-0"
                  />
                </form>

                <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mt-8 mb-3">
                  Quick Links
                </p>
                <ul className="space-y-2.5">
                  {[
                    { label: "Shop All Products", to: "/store/products" },
                    ...categories.map((c) => ({
                      label: c.name,
                      to: `/store/products?category=${encodeURIComponent(c.name)}`,
                    })),
                    { label: "Request a Quote", to: "/store/quote" },
                  ].map(({ label, to }) => (
                    <li key={label}>
                      <button
                        onClick={() => {
                          navigate(to);
                          setSearchOpen(false);
                        }}
                        className="group flex items-center gap-3 font-display font-semibold text-[#0D0D0D] hover:text-[#856A00] transition-colors"
                      >
                        <ArrowRight
                          size={13}
                          className="text-[#B0B0B0] group-hover:text-[#856A00] transition-colors"
                        />
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
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
