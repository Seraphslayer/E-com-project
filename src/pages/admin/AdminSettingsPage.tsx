import { useState } from "react";
import { Store, Truck, CreditCard, Bell, Check } from "lucide-react";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`w-10 h-5 flex items-center px-0.5 transition-colors ${checked ? "bg-[#EACD51]" : "bg-[#E2E2E2]"}`}
      aria-pressed={checked}
    >
      <span
        className={`w-4 h-4 bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

function SettingsCard({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#E2E2E2]">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-[#E2E2E2]">
        <Icon size={15} className="text-[#856A00]" />
        <p className="font-mono text-[11px] text-[#0D0D0D] tracking-widest uppercase">
          {title}
        </p>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("MERX");
  const [storeDescription, setStoreDescription] = useState(
    "Electronics, apparel, and everyday essentials curated for the modern buyer.",
  );
  const [currency, setCurrency] = useState("USD");

  const [freeShippingThreshold, setFreeShippingThreshold] = useState("75");
  const [flatRate, setFlatRate] = useState("9.99");

  const [paymentMethods, setPaymentMethods] = useState({
    card: true,
    gcash: true,
    maya: true,
    grabpay: false,
  });

  const [notifications, setNotifications] = useState({
    orderEmails: true,
    lowStockAlerts: true,
    reviewAlerts: false,
    marketingEmails: false,
  });

  const [saved, setSaved] = useState(false);
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-1">
            Configuration
          </p>
          <h1 className="font-display font-bold text-3xl text-[#0D0D0D] tracking-tight">
            Settings
          </h1>
        </div>
        {saved && (
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#00875A]">
            <Check size={13} /> Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <SettingsCard icon={Store} title="Store Info">
          <div>
            <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
              Store Name
            </label>
            <input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full border border-[#E2E2E2] px-3 py-2.5 font-sans text-sm outline-none focus:border-[#D4B63A] transition-colors"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
              Store Description
            </label>
            <textarea
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              rows={2}
              className="w-full border border-[#E2E2E2] px-3 py-2.5 font-sans text-sm outline-none focus:border-[#D4B63A] transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="border border-[#E2E2E2] px-3 py-2.5 font-mono text-sm outline-none focus:border-[#D4B63A] bg-white"
            >
              <option value="USD">USD ($)</option>
              <option value="PHP">PHP (₱)</option>
            </select>
          </div>
        </SettingsCard>

        <SettingsCard icon={Truck} title="Shipping">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
                Free Shipping Threshold ($)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                className="w-full border border-[#E2E2E2] px-3 py-2.5 font-mono text-sm outline-none focus:border-[#D4B63A] transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
                Flat Rate ($)
              </label>
              <input
                type="number"
                value={flatRate}
                onChange={(e) => setFlatRate(e.target.value)}
                className="w-full border border-[#E2E2E2] px-3 py-2.5 font-mono text-sm outline-none focus:border-[#D4B63A] transition-colors"
              />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard icon={CreditCard} title="Payment Methods">
          {[
            { key: "card", label: "Credit / Debit Card" },
            { key: "gcash", label: "GCash" },
            { key: "maya", label: "Maya" },
            { key: "grabpay", label: "GrabPay" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="font-sans text-sm text-[#0D0D0D]">{label}</span>
              <Toggle
                checked={paymentMethods[key as keyof typeof paymentMethods]}
                onChange={() =>
                  setPaymentMethods((p) => ({
                    ...p,
                    [key]: !p[key as keyof typeof paymentMethods],
                  }))
                }
              />
            </div>
          ))}
          <p className="font-mono text-[10px] text-[#6B6B6B] pt-2 border-t border-[#E2E2E2]">
            Processed via PayMongo
          </p>
        </SettingsCard>

        <SettingsCard icon={Bell} title="Notifications">
          {[
            { key: "orderEmails", label: "New order emails" },
            { key: "lowStockAlerts", label: "Low stock alerts" },
            { key: "reviewAlerts", label: "New review alerts" },
            { key: "marketingEmails", label: "Marketing & promo emails" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="font-sans text-sm text-[#0D0D0D]">{label}</span>
              <Toggle
                checked={notifications[key as keyof typeof notifications]}
                onChange={() =>
                  setNotifications((n) => ({
                    ...n,
                    [key]: !n[key as keyof typeof notifications],
                  }))
                }
              />
            </div>
          ))}
        </SettingsCard>

        <button
          type="submit"
          className="bg-[#EACD51] text-[#0D0D0D] px-6 py-3 font-mono text-xs tracking-widest uppercase hover:bg-[#D4B63A] transition-colors"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
