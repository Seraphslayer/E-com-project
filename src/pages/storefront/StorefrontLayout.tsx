import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, Package, Users, ArrowLeft, ShoppingCart, Search, Cpu } from 'lucide-react'
import { useCart } from '../../store/cartStore'
import ChatWidget from '../../components/ChatWidget'
import PromoBar from '../../components/PromoBar'
import Footer from '../../components/Footer'
import { AllProductsMenu, CategoryMenu } from '../../components/MegaMenu'

const navItems = [
  { to: '/store/orders', label: 'Orders', icon: Package },
  { to: '/store/community', label: 'Community', icon: Users },
]

type ActiveMenu = 'all' | 'electronics' | null

export default function StorefrontLayout() {
  const navigate = useNavigate()
  const { count } = useCart()
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null)

  const handleMenuNavigate = (path: string) => {
    navigate(path)
    setActiveMenu(null)
  }

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
              onClick={() => navigate('/')}
              className="hidden lg:flex items-center gap-1.5 text-[#6B6B6B] hover:text-[#0D0D0D] transition-colors"
            >
              <ArrowLeft size={14} />
              <span className="font-mono text-[11px] tracking-widest uppercase">Exit</span>
            </button>
            <div className="hidden lg:block w-px h-4 bg-[#E2E2E2]" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#0047FF] flex items-center justify-center">
                <span className="font-display font-bold text-white text-sm">M</span>
              </div>
              <span className="font-display font-semibold text-lg text-[#0D0D0D] tracking-tight">MERX</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 shrink-0">
            <NavLink
              to="/store"
              end
              onMouseEnter={() => setActiveMenu('all')}
              className={({ isActive }) =>
                `relative flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  isActive || activeMenu === 'all'
                    ? 'text-[#0047FF] font-medium'
                    : 'text-[#6B6B6B] hover:text-[#0D0D0D]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <ShoppingBag size={14} />
                  <span className="font-sans">Shop</span>
                  {(isActive || activeMenu === 'all') && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0047FF]" />
                  )}
                </>
              )}
            </NavLink>

            <button
              onMouseEnter={() => setActiveMenu('electronics')}
              onClick={() => handleMenuNavigate('/store/products?category=Electronics')}
              className={`relative flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                activeMenu === 'electronics' ? 'text-[#0047FF] font-medium' : 'text-[#6B6B6B] hover:text-[#0D0D0D]'
              }`}
            >
              <Cpu size={14} />
              <span className="font-sans">Electronics</span>
              {activeMenu === 'electronics' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0047FF]" />
              )}
            </button>

            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onMouseEnter={() => setActiveMenu(null)}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'text-[#0047FF] font-medium'
                      : 'text-[#6B6B6B] hover:text-[#0D0D0D]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={14} />
                    <span className="font-sans">{label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0047FF]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex-1 max-w-md ml-auto">
            <div className="flex items-center gap-2 border border-[#E2E2E2] bg-[#F5F5F5] px-3 h-9 focus-within:border-[#0047FF] transition-colors">
              <Search size={14} className="text-[#6B6B6B] shrink-0" />
              <input
                type="text"
                placeholder="Search products…"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-[#9B9B9B] min-w-0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <NavLink
              to="/store/cart"
              onMouseEnter={() => setActiveMenu(null)}
              className={({ isActive }) =>
                `relative w-9 h-9 flex items-center justify-center transition-colors ${
                  isActive ? 'text-[#0047FF]' : 'text-[#6B6B6B] hover:text-[#0D0D0D]'
                }`
              }
            >
              <ShoppingCart size={17} />
              {count > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#0047FF] text-white font-mono text-[10px] flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </NavLink>
            <div className="w-px h-5 bg-[#E2E2E2]" />
            <div className="w-7 h-7 bg-[#F0F0F0] flex items-center justify-center text-xs font-mono text-[#0D0D0D] shrink-0">
              EV
            </div>
          </div>
        </div>

        {activeMenu === 'all' && <AllProductsMenu onNavigate={handleMenuNavigate} />}
        {activeMenu === 'electronics' && (
          <CategoryMenu category="Electronics" onNavigate={handleMenuNavigate} />
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <ChatWidget />
    </div>
  )
}
