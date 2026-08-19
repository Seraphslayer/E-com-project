import { useState } from "react";
import { X } from "lucide-react";

export default function PromoBar() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="relative bg-[#0D0D0D] text-white">
      <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-center">
        <p className="font-mono text-[11px] tracking-wide text-center">
          NEW SEASON RESTOCK — SAVE UP TO 30% · FREE SHIPPING OVER $75{" "}
          <span className="underline underline-offset-2 hover:text-white/70 cursor-pointer ml-1">
            Shop the sale
          </span>
        </p>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
