import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Star, ShoppingCart, Check, SlidersHorizontal, ArrowRight, Heart, MessageCircle } from 'lucide-react'
import { products, blogPosts, Product } from '../../data/mockData'
import { useCart } from '../../store/cartStore'
import ReviewsPanel from '../../components/ReviewsPanel'

const categories = ['All', 'Electronics', 'Accessories', 'Apparel', 'Kitchen', 'Sports']
const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Best Rated', 'Most Reviews']

const categoryTiles = [
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop&auto=format' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop&auto=format' },
  { name: 'Apparel', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&auto=format' },
  { name: 'Kitchen', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&auto=format' },
  { name: 'Sports', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop&auto=format' },
]

const communityShots = [
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop&auto=format',
]

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
  const [searchParams] = useSearchParams()
  const paramCategory = searchParams.get('category')
  const [category, setCategory] = useState(
    paramCategory && categories.includes(paramCategory) ? paramCategory : 'All'
  )
  const [sort, setSort] = useState('Featured')
  const [showReviews, setShowReviews] = useState(false)

  // Keep the shop in sync when a mega-menu link (or any other page) sends
  // us here with a ?category= param, e.g. /store?category=Electronics
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat && categories.includes(cat)) {
      setCategory(cat)
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [searchParams])

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
    <div>
      {/* ---- Hero ---- */}
      <section className="relative bg-[#0D0D0D] overflow-hidden" style={{ minHeight: 420 }}>
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=800&fit=crop&auto=format"
          alt="Store banner"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center" style={{ minHeight: 420 }}>
          <div className="py-16 max-w-xl">
            <p className="font-mono text-[11px] text-white/50 tracking-widest uppercase mb-3">SS26 Collection · Week 2</p>
            <h1 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight leading-[1.05] mb-4">
              Designed to last.<br />Priced to move.
            </h1>
            <p className="text-white/60 text-sm sm:text-base max-w-sm mb-8 leading-relaxed">
              Electronics, apparel, and everyday essentials curated for the modern buyer — up to 30% off this week.
            </p>
            <div className="flex items-center gap-3">
              <a href="#products" className="bg-[#0047FF] text-white font-mono text-xs tracking-wide px-6 py-3 hover:bg-[#0035CC] transition-colors">
                SHOP NOW
              </a>
              <a href="#products" className="border border-white/30 text-white font-mono text-xs tracking-wide px-6 py-3 hover:border-white transition-colors">
                VIEW DEALS
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {/* ---- Category grid ---- */}
        <section className="py-14">
          <h2 className="font-display font-bold text-2xl text-[#0D0D0D] tracking-tight mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoryTiles.map(tile => (
              <button
                key={tile.name}
                onClick={() => {
                  setCategory(tile.name)
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="group text-left"
              >
                <div className="aspect-square overflow-hidden bg-[#F5F5F5] mb-3">
                  <img
                    src={tile.image}
                    alt={tile.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="font-display font-semibold text-sm text-[#0D0D0D] group-hover:text-[#0047FF] transition-colors">
                  {tile.name}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* ---- Finder banner ---- */}
        <section className="relative mb-14 overflow-hidden" style={{ minHeight: 220 }}>
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=500&fit=crop&auto=format"
            alt="Product finder"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent" />
          <div className="relative z-10 px-8 sm:px-12 py-14 max-w-md">
            <h3 className="font-display font-bold text-2xl text-[#0D0D0D] tracking-tight mb-2">Fit Finder</h3>
            <p className="text-[#6B6B6B] text-sm mb-6">Answer three quick questions and we'll match you to the right gear.</p>
            <button className="bg-[#0D0D0D] text-white font-mono text-xs tracking-wide px-6 py-3 hover:bg-[#0047FF] transition-colors flex items-center gap-2">
              GO TO FINDER <ArrowRight size={13} />
            </button>
          </div>
        </section>

        {/* ---- Products ---- */}
        <section id="products" className="py-4 scroll-mt-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl text-[#0D0D0D] tracking-tight">All Products</h2>
            <Link
              to="/store/products"
              className="font-mono text-xs text-[#6B6B6B] hover:text-[#0047FF] transition-colors underline underline-offset-2"
            >
              View all →
            </Link>
          </div>

          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-1 flex-wrap">
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
        </section>

        {/* ---- Community showcase ---- */}
        <section className="py-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl text-[#0D0D0D] tracking-tight">Community Showcase</h2>
            <Link to="/store/community" className="font-mono text-xs text-[#6B6B6B] hover:text-[#0047FF] transition-colors underline underline-offset-2">
              View all
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-thin">
            {communityShots.map((src, i) => (
              <div key={i} className="shrink-0 w-48 sm:w-56 aspect-[4/5] overflow-hidden bg-[#F5F5F5]">
                <img src={src} alt="Community post" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </section>

        {/* ---- Trust / signature section ---- */}
        <section className="py-14 grid md:grid-cols-2 gap-10 items-center">
          <div className="aspect-[4/3] overflow-hidden bg-[#F5F5F5] order-2 md:order-1">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&auto=format"
              alt="Trusted by customers"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0D0D0D] tracking-tight mb-4">
              Trusted by 50,000+ Customers
            </h2>
            <p className="text-[#6B6B6B] text-sm leading-relaxed mb-6 max-w-md">
              Every product on MERX is vetted for build quality and backed by our 30-day
              no-questions returns policy. Free shipping on orders over $75, and carbon-neutral
              delivery on every order.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6 max-w-md">
              <div>
                <p className="font-display font-bold text-xl text-[#0D0D0D]">4.8★</p>
                <p className="font-mono text-[10px] text-[#6B6B6B] tracking-wide uppercase">Avg. Rating</p>
              </div>
              <div>
                <p className="font-display font-bold text-xl text-[#0D0D0D]">30d</p>
                <p className="font-mono text-[10px] text-[#6B6B6B] tracking-wide uppercase">Free Returns</p>
              </div>
              <div>
                <p className="font-display font-bold text-xl text-[#0D0D0D]">50k+</p>
                <p className="font-mono text-[10px] text-[#6B6B6B] tracking-wide uppercase">Customers</p>
              </div>
            </div>
            <button
              onClick={() => setShowReviews(true)}
              className="bg-[#0D0D0D] text-white font-mono text-xs tracking-wide px-6 py-3 hover:bg-[#0047FF] transition-colors"
            >
              READ REVIEWS
            </button>
          </div>
        </section>

        {/* ---- Blog / journal ---- */}
        <section className="py-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl text-[#0D0D0D] tracking-tight">From the Journal</h2>
            <Link to="/store/community" className="font-mono text-xs text-[#6B6B6B] hover:text-[#0047FF] transition-colors underline underline-offset-2">
              View all
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map(post => (
              <Link to="/store/community" key={post.id} className="group block">
                <div className="aspect-video overflow-hidden bg-[#F5F5F5] mb-3">
                  <img
                    src={post.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop&auto=format'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="font-mono text-[10px] text-[#0047FF] tracking-widest uppercase mb-1.5">{post.category}</p>
                <h3 className="font-display font-semibold text-[#0D0D0D] leading-snug mb-2 group-hover:text-[#0047FF] transition-colors">
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
  )
}
