import { useState } from 'react'
import { Search, Filter, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react'
import { orders, Order } from '../../data/mockData'

type Status = Order['status']

const statusConfig: Record<Status, { icon: any; label: string; color: string }> = {
  pending: { icon: Clock, label: 'Pending', color: '#FF8C00' },
  processing: { icon: Package, label: 'Processing', color: '#856A00' },
  shipped: { icon: Truck, label: 'Shipped', color: '#7C3AED' },
  delivered: { icon: CheckCircle, label: 'Delivered', color: '#00875A' },
  cancelled: { icon: XCircle, label: 'Cancelled', color: '#DC2626' },
}

const allStatuses: Status[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = Object.fromEntries(allStatuses.map(s => [s, orders.filter(o => o.status === s).length]))

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-1">Service 05</p>
        <h1 className="font-display font-bold text-3xl text-[#0D0D0D] tracking-tight">Order Management</h1>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1 mb-5 flex-wrap">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 font-mono text-xs tracking-wide transition-colors ${statusFilter === 'all' ? 'bg-[#0D0D0D] text-white' : 'bg-white border border-[#E2E2E2] text-[#6B6B6B] hover:border-[#0D0D0D]'}`}
        >
          All ({orders.length})
        </button>
        {allStatuses.map(s => {
          const { label, color } = statusConfig[s]
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 font-mono text-xs tracking-wide transition-colors ${statusFilter === s ? 'text-white' : 'bg-white border border-[#E2E2E2] text-[#6B6B6B] hover:border-[#0D0D0D]'}`}
              style={statusFilter === s ? { background: color } : {}}
            >
              {label} ({counts[s] || 0})
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 border border-[#E2E2E2] px-3 py-2 bg-white flex-1 max-w-xs">
          <Search size={13} className="text-[#6B6B6B]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders or customers..."
            className="flex-1 font-sans text-sm outline-none placeholder:text-[#D0D0D0]"
          />
        </div>
      </div>

      <div className="bg-white border border-[#E2E2E2] overflow-x-auto">
        <div className="grid grid-cols-12 gap-4 min-w-[760px] px-5 py-2.5 font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase border-b border-[#E2E2E2]">
          <span className="col-span-2">Order ID</span>
          <span className="col-span-3">Customer</span>
          <span className="col-span-2">Date</span>
          <span className="col-span-1 text-center">Items</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-1 text-right">Total</span>
          <span className="col-span-1" />
        </div>

        {filtered.map(order => {
          const { icon: Icon, label, color } = statusConfig[order.status]
          const isSelected = selected === order.id
          return (
            <div key={order.id}>
              <div
                className={`grid grid-cols-12 gap-4 min-w-[760px] px-5 py-3.5 border-b border-[#E2E2E2] hover:bg-[#F8F8F8] transition-colors items-center cursor-pointer ${isSelected ? 'bg-[#F0F6FF]' : ''}`}
                onClick={() => setSelected(isSelected ? null : order.id)}
              >
                <span className="col-span-2 font-mono text-xs text-[#856A00] font-semibold">{order.id}</span>
                <div className="col-span-3">
                  <p className="font-sans text-sm text-[#0D0D0D]">{order.customer}</p>
                  <p className="font-mono text-[10px] text-[#6B6B6B]">{order.email}</p>
                </div>
                <span className="col-span-2 font-mono text-xs text-[#6B6B6B]">{order.date}</span>
                <span className="col-span-1 font-mono text-sm text-[#0D0D0D] text-center">{order.items}</span>
                <span
                  className="col-span-2 flex items-center gap-1.5 font-mono text-[10px] px-2 py-1 w-fit tracking-widest uppercase"
                  style={{ color, background: `${color}15` }}
                >
                  <Icon size={10} /> {label}
                </span>
                <span className="col-span-1 font-display font-bold text-sm text-[#0D0D0D] text-right">${order.total}</span>
                <span className="col-span-1 text-right font-mono text-[10px] text-[#6B6B6B]">{isSelected ? '▲' : '▼'}</span>
              </div>

              {isSelected && (
                <div className="border-b border-[#E2E2E2] bg-[#F8FBFF] px-5 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                      <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-2">Customer Info</p>
                      <p className="font-sans text-sm text-[#0D0D0D]">{order.customer}</p>
                      <p className="font-mono text-xs text-[#6B6B6B]">{order.email}</p>
                    </div>
                    {order.tracking && (
                      <div>
                        <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-2">Tracking</p>
                        <p className="font-mono text-xs text-[#856A00]">{order.tracking}</p>
                      </div>
                    )}
                    <div>
                      <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-2">Update Status</p>
                      <select className="border border-[#E2E2E2] px-3 py-1.5 font-mono text-xs text-[#0D0D0D] outline-none focus:border-[#D4B63A] bg-white">
                        {allStatuses.map(s => (
                          <option key={s} value={s} selected={s === order.status}>{statusConfig[s].label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="font-mono text-sm text-[#6B6B6B]">No orders match your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
