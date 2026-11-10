import { useState } from "react";
import { FileText, Mail, Phone, Trash2 } from "lucide-react";
import { useQuotes, QuoteStatus } from "../../store/quoteStore";

const statuses: { key: QuoteStatus; label: string; color: string }[] = [
  { key: "new", label: "New", color: "#FF8C00" },
  { key: "contacted", label: "Contacted", color: "#856A00" },
  { key: "quoted", label: "Quoted", color: "#7C3AED" },
  { key: "closed", label: "Closed", color: "#00875A" },
];

export default function QuoteRequestsPage() {
  const { quotes, error, loading, updateStatus: setStatus, deleteQuote: removeQuote } = useQuotes();
  const run = (fn: () => Promise<void>) => fn().catch((e) => alert(e instanceof Error ? e.message : "Something went wrong."));
  const updateStatus = (id: string, status: QuoteStatus) => run(() => setStatus(id, status));
  const deleteQuote = (id: string) => confirm("Delete this quote request?") && run(() => removeQuote(id));
  const [filter, setFilter] = useState<QuoteStatus | "all">("all");
  const shown = filter === "all" ? quotes : quotes.filter((q) => q.status === filter);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-1">Sales</p>
        <h1 className="font-display font-bold text-3xl text-[#0D0D0D] tracking-tight">Quote Requests</h1>
        <p className="text-sm text-[#6B6B6B] mt-1">
          Requests sent from the storefront&apos;s Request a Quote form.
        </p>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {[{ key: "all" as const, label: `All (${quotes.length})` }, ...statuses.map((s) => ({
          key: s.key,
          label: `${s.label} (${quotes.filter((q) => q.status === s.key).length})`,
        }))].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`shrink-0 px-3 py-1.5 font-mono text-xs tracking-wide border transition-colors ${
              filter === key
                ? "bg-[#0D0D0D] text-white border-[#0D0D0D]"
                : "bg-white text-[#6B6B6B] border-[#E2E2E2] hover:border-[#0D0D0D]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <p className="font-mono text-xs text-[#DC2626] bg-[#FEF2F2] px-3 py-2 mb-4">{error}</p>}
      {shown.length === 0 ? (
        <div className="bg-white border border-dashed border-[#E2E2E2] py-16 text-center">
          <FileText size={28} className="mx-auto text-[#B0B0B0] mb-3" />
          <p className="font-mono text-sm text-[#6B6B6B]">{loading ? 'Loading...' : 'No quote requests yet.'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shown.map((q) => (
            <div key={q.id} className="bg-white border border-[#E2E2E2] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase">
                    {q.id} · {new Date(q.createdAt).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                  <h2 className="font-display font-semibold text-[#0D0D0D]">
                    {q.name}
                    {q.organization && <span className="text-[#6B6B6B] font-normal"> · {q.organization}</span>}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={q.status}
                    onChange={(e) => updateStatus(q.id, e.target.value as QuoteStatus)}
                    className="border border-[#E2E2E2] px-2 py-1.5 font-mono text-xs bg-white outline-none focus:border-[#D4B63A]"
                    style={{ color: statuses.find((s) => s.key === q.status)?.color }}
                  >
                    {statuses.map((s) => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => deleteQuote(q.id)}
                    aria-label="Delete request"
                    className="w-8 h-8 flex items-center justify-center text-[#B0B0B0] hover:text-[#FF3B00] transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 mb-3 font-mono text-xs text-[#6B6B6B]">
                <a href={`mailto:${q.email}`} className="flex items-center gap-1.5 hover:text-[#856A00]"><Mail size={12} />{q.email}</a>
                <a href={`tel:${q.phone}`} className="flex items-center gap-1.5 hover:text-[#856A00]"><Phone size={12} />{q.phone}</a>
                {q.category && <span>Category: {q.category}</span>}
              </div>
              {q.items && <p className="text-sm text-[#0D0D0D] mb-1"><span className="font-medium">Items:</span> {q.items}</p>}
              {q.message && <p className="text-sm text-[#6B6B6B] whitespace-pre-wrap">{q.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
