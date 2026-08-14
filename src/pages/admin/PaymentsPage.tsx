import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { CreditCard, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { revenueData } from '../../data/mockData'

const transactions = [
  { id: 'PAY-8821', date: 'Aug 8, 2026', customer: 'Elena Vasquez', method: 'Visa •••• 4242', amount: 249, status: 'captured', orderId: 'ORD-20095' },
  { id: 'PAY-8820', date: 'Aug 6, 2026', customer: 'James Thornton', method: 'Mastercard •••• 1234', amount: 189, status: 'captured', orderId: 'ORD-20093' },
  { id: 'PAY-8819', date: 'Aug 5, 2026', customer: 'Aiko Nakamura', method: 'Visa •••• 9876', amount: 227, status: 'captured', orderId: 'ORD-20092' },
  { id: 'PAY-8818', date: 'Aug 5, 2026', customer: 'Marcus Webb', method: 'Visa •••• 5544', amount: 64, status: 'pending', orderId: 'ORD-20091' },
  { id: 'PAY-8817', date: 'Aug 4, 2026', customer: 'Sofia Reyes', method: 'Amex •••• 3782', amount: 495, status: 'captured', orderId: 'ORD-20090' },
  { id: 'PAY-8816', date: 'Aug 4, 2026', customer: 'Omar Khalid', method: 'Visa •••• 7777', amount: 249, status: 'refunded', orderId: 'ORD-20089' },
  { id: 'PAY-8815', date: 'Aug 3, 2026', customer: 'Priya Sharma', method: 'Mastercard •••• 4321', amount: 164, status: 'captured', orderId: 'ORD-20088' },
  { id: 'PAY-8814', date: 'Aug 3, 2026', customer: 'Tom Eriksen', method: 'Visa •••• 6543', amount: 89, status: 'captured', orderId: 'ORD-20087' },
]

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  captured: { label: 'Captured', color: '#00875A', icon: CheckCircle },
  pending: { label: 'Pending', color: '#FF8C00', icon: Clock },
  refunded: { label: 'Refunded', color: '#DC2626', icon: AlertCircle },
  failed: { label: 'Failed', color: '#DC2626', icon: AlertCircle },
}

const totalRevenue = transactions.filter(t => t.status === 'captured').reduce((s, t) => s + t.amount, 0)
const totalRefunds = transactions.filter(t => t.status === 'refunded').reduce((s, t) => s + t.amount, 0)

export default function PaymentsPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-1">Service 03</p>
        <h1 className="font-display font-bold text-3xl text-[#0D0D0D] tracking-tight">Payments</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Captured (Aug)', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#00875A' },
          { label: 'Transactions', value: transactions.length, icon: CreditCard, color: '#0047FF' },
          { label: 'Refunds', value: `$${totalRefunds}`, icon: AlertCircle, color: '#DC2626' },
          { label: 'Avg. Order Value', value: `$${Math.round(totalRevenue / transactions.filter(t => t.status === 'captured').length)}`, icon: TrendingUp, color: '#7C3AED' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-[#E2E2E2] p-4 flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center" style={{ background: `${color}15` }}>
              <Icon size={15} style={{ color }} />
            </div>
            <div>
              <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase">{label}</p>
              <p className="font-display font-bold text-xl text-[#0D0D0D]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white border border-[#E2E2E2] p-5 mb-6">
        <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-4">Monthly Revenue & Orders</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="month" tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#6B6B6B' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#6B6B6B' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ border: '1px solid #E2E2E2', borderRadius: 0, fontFamily: 'JetBrains Mono', fontSize: 11 }}
              formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
            />
            <Bar dataKey="revenue" fill="#0047FF" radius={0} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Transactions table */}
      <div className="bg-white border border-[#E2E2E2]">
        <div className="px-5 py-3 border-b border-[#E2E2E2]">
          <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase">Transaction Log</p>
        </div>
        <div className="grid grid-cols-12 gap-4 px-5 py-2 font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase border-b border-[#E2E2E2]">
          <span className="col-span-2">Pay ID</span>
          <span className="col-span-2">Date</span>
          <span className="col-span-2">Customer</span>
          <span className="col-span-3">Method</span>
          <span className="col-span-1">Order</span>
          <span className="col-span-1">Status</span>
          <span className="col-span-1 text-right">Amount</span>
        </div>
        {transactions.map(tx => {
          const cfg = statusConfig[tx.status]
          const Icon = cfg.icon
          return (
            <div key={tx.id} className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#E2E2E2] last:border-0 hover:bg-[#F8F8F8] transition-colors items-center">
              <span className="col-span-2 font-mono text-xs text-[#0047FF]">{tx.id}</span>
              <span className="col-span-2 font-mono text-xs text-[#6B6B6B]">{tx.date}</span>
              <span className="col-span-2 font-sans text-sm text-[#0D0D0D]">{tx.customer}</span>
              <span className="col-span-3 font-mono text-xs text-[#6B6B6B]">{tx.method}</span>
              <span className="col-span-1 font-mono text-xs text-[#0047FF]">{tx.orderId}</span>
              <span
                className="col-span-1 flex items-center gap-1 font-mono text-[10px] tracking-wide"
                style={{ color: cfg.color }}
              >
                <Icon size={10} /> {cfg.label}
              </span>
              <span className={`col-span-1 font-display font-bold text-sm text-right ${tx.status === 'refunded' ? 'text-[#DC2626]' : 'text-[#0D0D0D]'}`}>
                {tx.status === 'refunded' ? '-' : ''}${tx.amount}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
