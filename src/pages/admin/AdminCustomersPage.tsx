import { useMemo, useState } from "react";
import { Search, Users, DollarSign, ShoppingBag } from "lucide-react";
import { orders } from "../../data/mockData";

interface Customer {
  name: string;
  email: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const customers = useMemo<Customer[]>(() => {
    const map = new Map<string, Customer>();
    for (const o of orders) {
      const existing = map.get(o.email);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += o.total;
        if (o.date > existing.lastOrderDate) existing.lastOrderDate = o.date;
      } else {
        map.set(o.email, {
          name: o.customer,
          email: o.email,
          orderCount: 1,
          totalSpent: o.total,
          lastOrderDate: o.date,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgOrderValue = customers.length
    ? totalRevenue / customers.reduce((s, c) => s + c.orderCount, 0)
    : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-1">
          Customers
        </p>
        <h1 className="font-display font-bold text-3xl text-[#0D0D0D] tracking-tight">
          Customers
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {[
          {
            label: "Total Customers",
            value: customers.length,
            icon: Users,
            color: "#D4B63A",
          },
          {
            label: "Lifetime Revenue",
            value: `$${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "#00875A",
          },
          {
            label: "Avg. Order Value",
            value: `$${avgOrderValue.toFixed(0)}`,
            icon: ShoppingBag,
            color: "#7C3AED",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white border border-[#E2E2E2] px-5 py-4 flex items-center gap-4"
          >
            <div
              className="w-9 h-9 flex items-center justify-center"
              style={{ background: `${color}15` }}
            >
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase">
                {label}
              </p>
              <p className="font-display font-bold text-2xl text-[#0D0D0D]">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border border-[#E2E2E2] px-3 py-2 max-w-xs bg-white mb-4">
        <Search size={13} className="text-[#6B6B6B]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="flex-1 font-sans text-sm outline-none placeholder:text-[#D0D0D0]"
        />
      </div>

      <div className="bg-white border border-[#E2E2E2] overflow-x-auto">
        <div className="grid grid-cols-12 gap-4 min-w-[760px] px-5 py-2.5 font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase border-b border-[#E2E2E2]">
          <span className="col-span-4">Customer</span>
          <span className="col-span-3">Email</span>
          <span className="col-span-2 text-center">Orders</span>
          <span className="col-span-2 text-right">Total Spent</span>
          <span className="col-span-1 text-right">Last Order</span>
        </div>

        {filtered.map((c) => {
          const isSelected = selected === c.email;
          const customerOrders = orders.filter((o) => o.email === c.email);
          return (
            <div key={c.email}>
              <div
                onClick={() => setSelected(isSelected ? null : c.email)}
                className={`grid grid-cols-12 gap-4 min-w-[760px] px-5 py-3.5 border-b border-[#E2E2E2] hover:bg-[#F8F8F8] transition-colors items-center cursor-pointer ${isSelected ? "bg-[#F0F6FF]" : ""}`}
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#E4EBEB] flex items-center justify-center font-mono text-[10px] font-semibold text-[#0D0D0D] flex-shrink-0">
                    {c.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <p className="font-sans text-sm text-[#0D0D0D]">{c.name}</p>
                </div>
                <span className="col-span-3 font-mono text-xs text-[#6B6B6B]">
                  {c.email}
                </span>
                <span className="col-span-2 font-mono text-sm text-[#0D0D0D] text-center">
                  {c.orderCount}
                </span>
                <span className="col-span-2 font-display font-bold text-sm text-[#0D0D0D] text-right">
                  ${c.totalSpent.toLocaleString()}
                </span>
                <span className="col-span-1 font-mono text-[10px] text-[#6B6B6B] text-right">
                  {c.lastOrderDate.slice(5)}
                </span>
              </div>

              {isSelected && (
                <div className="border-b border-[#E2E2E2] bg-[#F8FBFF] px-5 py-4">
                  <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-3">
                    Order History
                  </p>
                  <div className="space-y-2">
                    {customerOrders.map((o) => (
                      <div
                        key={o.id}
                        className="flex items-center justify-between font-mono text-xs"
                      >
                        <span className="text-[#856A00]">{o.id}</span>
                        <span className="text-[#6B6B6B]">{o.date}</span>
                        <span className="text-[#6B6B6B] capitalize">
                          {o.status}
                        </span>
                        <span className="text-[#0D0D0D] font-semibold">
                          ${o.total}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="font-mono text-sm text-[#6B6B6B]">
              No customers match your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
