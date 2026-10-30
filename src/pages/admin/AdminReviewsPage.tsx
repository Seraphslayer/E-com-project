import { useState } from "react";
import { Search, Star, CheckCircle, Flag, Trash2 } from "lucide-react";
import { reviews as initialReviews, Review } from "../../data/mockData";

type Status = "published" | "flagged";

interface ManagedReview extends Review {
  status: Status;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={12}
          className={
            n <= rating ? "text-[#FF8C00] fill-[#FF8C00]" : "text-[#D0D0D0]"
          }
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ManagedReview[]>(
    initialReviews.map((r) => ({ ...r, status: "published" as Status })),
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const filtered = reviews.filter((r) => {
    const matchSearch =
      r.author.toLowerCase().includes(search.toLowerCase()) ||
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchRating = ratingFilter === null || r.rating === ratingFilter;
    return matchSearch && matchStatus && matchRating;
  });

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;
  const flaggedCount = reviews.filter((r) => r.status === "flagged").length;

  const setStatus = (id: string, status: Status) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const remove = (id: string) => {
    if (confirm("Delete this review permanently?")) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-1">
          Service 09
        </p>
        <h1 className="font-display font-bold text-3xl text-[#0D0D0D] tracking-tight">
          Reviews
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {[
          {
            label: "Total Reviews",
            value: reviews.length,
            icon: Star,
            color: "#D4B63A",
          },
          {
            label: "Average Rating",
            value: avgRating.toFixed(1),
            icon: Star,
            color: "#FF8C00",
          },
          {
            label: "Flagged",
            value: flaggedCount,
            icon: Flag,
            color: "#DC2626",
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

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 border border-[#E2E2E2] px-3 py-2 flex-1 max-w-xs bg-white">
          <Search size={13} className="text-[#6B6B6B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search author, product, title..."
            className="flex-1 font-sans text-sm outline-none placeholder:text-[#D0D0D0]"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "published", "flagged"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 font-mono text-xs tracking-wide capitalize transition-colors ${
                statusFilter === s
                  ? "bg-[#0D0D0D] text-white"
                  : "bg-white border border-[#E2E2E2] text-[#6B6B6B] hover:border-[#0D0D0D]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {[5, 4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => setRatingFilter(ratingFilter === r ? null : r)}
              className={`w-8 h-8 flex items-center justify-center font-mono text-xs transition-colors ${
                ratingFilter === r
                  ? "bg-[#FF8C00] text-white"
                  : "bg-white border border-[#E2E2E2] text-[#6B6B6B] hover:border-[#FF8C00]"
              }`}
            >
              {r}★
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-[#E2E2E2] divide-y divide-[#E2E2E2]">
        {filtered.map((review) => (
          <div key={review.id} className="px-5 py-4 flex items-start gap-4">
            <div className="w-8 h-8 bg-[#E4EBEB] flex items-center justify-center font-mono text-[10px] font-semibold text-[#0D0D0D] flex-shrink-0">
              {review.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-sans text-sm font-semibold text-[#0D0D0D]">
                  {review.author}
                </span>
                {review.verified && (
                  <span className="flex items-center gap-0.5 font-mono text-[10px] text-[#00875A]">
                    <CheckCircle size={10} /> Verified
                  </span>
                )}
                <span
                  className={`font-mono text-[9px] px-1.5 py-0.5 tracking-widest uppercase ${
                    review.status === "flagged"
                      ? "bg-[#FEF2F2] text-[#DC2626]"
                      : "bg-[#E8F5F0] text-[#00875A]"
                  }`}
                >
                  {review.status}
                </span>
              </div>
              <Stars rating={review.rating} />
              <p className="font-mono text-[10px] text-[#856A00] mt-1 mb-1">
                {review.productName}
              </p>
              <p className="font-sans font-medium text-sm text-[#0D0D0D] mb-1">
                {review.title}
              </p>
              <p className="font-sans text-xs text-[#6B6B6B] leading-relaxed">
                {review.body}
              </p>
              <p className="font-mono text-[10px] text-[#D0D0D0] mt-2">
                {review.date} · {review.helpful} helpful
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {review.status === "flagged" ? (
                <button
                  onClick={() => setStatus(review.id, "published")}
                  className="flex items-center gap-1 border border-[#00875A] text-[#00875A] px-2.5 py-1.5 font-mono text-[10px] tracking-wide hover:bg-[#00875A] hover:text-white transition-colors"
                >
                  <CheckCircle size={11} /> Approve
                </button>
              ) : (
                <button
                  onClick={() => setStatus(review.id, "flagged")}
                  className="flex items-center gap-1 border border-[#E2E2E2] text-[#6B6B6B] px-2.5 py-1.5 font-mono text-[10px] tracking-wide hover:border-[#DC2626] hover:text-[#DC2626] transition-colors"
                >
                  <Flag size={11} /> Flag
                </button>
              )}
              <button
                onClick={() => remove(review.id)}
                className="text-[#D0D0D0] hover:text-[#DC2626] transition-colors"
                aria-label="Delete review"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="font-mono text-sm text-[#6B6B6B]">
              No reviews match your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
