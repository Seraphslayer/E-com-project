import {
  Truck,
  Tag,
  Star,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Radio,
  Camera,
  Fingerprint,
  Speaker,
  Laptop,
  FileText,
  Wifi,
  BatteryCharging,
  Video,
  KeyRound,
} from "lucide-react";
import { categories } from "../data/companyInfo";

// Category tiles for the mega menu & category strip, keyed to the real
// FGT catalog in src/data/companyInfo.ts. Images are Unsplash placeholders
// pending the client's own product photography.
export const megaCategoryTiles = [
  {
    name: "Land Mobile Communication",
    image:
      "https://images.unsplash.com/photo-1623961990059-28356d8fc3c0?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "CCTV Surveillance",
    image:
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Access Control",
    image:
      "https://images.unsplash.com/photo-1558002038-bb4237b50b3e?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Audio & Visual",
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "IT Equipment",
    image:
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=400&fit=crop&auto=format",
  },
];

const categoryIcons: Record<string, typeof Radio> = {
  "Land Mobile Communication": Radio,
  "CCTV Surveillance": Camera,
  "Access Control": Fingerprint,
  "Audio & Visual": Speaker,
  "IT Equipment": Laptop,
};

const shopByNeed = [
  { icon: Truck, label: "Supply & Delivery" },
  { icon: ShieldCheck, label: "Installation & Commissioning" },
  { icon: Star, label: "Top Rated" },
  { icon: Sparkles, label: "New Arrivals" },
  { icon: Tag, label: "Current Deals" },
  { icon: FileText, label: "Request a Quote" },
];

interface MenuNavProps {
  onNavigate: (path: string) => void;
}

/** Mega menu shown when hovering "Shop" — mirrors Keychron's "All Products" panel. */
export function AllProductsMenu({ onNavigate }: MenuNavProps) {
  return (
    <div className="absolute left-0 right-0 top-full bg-white border-b border-[#E2E2E2] shadow-xl z-50">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-12 gap-10">
        {/* Left — category list */}
        <div className="col-span-3 border-r border-[#E2E2E2] pr-8">
          <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-3">
            Shop By Category
          </p>
          <ul className="space-y-0.5">
            {megaCategoryTiles.map((c) => {
              const Icon = categoryIcons[c.name] ?? Radio;
              return (
                <li key={c.name}>
                  <button
                    onClick={() => onNavigate(`/store/products?category=${encodeURIComponent(c.name)}`)}
                    className="w-full flex items-center gap-3 px-2 py-2 text-left hover:bg-[#F5F5F5] transition-colors group"
                  >
                    <span className="w-8 h-8 bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-[#6B6B6B] group-hover:text-[#0047FF] transition-colors" />
                    </span>
                    <span className="font-sans text-sm text-[#0D0D0D] group-hover:text-[#0047FF] transition-colors">
                      {c.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 pt-4 border-t border-[#E2E2E2] space-y-0.5">
            {["New Arrivals", "Best Sellers", "Current Deals"].map((l) => (
              <button
                key={l}
                onClick={() => onNavigate("/store/products")}
                className="w-full text-left px-2 py-1.5 font-mono text-xs tracking-wide text-[#6B6B6B] hover:text-[#0047FF] transition-colors"
              >
                {l}
              </button>
            ))}
            <button
              onClick={() => onNavigate("/store/quote")}
              className="w-full text-left px-2 py-1.5 font-mono text-xs tracking-wide text-[#0047FF] hover:underline"
            >
              Request a Quote →
            </button>
          </div>
        </div>

        {/* Right — visual category grid + shop-by-need tags */}
        <div className="col-span-9">
          <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-3">
            Browse Categories
          </p>
          <div className="grid grid-cols-5 gap-4 mb-7">
            {megaCategoryTiles.map((c) => (
              <button
                key={c.name}
                onClick={() => onNavigate(`/store/products?category=${encodeURIComponent(c.name)}`)}
                className="group text-left"
              >
                <div className="aspect-square overflow-hidden bg-[#F5F5F5] mb-2">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="font-display font-semibold text-sm text-[#0D0D0D] group-hover:text-[#0047FF] transition-colors leading-snug">
                  {c.name}
                </p>
              </button>
            ))}
          </div>

          <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-3">
            Shop By Need
          </p>
          <div className="grid grid-cols-3 gap-x-8 gap-y-3">
            {shopByNeed.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() =>
                  onNavigate(label === "Request a Quote" ? "/store/quote" : "/store/products")
                }
                className="flex items-center gap-2.5 text-left hover:text-[#0047FF] transition-colors"
              >
                <Icon size={15} className="text-[#6B6B6B]" />
                <span className="font-sans text-sm text-[#0D0D0D]">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const categorySubmenus: Record<string, string[]> = {
  "Land Mobile Communication": [
    "All Land Mobile Communication",
    "Portable & Mobile Radios",
    "Base Stations",
    "Repeater Systems",
    "Trunked Networks",
    "Dispatch Consoles",
  ],
  "CCTV Surveillance": [
    "All CCTV Surveillance",
    "Home & Building Cameras",
    "Bank & Factory Systems",
    "Vehicle Monitoring",
    "City Road Monitoring",
    "NVRs & Recorders",
  ],
  "Access Control": [
    "All Access Control",
    "Office & Building Access",
    "Factory Access",
    "Residential Card Systems",
    "Turnstiles & Gates",
  ],
  "Audio & Visual": [
    "All Audio & Visual",
    "PA & Conference Systems",
    "Event Sound Systems",
    "LED Walls & Displays",
    "Digital Signage",
    "Production Equipment",
  ],
  "IT Equipment": [
    "All IT Equipment",
    "Desktops & Laptops",
    "Network Servers",
    "Printers",
    "Power Protection (UPS)",
  ],
};

const quickPicksByCategory: Record<
  string,
  { icon: typeof Wifi; label: string }[][]
> = {
  "Land Mobile Communication": [
    [
      { icon: Radio, label: "VHF / UHF" },
      { icon: Wifi, label: "Trunked / NXDN" },
    ],
    [
      { icon: BatteryCharging, label: "Long Battery Life" },
      { icon: ShieldCheck, label: "IP67 Rated" },
    ],
  ],
  "CCTV Surveillance": [
    [
      { icon: Video, label: "4K / 8MP" },
      { icon: Camera, label: "Night Vision" },
    ],
    [
      { icon: ShieldCheck, label: "Weatherproof" },
      { icon: Wifi, label: "Wireless Camera" },
    ],
  ],
  "Access Control": [
    [
      { icon: Fingerprint, label: "Biometric" },
      { icon: KeyRound, label: "Card-Based" },
    ],
  ],
  "Audio & Visual": [
    [
      { icon: Speaker, label: "PA Systems" },
      { icon: Video, label: "LED Displays" },
    ],
  ],
  "IT Equipment": [
    [
      { icon: Laptop, label: "Business Laptops" },
      { icon: ShieldCheck, label: "UPS & Power" },
    ],
  ],
};

const defaultQuickPicks = [
  [
    { icon: Star, label: "Top Rated" },
    { icon: Sparkles, label: "New Arrivals" },
  ],
  [
    { icon: Tag, label: "Current Deals" },
    { icon: Truck, label: "Supply & Delivery" },
  ],
];

interface CategoryMenuProps extends MenuNavProps {
  category: string;
}

/** Mega menu shown when hovering a category nav item — mirrors Keychron's "Keyboards" panel. */
export function CategoryMenu({ category, onNavigate }: CategoryMenuProps) {
  const subcategories = categorySubmenus[category] ?? ["New Arrivals", "Best Sellers"];
  const quickPicks = quickPicksByCategory[category] ?? defaultQuickPicks;
  const blurb = categories.find((c) => c.name === category)?.blurb;

  return (
    <div className="absolute left-0 right-0 top-full bg-white border-b border-[#E2E2E2] shadow-xl z-50">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-12 gap-10">
        {/* Left — find-for-me CTA + subcategories */}
        <div className="col-span-3 border-r border-[#E2E2E2] pr-8">
          {blurb && (
            <p className="font-sans text-xs text-[#6B6B6B] leading-relaxed mb-4">{blurb}</p>
          )}
          <button
            onClick={() => onNavigate("/store/quote")}
            className="w-full flex items-center justify-between gap-2 bg-[#F5F5F5] hover:bg-[#EEF2FF] px-4 py-3 mb-4 transition-colors group"
          >
            <span className="font-mono text-xs tracking-wide text-[#0D0D0D] group-hover:text-[#0047FF]">
              Request a Quote
            </span>
            <ArrowRight size={13} className="text-[#6B6B6B] group-hover:text-[#0047FF]" />
          </button>
          <ul className="space-y-0.5">
            {subcategories.map((l) => (
              <li key={l}>
                <button
                  onClick={() => onNavigate(`/store/products?category=${encodeURIComponent(category)}`)}
                  className="w-full text-left px-2 py-1.5 font-sans text-sm text-[#6B6B6B] hover:text-[#0047FF] transition-colors"
                >
                  {l}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — quick-pick filter combos */}
        <div className="col-span-9">
          <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-4">
            Quickly Choose For You
          </p>
          <div className="space-y-1">
            {quickPicks.map((row, i) => (
              <div
                key={i}
                className="flex items-center gap-8 px-4 py-3 hover:bg-[#F8F8F8] transition-colors flex-wrap"
              >
                {row.map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    onClick={() => onNavigate(`/store/products?category=${encodeURIComponent(category)}`)}
                    className="flex items-center gap-2 hover:text-[#0047FF] transition-colors"
                  >
                    <Icon size={14} className="text-[#6B6B6B]" />
                    <span className="font-sans text-sm text-[#0D0D0D]">{label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
