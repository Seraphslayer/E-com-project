import { useState } from 'react'
import { Star, ShoppingCart, Check, SlidersHorizontal } from 'lucide-react'
import { products, Product } from '../../data/mockData'
import { useCart } from '../../store/cartStore'
import ReviewsPanel from '../../components/ReviewsPanel'

const categories = ['All', 'Electronics', 'Accessories', 'Apparel', 'Kitchen', 'Sports']
const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Best Rated', 'Most Reviews']

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <Star
          key={n}
          size={11}
          className={n <= Math.round(rating) ? 'text-[#FF8C00] fill-[#FF8C00]' : 'text-[#D0D0D0]'}
        />
      ))}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
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
        <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1">{product.brand}</p>
        <h3 className="font-display font-semibold text-[#0D0D0D] text-sm leading-snug mb-2">{product.name}</h3>

        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
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
              added || inCart
                ? 'bg-[#00875A] text-white'
                : 'bg-[#0047FF] text-white hover:bg-[#0035CC]'
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

export default function Shop() {
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('Featured')
  const [showReviews, setShowReviews] = useState(false)

  const filtered = products
    .filter(p => category === 'All' || p.category === category)
    .sort((a, b) => {
      if (sort === 'Price: Low to High') return a.price - b.price
      if (sort === 'Price: High to Low') return b.price - a.price
      if (sort === 'Best Rated') return b.rating - a.rating
      if (sort === 'Most Reviews') return b.reviews - a.reviews
      return 0
    })

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Hero banner */}
      <div className="relative bg-[#0D0D0D] mb-8 overflow-hidden" style={{ minHeight: 200 }}>
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&h=300&fit=crop&auto=format"
          alt="Store banner"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 px-10 py-12">
          <p className="font-mono text-[11px] text-white/40 tracking-widest uppercase mb-2">SS26 Collection</p>
          <h1 className="font-display font-bold text-4xl text-white tracking-tight leading-none mb-3">
            Designed to last.<br />Priced to move.
          </h1>
          <p className="text-white/50 text-sm max-w-sm">Electronics, apparel, and everyday essentials curated for the modern buyer.</p>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 font-mono text-xs tracking-wide transition-colors ${
                category === cat
                  ? 'bg-[#0D0D0D] text-white'
                  : 'bg-white border border-[#E2E2E2] text-[#6B6B6B] hover:border-[#0D0D0D] hover:text-[#0D0D0D]'
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
              showReviews ? 'border-[#0047FF] text-[#0047FF] bg-[#0047FF]/5' : 'border-[#E2E2E2] text-[#6B6B6B] hover:border-[#0D0D0D]'
            }`}
          >
            <Star size={12} />
            Reviews
          </button>
          <div className="flex items-center gap-2 border border-[#E2E2E2] px-3 py-1.5">
            <SlidersHorizontal size={12} className="text-[#6B6B6B]" />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="font-mono text-xs text-[#0D0D0D] bg-transparent border-none outline-none cursor-pointer"
            >
              {sortOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className={`grid gap-6 ${showReviews ? 'lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'}`}>
        {showReviews ? (
          <>
            <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-start">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <div>
              <ReviewsPanel />
            </div>
          </>
        ) : (
          filtered.map(p => <ProductCard key={p.id} product={p} />)
        )}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-[#6B6B6B]">
          <p className="font-mono text-sm">No products in this category.</p>
        </div>
      )}
    </div>
  )
}
