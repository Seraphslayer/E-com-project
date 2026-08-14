import { Package, Truck, CheckCircle, Clock, XCircle, ExternalLink } from 'lucide-react'

type Status = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

const myOrders = [
  { id: 'ORD-20095', date: 'Aug 8, 2026', status: 'processing' as Status, items: [{ name: 'Merx Pro Wireless Headphones', qty: 1, price: 249 }], total: 249 },
  { id: 'ORD-20094', date: 'Aug 6, 2026', status: 'shipped' as Status, items: [{ name: 'Merino Wool Crew Sweater', qty: 1, price: 145 }, { name: 'Canvas Tote Bag', qty: 1, price: 38 }], total: 193, tracking: 'UPS1Z9999W01234567', eta: 'Aug 10, 2026' },
  { id: 'ORD-20091', date: 'Jul 29, 2026', status: 'delivered' as Status, items: [{ name: 'Ceramic Pour-Over Set', qty: 1, price: 64 }], total: 64, deliveredOn: 'Aug 2, 2026' },
  { id: 'ORD-20089', date: 'Jul 20, 2026', status: 'cancelled' as Status, items: [{ name: 'Mechanical Keyboard TKL', qty: 1, price: 189 }], total: 189 },
]

const statusConfig: Record<Status, { icon: any; label: string; color: string; bg: string }> = {
  pending: { icon: Clock, label: 'Pending', color: '#FF8C00', bg: '#FFF3E0' },
  processing: { icon: Package, label: 'Processing', color: '#0047FF', bg: '#EEF2FF' },
  shipped: { icon: Truck, label: 'Shipped', color: '#7C3AED', bg: '#F5F0FF' },
  delivered: { icon: CheckCircle, label: 'Delivered', color: '#00875A', bg: '#E8F5F0' },
  cancelled: { icon: XCircle, label: 'Cancelled', color: '#DC2626', bg: '#FEF2F2' },
}

const steps: Status[] = ['pending', 'processing', 'shipped', 'delivered']

function TrackBar({ status }: { status: Status }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 py-2">
        <XCircle size={14} className="text-[#DC2626]" />
        <span className="font-mono text-[11px] text-[#DC2626] tracking-wide">Order cancelled</span>
      </div>
    )
  }
  const currentIdx = steps.indexOf(status)
  return (
    <div className="flex items-center gap-0 mt-3">
      {steps.map((s, i) => {
        const active = i <= currentIdx
        const cfg = statusConfig[s]
        const Icon = cfg.icon
        return (
          <div key={s} className="flex items-center flex-1">
            <div className={`flex items-center gap-1.5 px-2 py-1 ${active ? 'text-[#0047FF]' : 'text-[#D0D0D0]'}`}>
              <Icon size={12} />
              <span className="font-mono text-[10px] tracking-widest uppercase hidden sm:block">{cfg.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px ${active && i < currentIdx ? 'bg-[#0047FF]' : 'bg-[#E2E2E2]'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function OrdersPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-1">Orders — Service 05</p>
        <h1 className="font-display font-bold text-3xl text-[#0D0D0D] tracking-tight">Your Orders</h1>
      </div>

      <div className="space-y-4">
        {myOrders.map(order => {
          const cfg = statusConfig[order.status]
          const Icon = cfg.icon

          return (
            <div key={order.id} className="bg-white border border-[#E2E2E2] overflow-hidden">
              {/* Order header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E2E2]">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-mono text-sm font-semibold text-[#0D0D0D]">{order.id}</p>
                    <p className="font-mono text-[11px] text-[#6B6B6B]">{order.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="flex items-center gap-1.5 px-3 py-1 font-mono text-[11px] tracking-widest uppercase"
                    style={{ color: cfg.color, background: cfg.bg }}
                  >
                    <Icon size={11} />
                    {cfg.label}
                  </span>
                  <span className="font-display font-bold text-lg text-[#0D0D0D]">${order.total}</span>
                </div>
              </div>

              {/* Items */}
              <div className="px-5 py-3 space-y-2">
                {order.items.map(item => (
                  <div key={item.name} className="flex justify-between items-center">
                    <span className="font-sans text-sm text-[#0D0D0D]">{item.name} <span className="text-[#6B6B6B]">×{item.qty}</span></span>
                    <span className="font-mono text-sm text-[#6B6B6B]">${item.price}</span>
                  </div>
                ))}
              </div>

              {/* Tracking bar */}
              <div className="px-5 pb-4">
                <TrackBar status={order.status} />
                {order.tracking && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-mono text-[11px] text-[#6B6B6B]">Tracking:</span>
                    <span className="font-mono text-[11px] text-[#0047FF]">{order.tracking}</span>
                    <ExternalLink size={10} className="text-[#0047FF]" />
                    {order.eta && (
                      <span className="font-mono text-[11px] text-[#6B6B6B] ml-2">ETA: {order.eta}</span>
                    )}
                  </div>
                )}
                {order.deliveredOn && (
                  <p className="font-mono text-[11px] text-[#00875A] mt-2">Delivered on {order.deliveredOn}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
