import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Star,
  ShoppingCart,
  Check,
  SlidersHorizontal,
  Grid3x3,
  List,
  ChevronDown,
  ChevronRight,
  X,
  Wifi,
  Volume2,
  ShieldCheck,
  Leaf,
  Droplets,
  BatteryFull,
  Sparkles,
  Tag as TagIcon,
} from 'lucide-react'
import { products, Product } from '../../data/mockData'
import { useCart } from '../../store/cartStore'
import { megaCategoryTiles } from '../../components/MegaMenu'

const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Best Rated', 'Most Reviews']

const priceBuckets = [
  { label: 'Under $50', test: (p: number) => p < 50 },
  { label: '$50 – $150', test: (p: number) => p >= 50 && p < 150 },
  { label: '$150 – $300', test: (p: number) => p >= 150 && p < 300 },
  { label: '$300+', test: (p: number) => p >= 300 },
]

const ratingBuckets = [4.5, 4, 3.5]

// Small icon lookup for the feature-tag row under each card — falls back to a
// generic tag icon for anything not explicitly mapped. This is presentation
// only; it reads directly from each product's own `tags` field.
const tagIcons: Record<string, typeof TagIcon> = {
  wireless: Wifi,
  bluetooth: Wifi,
  'noise-cancelling': Volume2,
  premium: ShieldCheck,
  sustainable: Leaf,
  eco: Leaf,
  waterproof: Droplets,
  'BPA-free': Droplets,
  insulated: BatteryFull,
  handmade: Sparkles,
}

function FeatureTag({ tag }: { tag: string }) {
  const Icon = tagIcons[tag] ?? TagIcon
  return (
    <span className="flex items-center gap-1 font-mono text-[9px] text-[#6B6B6B] tracking-wide uppercase">
      <Icon size={11} />
      {tag}
    </span>
  )
}

function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-[#E2E2E2] py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between font-mono text-[11px] tracking-widest uppercase text-[#0D0D0D] mb-1"
      >
        {title}
        <ChevronDown size={13} className={`text-[#6B6B6B] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pt-2 space-y-2">{children}</div>}
    </div>
  )
}

function CheckboxRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string
  count: number
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex items-center justify-between gap-2 cursor-pointer group">
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-3.5 h-3.5 accent-[#0047FF]"
        />
        <span className="font-sans text-sm text-[#0D0D0D] group-hover:text-[#0047FF] transition-colors">
          {label}
        </span>
      </span>
      <span className="font-mono text-[10px] text-[#6B6B6B]">({count})</span>
    </label>
  )
}

function ProductGridCard({ product, view }: { product: Product; view: 'grid' | 'list' }) {
  const { addToCart, cart } = useCart()
  const [added, setAdded] = useState(false)
  const inCart = cart.some(i => i.product.id === product.id)

  const handleAdd = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  if (view === 'list') {
    return (
      <div className="group flex gap-5 bg-white border border-[#E2E2E2] hover:border-[#0047FF] transition-colors duration-200 p-4">
        <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden bg-[#F5F5F5]">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {discount && (
            <div className="absolute top-2 left-2 bg-[#FF3B00] text-white font-mono text-[10px] px-1.5 py-0.5">
              −{discount}%
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1">{product.brand}</p>
          <h3 className="font-display font-semibold text-[#0D0D0D] text-base leading-snug mb-1.5">{product.name}</h3>
          <div className="flex flex-wrap gap-3 mb-2">
            {product.tags.slice(0, 4).map(t => <FeatureTag key={t} tag={t} />)}
          </div>
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-[#0D0D0D] text-lg">${product.price}</span>
              {product.originalPrice && (
                <span className="font-sans text-sm text-[#B0B0B0] line-through">${product.originalPrice}</span>
              )}
            </div>
            <button
              onClick={handleAdd}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono tracking-wide transition-colors ${
                added || inCart ? 'bg-[#00875A] text-white' : 'bg-[#0047FF] text-white hover:bg-[#0035CC]'
              }`}
            >
              {added ? <Check size={12} /> : <ShoppingCart size={12} />}
              {added ? 'Added' : inCart ? 'In Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group bg-white border border-[#E2E2E2] hover:border-[#0047FF] transition-colors duration-200">
      <div className="relative overflow-hidden bg-[#F5F5F5] aspect-square">
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
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-3 mb-2.5 min-h-[13px]">
          {product.tags.slice(0, 3).map(t => <FeatureTag key={t} tag={t} />)}
        </div>
        <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1">{product.brand}</p>
        <h3 className="font-display font-semibold text-[#0D0D0D] text-sm leading-snug mb-2">{product.name}</h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(n => (
              <Star key={n} size={11} className={n <= Math.round(product.rating) ? 'text-[#FF8C00] fill-[#FF8C00]' : 'text-[#D0D0D0]'} />
            ))}
          </div>
          <span className="font-mono text-[10px] text-[#6B6B6B]">{product.rating} ({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-[#0D0D0D] text-lg">${product.price}</span>
            {product.originalPrice && (
              <span className="font-sans text-sm text-[#B0B0B0] line-through">${product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono tracking-wide transition-colors ${
              added || inCart ? 'bg-[#00875A] text-white' : 'bg-[#0047FF] text-white hover:bg-[#0035CC]'
            }`}
          >
            {added ? <Check size={12} /> : <ShoppingCart size={12} />}
            {added ? 'Added' : inCart ? 'In Cart' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}

const PAGE_SIZE = 8

export default function AllProductsPage() {
  const [searchParams] = useSearchParams()
  const paramCategory = searchParams.get('category')

  const allCategories = useMemo(() => Array.from(new Set(products.map(p => p.category))).sort(), [])
  const allBrands = useMemo(() => Array.from(new Set(products.map(p => p.brand))).sort(), [])

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    paramCategory && allCategories.includes(paramCategory) ? [paramCategory] : []
  )
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedPriceBuckets, setSelectedPriceBuckets] = useState<string[]>([])
  const [minRating, setMinRating] = useState<number | null>(null)
  const [sort, setSort] = useState('Featured')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const toggle = (list: string[], value: string, setter: (v: string[]) => void) => {
    setter(list.includes(value) ? list.filter(v => v !== value) : [...list, value])
    setVisibleCount(PAGE_SIZE)
  }

  const categoryCounts = useMemo(
    () => Object.fromEntries(allCategories.map(c => [c, products.filter(p => p.category === c).length])),
    [allCategories]
  )
  const brandCounts = useMemo(
    () => Object.fromEntries(allBrands.map(b => [b, products.filter(p => p.brand === b).length])),
    [allBrands]
  )
  const priceCounts = useMemo(
    () => priceBuckets.map(b => ({ ...b, count: products.filter(p => b.test(p.price)).length })),
    []
  )
  const ratingCounts = useMemo(
    () => ratingBuckets.map(r => ({ rating: r, count: products.filter(p => p.rating >= r).length })),
    []
  )

  const filtered = useMemo(() => {
    return products
      .filter(p => selectedCategories.length === 0 || selectedCategories.includes(p.category))
      .filter(p => selectedBrands.length === 0 || selectedBrands.includes(p.brand))
      .filter(
        p =>
          selectedPriceBuckets.length === 0 ||
          priceBuckets.some(b => selectedPriceBuckets.includes(b.label) && b.test(p.price))
      )
      .filter(p => minRating === null || p.rating >= minRating)
      .sort((a, b) => {
        if (sort === 'Price: Low to High') return a.price - b.price
        if (sort === 'Price: High to Low') return b.price - a.price
        if (sort === 'Best Rated') return b.rating - a.rating
        if (sort === 'Most Reviews') return b.reviews - a.reviews
        return 0
      })
  }, [selectedCategories, selectedBrands, selectedPriceBuckets, minRating, sort])

  const visible = filtered.slice(0, visibleCount)
  const activeFilterCount =
    selectedCategories.length + selectedBrands.length + selectedPriceBuckets.length + (minRating ? 1 : 0)

  const clearAll = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedPriceBuckets([])
    setMinRating(null)
    setVisibleCount(PAGE_SIZE)
  }

  const Sidebar = (
    <div>
      {activeFilterCount > 0 && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-[#0047FF] hover:text-[#0035CC] mb-3"
        >
          <X size={12} /> Clear all filters ({activeFilterCount})
        </button>
      )}

      <FilterSection title="Category">
        {allCategories.map(c => (
          <CheckboxRow
            key={c}
            label={c}
            count={categoryCounts[c]}
            checked={selectedCategories.includes(c)}
            onChange={() => toggle(selectedCategories, c, setSelectedCategories)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Brand">
        {allBrands.map(b => (
          <CheckboxRow
            key={b}
            label={b}
            count={brandCounts[b]}
            checked={selectedBrands.includes(b)}
            onChange={() => toggle(selectedBrands, b, setSelectedBrands)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Price">
        {priceCounts.map(({ label, count }) => (
          <CheckboxRow
            key={label}
            label={label}
            count={count}
            checked={selectedPriceBuckets.includes(label)}
            onChange={() => toggle(selectedPriceBuckets, label, setSelectedPriceBuckets)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Rating" defaultOpen={false}>
        {ratingCounts.map(({ rating, count }) => (
          <label key={rating} className="flex items-center justify-between gap-2 cursor-pointer group">
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="rating"
                checked={minRating === rating}
                onChange={() => {
                  setMinRating(minRating === rating ? null : rating)
                  setVisibleCount(PAGE_SIZE)
                }}
                className="w-3.5 h-3.5 accent-[#0047FF]"
              />
              <span className="flex items-center gap-1 font-sans text-sm text-[#0D0D0D] group-hover:text-[#0047FF] transition-colors">
                {rating}<Star size={11} className="text-[#FF8C00] fill-[#FF8C00]" /> &amp; up
              </span>
            </span>
            <span className="font-mono text-[10px] text-[#6B6B6B]">({count})</span>
          </label>
        ))}
      </FilterSection>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Breadcrumb + title */}
      <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#6B6B6B] tracking-wide mb-2">
        <Link to="/store" className="hover:text-[#0047FF] transition-colors">Store</Link>
        <ChevronRight size={11} />
        <span className="text-[#0D0D0D]">All Products</span>
      </div>
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl text-[#0D0D0D] tracking-tight">All Products</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">{filtered.length} products</p>
      </div>

      {/* Category icon strip */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 mb-8 -mx-1 px-1">
        <button
          onClick={() => { setSelectedCategories([]); setVisibleCount(PAGE_SIZE) }}
          className="shrink-0 text-center group"
        >
          <div
            className={`w-16 h-16 flex items-center justify-center bg-[#F5F5F5] mb-2 border-2 transition-colors ${
              selectedCategories.length === 0 ? 'border-[#0047FF]' : 'border-transparent group-hover:border-[#D0D0D0]'
            }`}
          >
            <Grid3x3 size={20} className="text-[#6B6B6B]" />
          </div>
          <p className={`font-mono text-[10px] tracking-wide ${selectedCategories.length === 0 ? 'text-[#0047FF]' : 'text-[#6B6B6B]'}`}>All</p>
        </button>
        {megaCategoryTiles.map(tile => {
          const isActive = selectedCategories.length === 1 && selectedCategories[0] === tile.name
          return (
            <button
              key={tile.name}
              onClick={() => { setSelectedCategories([tile.name]); setVisibleCount(PAGE_SIZE) }}
              className="shrink-0 text-center group"
            >
              <div
                className={`w-16 h-16 overflow-hidden bg-[#F5F5F5] mb-2 border-2 transition-colors ${
                  isActive ? 'border-[#0047FF]' : 'border-transparent group-hover:border-[#D0D0D0]'
                }`}
              >
                <img src={tile.image} alt={tile.name} className="w-full h-full object-cover" />
              </div>
              <p className={`font-mono text-[10px] tracking-wide ${isActive ? 'text-[#0047FF]' : 'text-[#6B6B6B]'}`}>{tile.name}</p>
            </button>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block">{Sidebar}</aside>

        <div>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-[#E2E2E2] px-3 py-2 font-mono text-xs tracking-wide text-[#0D0D0D] hover:border-[#0D0D0D] transition-colors"
            >
              <SlidersHorizontal size={13} /> Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </button>

            <div className="flex items-center gap-3 ml-auto">
              <div className="flex items-center gap-2 border border-[#E2E2E2] px-3 py-1.5">
                <span className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase">Sort</span>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="font-mono text-xs text-[#0D0D0D] bg-transparent border-none outline-none cursor-pointer"
                >
                  {sortOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="flex border border-[#E2E2E2]">
                <button
                  onClick={() => setView('grid')}
                  aria-label="Grid view"
                  className={`w-8 h-8 flex items-center justify-center transition-colors ${view === 'grid' ? 'bg-[#0D0D0D] text-white' : 'text-[#6B6B6B] hover:text-[#0D0D0D]'}`}
                >
                  <Grid3x3 size={13} />
                </button>
                <button
                  onClick={() => setView('list')}
                  aria-label="List view"
                  className={`w-8 h-8 flex items-center justify-center transition-colors border-l border-[#E2E2E2] ${view === 'list' ? 'bg-[#0D0D0D] text-white' : 'text-[#6B6B6B] hover:text-[#0D0D0D]'}`}
                >
                  <List size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Active filter pills */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {selectedCategories.map(c => (
                <button
                  key={c}
                  onClick={() => toggle(selectedCategories, c, setSelectedCategories)}
                  className="flex items-center gap-1.5 border border-[#0047FF] text-[#0047FF] px-2.5 py-1 font-mono text-[11px] tracking-wide"
                >
                  {c} <X size={10} />
                </button>
              ))}
              {selectedBrands.map(b => (
                <button
                  key={b}
                  onClick={() => toggle(selectedBrands, b, setSelectedBrands)}
                  className="flex items-center gap-1.5 border border-[#0047FF] text-[#0047FF] px-2.5 py-1 font-mono text-[11px] tracking-wide"
                >
                  {b} <X size={10} />
                </button>
              ))}
              {selectedPriceBuckets.map(p => (
                <button
                  key={p}
                  onClick={() => toggle(selectedPriceBuckets, p, setSelectedPriceBuckets)}
                  className="flex items-center gap-1.5 border border-[#0047FF] text-[#0047FF] px-2.5 py-1 font-mono text-[11px] tracking-wide"
                >
                  {p} <X size={10} />
                </button>
              ))}
              {minRating && (
                <button
                  onClick={() => setMinRating(null)}
                  className="flex items-center gap-1.5 border border-[#0047FF] text-[#0047FF] px-2.5 py-1 font-mono text-[11px] tracking-wide"
                >
                  {minRating}★ &amp; up <X size={10} />
                </button>
              )}
            </div>
          )}

          {/* Product grid / list */}
          {visible.length > 0 ? (
            <div className={view === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
              {visible.map(p => <ProductGridCard key={p.id} product={p} view={view} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-[#6B6B6B] border border-dashed border-[#E2E2E2]">
              <p className="font-mono text-sm">No products match these filters.</p>
              <button onClick={clearAll} className="mt-3 font-mono text-xs text-[#0047FF] hover:underline">
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {visible.length > 0 && (
            <div className="mt-10 text-center">
              <p className="font-mono text-[11px] text-[#6B6B6B] tracking-wide mb-4">
                Showing {visible.length} of {filtered.length}
              </p>
              {visibleCount < filtered.length && (
                <button
                  onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
                  className="border border-[#0D0D0D] px-6 py-2.5 font-mono text-xs tracking-widest uppercase hover:bg-[#0D0D0D] hover:text-white transition-colors"
                >
                  Show More
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[11px] tracking-widest uppercase text-[#0D0D0D]">Filters</p>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X size={18} className="text-[#6B6B6B]" />
              </button>
            </div>
            {Sidebar}
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full mt-4 bg-[#0047FF] text-white py-3 font-mono text-xs tracking-widest uppercase"
            >
              Show {filtered.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
