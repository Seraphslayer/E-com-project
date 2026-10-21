import { useNavigate } from 'react-router-dom'
import { ShoppingBag, LayoutDashboard, ArrowRight, Package, CreditCard, MessageSquare, Star, QrCode, BookOpen, Truck, BarChart2 } from 'lucide-react'

const services = [
  { icon: ShoppingBag, label: 'Cart & Checkout' },
  { icon: CreditCard, label: 'Payments' },
  { icon: Package, label: 'Inventory' },
  { icon: Truck, label: 'Orders' },
  { icon: QrCode, label: 'QR & Barcodes' },
  { icon: MessageSquare, label: 'Live Chat' },
  { icon: BookOpen, label: 'Microblog' },
  { icon: Star, label: 'Reviews' },
  { icon: BarChart2, label: 'Analytics' },
]

export default function RoleSelect() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#0047FF] flex items-center justify-center">
            <span className="font-display font-bold text-white text-sm">F</span>
          </div>
          <span className="font-display font-semibold text-white tracking-tight text-lg">FGT Trading OPC</span>
        </div>
        <span className="font-mono text-[11px] text-white/30 tracking-widest uppercase">v2.4.1</span>
      </header>

      <div className="flex-1 grid lg:grid-cols-2">
        {/* Left — Customer */}
        <button
          onClick={() => navigate('/store')}
          className="group relative flex flex-col justify-between p-12 border-r border-white/10 hover:bg-[#0047FF] transition-colors duration-300 text-left"
        >
          <div>
            <div className="w-12 h-12 border border-white/20 group-hover:border-white/0 flex items-center justify-center mb-10 transition-colors">
              <ShoppingBag size={22} className="text-white/60 group-hover:text-white transition-colors" />
            </div>
            <p className="font-mono text-[11px] text-white/30 group-hover:text-white/50 tracking-widest uppercase mb-3 transition-colors">Portal 01</p>
            <h2 className="font-display font-bold text-5xl text-white leading-none tracking-tight mb-4">Customer<br />Storefront</h2>
            <p className="text-white/40 group-hover:text-white/70 text-sm leading-relaxed max-w-xs transition-colors">
              Browse products, manage your cart, track orders, join the community, and chat with support.
            </p>
          </div>
          <div className="flex items-center gap-2 text-white/30 group-hover:text-white transition-colors">
            <span className="font-mono text-xs tracking-widest uppercase">Enter Store</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Right — Admin */}
        <button
          onClick={() => navigate('/admin')}
          className="group relative flex flex-col justify-between p-12 hover:bg-[#111] transition-colors duration-300 text-left"
        >
          <div>
            <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-10">
              <LayoutDashboard size={22} className="text-white/60 group-hover:text-white transition-colors" />
            </div>
            <p className="font-mono text-[11px] text-white/30 group-hover:text-white/50 tracking-widest uppercase mb-3 transition-colors">Portal 02</p>
            <h2 className="font-display font-bold text-5xl text-white leading-none tracking-tight mb-4">Admin<br />Portal</h2>
            <p className="text-white/40 group-hover:text-white/70 text-sm leading-relaxed max-w-xs transition-colors">
              Manage inventory, process orders, monitor payments, print QR labels, and review analytics.
            </p>
          </div>
          <div className="flex items-center gap-2 text-white/30 group-hover:text-white transition-colors">
            <span className="font-mono text-xs tracking-widest uppercase">Enter Admin</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Bottom microservices bar */}
      <div className="border-t border-white/10 px-8 py-4">
        <div className="flex items-center gap-1 flex-wrap">
          <span className="font-mono text-[10px] text-white/20 tracking-widest uppercase mr-4">Services</span>
          {services.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 mr-1 mb-1">
              <Icon size={11} className="text-white/30" />
              <span className="font-mono text-[10px] text-white/30 tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
