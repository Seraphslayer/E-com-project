import { useState } from 'react'
import { Star, ThumbsUp, CheckCircle } from 'lucide-react'
import { reviews } from '../data/mockData'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={12} className={n <= rating ? 'text-[#FF8C00] fill-[#FF8C00]' : 'text-[#D0D0D0]'} />
      ))}
    </div>
  )
}

export default function ReviewsPanel() {
  const [writing, setWriting] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  const [selectedRating, setSelectedRating] = useState(0)

  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  const dist = [5,4,3,2,1].map(n => ({ n, count: reviews.filter(r => r.rating === n).length }))

  return (
    <div className="bg-white border border-[#E2E2E2] sticky top-20">
      <div className="p-4 border-b border-[#E2E2E2]">
        <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-2">Reviews — Service 09</p>
        <div className="flex items-baseline gap-3">
          <span className="font-display font-bold text-4xl text-[#0D0D0D]">{avgRating.toFixed(1)}</span>
          <div>
            <Stars rating={Math.round(avgRating)} />
            <p className="font-mono text-[11px] text-[#6B6B6B] mt-1">{reviews.length} reviews</p>
          </div>
        </div>
        <div className="mt-3 space-y-1">
          {dist.map(({ n, count }) => (
            <div key={n} className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#6B6B6B] w-3">{n}</span>
              <div className="flex-1 h-1.5 bg-[#F0F0F0]">
                <div
                  className="h-full bg-[#FF8C00]"
                  style={{ width: `${(count / reviews.length) * 100}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-[#6B6B6B] w-3">{count}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => setWriting(!writing)}
          className="mt-4 w-full border border-[#0047FF] text-[#0047FF] py-2 font-mono text-xs tracking-widest uppercase hover:bg-[#0047FF] hover:text-white transition-colors"
        >
          Write a Review
        </button>
      </div>

      {writing && (
        <div className="p-4 border-b border-[#E2E2E2] bg-[#F8F8F8]">
          <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-3">Your Rating</p>
          <div className="flex gap-1 mb-3">
            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setSelectedRating(n)}
              >
                <Star
                  size={20}
                  className={n <= (hoverRating || selectedRating) ? 'text-[#FF8C00] fill-[#FF8C00]' : 'text-[#D0D0D0]'}
                />
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Review title"
            className="w-full border border-[#E2E2E2] px-3 py-2 font-sans text-sm outline-none focus:border-[#0047FF] mb-2"
          />
          <textarea
            rows={3}
            placeholder="Share your experience..."
            className="w-full border border-[#E2E2E2] px-3 py-2 font-sans text-sm outline-none focus:border-[#0047FF] resize-none"
          />
          <button
            onClick={() => setWriting(false)}
            className="mt-2 w-full bg-[#0047FF] text-white py-2 font-mono text-xs tracking-widest uppercase hover:bg-[#0035CC] transition-colors"
          >
            Submit Review
          </button>
        </div>
      )}

      <div className="divide-y divide-[#E2E2E2] max-h-[500px] overflow-y-auto">
        {reviews.map(review => (
          <div key={review.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-[#F0F0F0] flex items-center justify-center font-mono text-[10px] font-semibold text-[#0D0D0D] flex-shrink-0">
                {review.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-sans text-sm font-semibold text-[#0D0D0D]">{review.author}</span>
                  {review.verified && (
                    <span className="flex items-center gap-0.5 font-mono text-[10px] text-[#00875A]">
                      <CheckCircle size={10} /> Verified
                    </span>
                  )}
                </div>
                <Stars rating={review.rating} />
                <p className="font-mono text-[10px] text-[#6B6B6B] mt-1 mb-1">{review.productName}</p>
                <p className="font-sans font-medium text-sm text-[#0D0D0D] mb-1">{review.title}</p>
                <p className="font-sans text-xs text-[#6B6B6B] leading-relaxed">{review.body}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button className="flex items-center gap-1 font-mono text-[10px] text-[#6B6B6B] hover:text-[#0047FF] transition-colors">
                    <ThumbsUp size={10} /> {review.helpful} helpful
                  </button>
                  <span className="font-mono text-[10px] text-[#D0D0D0]">{review.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
