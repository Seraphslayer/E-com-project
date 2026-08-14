import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Package, ShoppingCart, DollarSign, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { orders, revenueData, categoryData } from '../../data/mockData'

const stats = [
  { label: 'Revenue (Aug)', value: '$38,900', change: +12.4, icon: DollarSign, color: '#0047FF' },
  { label: 'Orders (Aug)', value: '322', change: +8.1, icon: ShoppingCart, color: '#7C3AED' },
  { label: 'Active Customers', value: '1,847', change: +4.3, icon: Users, color: '#00875A' },
  { label: 'Inventory Items', value: '875', change: -2.1, icon: Package, color: '#FF8C00' },
]

const COLORS = ['#0047FF', '#7C3AED', '#00875A', '#FF8C00', '#FF3B00']

const statusColors: Record<string, string> = {
  pending: '#FF8C00',
  processing: '#0047FF',
  shipped: '#7C3AED',
  delivered: '#00875A',
  cancelled: '#DC2626',
}

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="mb-7">
        <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-1">Overview</p>
        <h1 className="font-display font-bold text-3xl text-[#0D0D0D] tracking-tight">Dashboard</h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, change, icon: Icon, color }) => {
          const positive = change > 0
          return (
            <div key={label} className="bg-white border border-[#E2E2E2] p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase">{label}</p>
                <div className="w-8 h-8 flex items-center justify-center" style={{ background: `${color}15` }}>
                  <Icon size={14} style={{ color }} />
                </div>
              </div>
              <p className="font-display font-bold text-2xl text-[#0D0D0D] mb-1">{value}</p>
              <div className={`flex items-center gap-1 font-mono text-xs ${positive ? 'text-[#00875A]' : 'text-[#DC2626]'}`}>
                {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {Math.abs(change)}% vs last month
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Revenue chart */}
        <div className="col-span-2 bg-white border border-[#E2E2E2] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase">Revenue Trend</p>
              <p className="font-display font-semibold text-[#0D0D0D] text-sm mt-0.5">Last 6 months</p>
            </div>
            <TrendingUp size={16} className="text-[#0047FF]" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0047FF" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0047FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#6B6B6B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#6B6B6B' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ border: '1px solid #E2E2E2', borderRadius: 0, fontFamily: 'JetBrains Mono', fontSize: 11 }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#0047FF" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="bg-white border border-[#E2E2E2] p-5">
          <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-1">Sales by Category</p>
          <p className="font-display font-semibold text-[#0D0D0D] text-sm mb-4">MTD breakdown</p>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={2}>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {categoryData.map(({ name, value }, i) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2" style={{ background: COLORS[i] }} />
                  <span className="font-sans text-xs text-[#0D0D0D]">{name}</span>
                </div>
                <span className="font-mono text-xs text-[#6B6B6B]">{value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-[#E2E2E2]">
        <div className="px-5 py-4 border-b border-[#E2E2E2] flex items-center justify-between">
          <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase">Recent Orders</p>
          <span className="font-mono text-[11px] text-[#0047FF] cursor-pointer hover:underline">View all →</span>
        </div>
        <div>
          <div className="grid grid-cols-5 gap-4 px-5 py-2 font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase border-b border-[#E2E2E2]">
            <span>Order ID</span><span>Customer</span><span>Date</span><span>Status</span><span className="text-right">Total</span>
          </div>
          {orders.slice(0, 6).map(order => (
            <div key={order.id} className="grid grid-cols-5 gap-4 px-5 py-3 border-b border-[#E2E2E2] last:border-0 hover:bg-[#F8F8F8] transition-colors items-center">
              <span className="font-mono text-xs text-[#0047FF]">{order.id}</span>
              <div>
                <p className="font-sans text-sm text-[#0D0D0D]">{order.customer}</p>
                <p className="font-mono text-[10px] text-[#6B6B6B]">{order.email}</p>
              </div>
              <span className="font-mono text-xs text-[#6B6B6B]">{order.date}</span>
              <span
                className="font-mono text-[10px] px-2 py-1 w-fit tracking-wide capitalize"
                style={{ color: statusColors[order.status], background: `${statusColors[order.status]}15` }}
              >
                {order.status}
              </span>
              <span className="font-display font-semibold text-sm text-[#0D0D0D] text-right">${order.total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
