import {
  Truck,
  Tag,
  Star,
  Sparkles,
  Gift,
  Leaf,
  ArrowRight,
  Wifi,
  BatteryCharging,
  Waves,
  Zap,
  ShieldCheck,
  Volume2,
} from "lucide-react";

export const megaCategoryTiles = [
  {
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Apparel",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Kitchen",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Sports",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop&auto=format",
  },
];

const shopByNeed = [
  { icon: Truck, label: "Free Shipping $75+" },
  { icon: Tag, label: "Deals & Clearance" },
  { icon: Star, label: "Top Rated" },
  { icon: Sparkles, label: "New Arrivals" },
  { icon: Gift, label: "Gift Ideas" },
  { icon: Leaf, label: "Sustainable Picks" },
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
            {megaCategoryTiles.map((c) => (
              <li key={c.name}>
                <button
                  onClick={() => onNavigate(`/store/products?category=${c.name}`)}
                  className="w-full flex items-center gap-3 px-2 py-2 text-left hover:bg-[#F5F5F5] transition-colors group"
                >
                  <span className="w-8 h-8 bg-[#F5F5F5] overflow-hidden flex-shrink-0">
                    <img src={c.image} alt="" className="w-full h-full object-cover" />
                  </span>
                  <span className="font-sans text-sm text-[#0D0D0D] group-hover:text-[#0047FF] transition-colors">
                    {c.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-[#E2E2E2] space-y-0.5">
            {["New Arrivals", "Best Sellers", "Deals"].map((l) => (
              <button
                key={l}
                onClick={() => onNavigate("/store/products")}
                className="w-full text-left px-2 py-1.5 font-mono text-xs tracking-wide text-[#6B6B6B] hover:text-[#0047FF] transition-colors"
              >
                {l}
              </button>
            ))}
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
                onClick={() => onNavigate(`/store/products?category=${c.name}`)}
                className="group text-left"
              >
                <div className="aspect-square overflow-hidden bg-[#F5F5F5] mb-2">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="font-display font-semibold text-sm text-[#0D0D0D] group-hover:text-[#0047FF] transition-colors">
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
                onClick={() => onNavigate("/store/products")}
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
  Electronics: [
    "New Arrivals",
    "Headphones & Audio",
    "Speakers",
    "Keyboards & Input",
    "Wearables",
    "Smart Home",
  ],
  Apparel: ["New Arrivals", "Sweaters", "Outerwear", "Basics", "Accessories"],
  Accessories: ["Wallets", "Bags", "Travel", "Everyday Carry"],
  Kitchen: ["Coffee & Brew", "Drinkware", "Cookware"],
  Sports: ["Hydration", "Training", "Outdoor"],
};

const quickPicksByCategory: Record<
  string,
  { icon: typeof Wifi; label: string }[][]
> = {
  Electronics: [
    [
      { icon: Volume2, label: "Noise Cancelling" },
      { icon: Wifi, label: "Wireless" },
    ],
    [
      { icon: BatteryCharging, label: "Long Battery Life" },
      { icon: Waves, label: "Waterproof" },
      { icon: Zap, label: "Fast Charging" },
    ],
    [
      { icon: ShieldCheck, label: "Premium Build" },
      { icon: Star, label: "Top Rated" },
    ],
    [
      { icon: Tag, label: "Under $100" },
      { icon: Sparkles, label: "New This Week" },
    ],
  ],
};

const defaultQuickPicks = [
  [
    { icon: Star, label: "Top Rated" },
    { icon: Sparkles, label: "New Arrivals" },
  ],
  [
    { icon: Tag, label: "On Sale" },
    { icon: Truck, label: "Free Shipping" },
  ],
];

interface CategoryMenuProps extends MenuNavProps {
  category: string;
}

/** Mega menu shown when hovering a category nav item — mirrors Keychron's "Keyboards" panel. */
export function CategoryMenu({ category, onNavigate }: CategoryMenuProps) {
  const subcategories = categorySubmenus[category] ?? ["New Arrivals", "Best Sellers"];
  const quickPicks = quickPicksByCategory[category] ?? defaultQuickPicks;

  return (
    <div className="absolute left-0 right-0 top-full bg-white border-b border-[#E2E2E2] shadow-xl z-50">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-12 gap-10">
        {/* Left — find-for-me CTA + subcategories */}
        <div className="col-span-3 border-r border-[#E2E2E2] pr-8">
          <button
            onClick={() => onNavigate(`/store/products?category=${category}`)}
            className="w-full flex items-center justify-between gap-2 bg-[#F5F5F5] hover:bg-[#EEF2FF] px-4 py-3 mb-4 transition-colors group"
          >
            <span className="font-mono text-xs tracking-wide text-[#0D0D0D] group-hover:text-[#0047FF]">
              Find {category} For Me
            </span>
            <ArrowRight size={13} className="text-[#6B6B6B] group-hover:text-[#0047FF]" />
          </button>
          <ul className="space-y-0.5">
            {subcategories.map((l) => (
              <li key={l}>
                <button
                  onClick={() => onNavigate(`/store/products?category=${category}`)}
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
                    onClick={() => onNavigate(`/store/products?category=${category}`)}
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
