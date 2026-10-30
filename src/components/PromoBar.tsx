import { useState } from "react";
import { X } from "lucide-react";

export default function PromoBar() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="relative bg-[#0D0D0D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 sm:px-6 min-h-9 py-1.5 flex items-center justify-center">
        <p className="font-mono text-[11px] tracking-wide text-center">
          FREE SHIPPING OVER ₱20,000 · NEED A BULK PRICE?{" "}
          <span className="underline underline-offset-2 hover:text-white/70 cursor-pointer ml-1">
            Request a quote
          </span>
        </p>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
