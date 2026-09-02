import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CreditCard,
  QrCode,
  MessageSquare,
  ArrowLeft,
  Settings,
  Bell,
  Star,
  BookOpen,
  Users,
} from "lucide-react";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/inventory", label: "Inventory", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/content", label: "Content", icon: BookOpen },
  { to: "/admin/qr", label: "QR & Labels", icon: QrCode },
  { to: "/admin/chat", label: "Support Chat", icon: MessageSquare },
];

const notifications = [
  {
    id: "n1",
    text: "Low stock alert: Mechanical Keyboard TKL (22 left)",
    time: "10m ago",
  },
  { id: "n2", text: "New order ORD-20095 received", time: "1h ago" },
  { id: "n3", text: "New review flagged for moderation", time: "3h ago" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0D0D0D] flex flex-col flex-shrink-0 sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-white/10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors mb-4 group"
          >
            <ArrowLeft size={12} />
            <span className="font-mono text-[10px] tracking-widest uppercase">
              Exit
            </span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0047FF] flex items-center justify-center">
              <span className="font-display font-bold text-white text-xs">
                M
              </span>
            </div>
            <div>
              <p className="font-display font-semibold text-white tracking-tight text-sm">
                MERX
              </p>
              <p className="font-mono text-[9px] text-white/30 tracking-widest uppercase">
                Admin Portal
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 font-mono text-xs tracking-wide transition-colors ${
                  isActive
                    ? "bg-[#0047FF] text-white"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#F0F0F0] flex items-center justify-center font-mono text-[10px] text-[#0D0D0D] font-semibold">
              AD
            </div>
            <div>
              <p className="font-sans text-xs font-medium text-white">
                Admin User
              </p>
              <p className="font-mono text-[9px] text-white/30">
                admin@merx.com
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-[#E2E2E2] px-8 h-14 flex items-center justify-between sticky top-0 z-30">
          <div />
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                onBlur={() => setTimeout(() => setNotifOpen(false), 150)}
                className="relative w-8 h-8 flex items-center justify-center text-[#6B6B6B] hover:text-[#0D0D0D] transition-colors"
              >
                <Bell size={16} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF3B00]" />
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#E2E2E2] shadow-lg z-50">
                  <div className="px-4 py-3 border-b border-[#E2E2E2]">
                    <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase">
                      Notifications
                    </p>
                  </div>
                  <div className="divide-y divide-[#E2E2E2] max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="px-4 py-3">
                        <p className="font-sans text-xs text-[#0D0D0D] leading-relaxed">
                          {n.text}
                        </p>
                        <p className="font-mono text-[9px] text-[#B0B0B0] mt-1">
                          {n.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate("/admin/settings")}
              className="w-8 h-8 flex items-center justify-center text-[#6B6B6B] hover:text-[#0D0D0D] transition-colors"
            >
              <Settings size={16} />
            </button>
            <div className="w-px h-5 bg-[#E2E2E2]" />
            <span className="font-mono text-[11px] text-[#6B6B6B]">
              Aug 8, 2026
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
