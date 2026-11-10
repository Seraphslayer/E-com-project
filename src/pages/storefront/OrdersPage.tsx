import { useState } from 'react'
import { Package, Truck, CheckCircle, Clock, XCircle, Search } from 'lucide-react'
import { formatPHP } from '../../data/companyInfo'
import { api } from '../../lib/api'

interface MyOrder {
  id: string
  createdAt: string
  status: Status
  total: number
  tracking?: string
  items: { name: string; quantity: number; price: number }[]
}

type Status = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

const statusConfig: Record<Status, { icon: any; label: string; color: string; bg: string }> = {
  pending: { icon: Clock, label: 'Pending', color: '#FF8C00', bg: '#FFF3E0' },
  processing: { icon: Package, label: 'Processing', color: '#856A00', bg: '#FBF5D6' },
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
            <div className={`flex items-center gap-1.5 px-2 py-1 ${active ? 'text-[#856A00]' : 'text-[#D0D0D0]'}`}>
              <Icon size={12} />
              <span className="font-mono text-[10px] tracking-widest uppercase hidden sm:block">{cfg.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px ${active && i < currentIdx ? 'bg-[#EACD51]' : 'bg-[#E2E2E2]'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function OrdersPage() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState<MyOrder | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setOrder(null)
    try {
      const q = new URLSearchParams({ id: orderId.trim(), email: email.trim() })
      setOrder(await api<MyOrder>(`/orders/track?${q}`, { auth: false }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not find that order.')
    } finally {
      setBusy(false)
    }
  }

  const cfg = order ? statusConfig[order.status] : null
  const Icon = cfg?.icon

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-1">Orders — Service 05</p>
        <h1 className="font-display font-bold text-3xl text-[#0D0D0D] tracking-tight">Track Your Order</h1>
        <p className="text-sm text-[#6B6B6B] mt-1">Enter your order number and the email you used at checkout.</p>
      </div>

      <form onSubmit={lookup} className="bg-white border border-[#E2E2E2] p-5 mb-6 grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
        <div>
          <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">Order number</label>
          <input required value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="ORD-20101" className="w-full border border-[#E2E2E2] px-3 py-2.5 font-mono text-sm outline-none focus:border-[#D4B63A]" />
        </div>
        <div>
          <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">Email</label>
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className="w-full border border-[#E2E2E2] px-3 py-2.5 text-sm outline-none focus:border-[#D4B63A]" />
        </div>
        <button type="submit" disabled={busy} className="bg-[#EACD51] text-[#0D0D0D] px-6 py-3 font-mono text-xs tracking-widest uppercase hover:bg-[#D4B63A] transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
          <Search size={13} /> {busy ? 'Searching...' : 'Track'}
        </button>
      </form>

      {error && <p className="font-mono text-xs text-[#DC2626] bg-[#FEF2F2] px-3 py-2 mb-4">{error}</p>}

      {order && cfg && Icon && (
        <div className="bg-white border border-[#E2E2E2] overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[#E2E2E2]">
            <div>
              <p className="font-mono text-sm font-semibold text-[#0D0D0D]">{order.id}</p>
              <p className="font-mono text-[11px] text-[#6B6B6B]">{new Date(order.createdAt).toLocaleDateString('en-PH', { dateStyle: 'medium' })}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1 font-mono text-[11px] tracking-widest uppercase" style={{ color: cfg.color, background: cfg.bg }}>
                <Icon size={11} />
                {cfg.label}
              </span>
              <span className="font-display font-bold text-lg text-[#0D0D0D]">{formatPHP(order.total)}</span>
            </div>
          </div>
          <div className="px-5 py-3 space-y-2">
            {order.items.map(item => (
              <div key={item.name} className="flex justify-between items-center gap-3">
                <span className="font-sans text-sm text-[#0D0D0D]">{item.name} <span className="text-[#6B6B6B]">×{item.quantity}</span></span>
                <span className="font-mono text-sm text-[#6B6B6B]">{formatPHP(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="px-5 pb-4">
            <TrackBar status={order.status} />
            {order.tracking && (
              <p className="mt-2 font-mono text-[11px] text-[#6B6B6B]">Tracking: <span className="text-[#856A00]">{order.tracking}</span></p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
