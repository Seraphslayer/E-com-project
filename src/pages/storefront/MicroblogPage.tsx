import { useState } from 'react'
import { Heart, MessageCircle, Share2, BookOpen, PenLine } from 'lucide-react'
import { blogPosts, BlogPost } from '../../data/mockData'

function PostCard({ post }: { post: BlogPost }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes)

  const handleLike = () => {
    setLiked(!liked)
    setLikes(l => liked ? l - 1 : l + 1)
  }

  const categoryColors: Record<string, string> = {
    'New Arrivals': '#0047FF',
    'Style': '#7C3AED',
    'Guide': '#00875A',
    'Review': '#FF8C00',
  }

  return (
    <article className="bg-white border border-[#E2E2E2] hover:border-[#0047FF] transition-colors duration-200">
      {post.image && (
        <div className="overflow-hidden h-44 bg-[#F5F5F5]">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-7 h-7 bg-[#F0F0F0] flex items-center justify-center font-mono text-[10px] text-[#0D0D0D] font-semibold">
            {post.avatar}
          </div>
          <div>
            <p className="font-sans text-sm font-medium text-[#0D0D0D]">{post.author}</p>
            <p className="font-mono text-[10px] text-[#6B6B6B]">{post.date}</p>
          </div>
          <div className="ml-auto">
            <span
              className="font-mono text-[10px] px-2 py-1 tracking-widest uppercase"
              style={{ color: categoryColors[post.category] || '#6B6B6B', background: `${categoryColors[post.category] || '#6B6B6B'}15` }}
            >
              {post.category}
            </span>
          </div>
        </div>

        <h2 className="font-display font-bold text-[#0D0D0D] text-base leading-snug mb-2">{post.title}</h2>
        <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed line-clamp-3">{post.body}</p>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#E2E2E2]">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 font-mono text-xs transition-colors ${liked ? 'text-[#FF3B00]' : 'text-[#6B6B6B] hover:text-[#FF3B00]'}`}
          >
            <Heart size={13} className={liked ? 'fill-[#FF3B00]' : ''} />
            {likes}
          </button>
          <div className="flex items-center gap-1.5 font-mono text-xs text-[#6B6B6B]">
            <MessageCircle size={13} />
            {post.comments}
          </div>
          <button className="ml-auto text-[#6B6B6B] hover:text-[#0047FF] transition-colors">
            <Share2 size={13} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default function MicroblogPage() {
  const [composing, setComposing] = useState(false)
  const [draft, setDraft] = useState('')

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-1">Community — Service 08</p>
          <h1 className="font-display font-bold text-3xl text-[#0D0D0D] tracking-tight">Microblog</h1>
          <p className="text-[#6B6B6B] text-sm mt-1">Project updates, product guides, and announcements from FGT Trading OPC.</p>
        </div>
        <button
          onClick={() => setComposing(!composing)}
          className="flex items-center gap-2 bg-[#0047FF] text-white px-4 py-2.5 font-mono text-xs tracking-widest uppercase hover:bg-[#0035CC] transition-colors"
        >
          <PenLine size={13} />
          Write Post
        </button>
      </div>

      {composing && (
        <div className="bg-white border border-[#0047FF] p-5 mb-6">
          <p className="font-mono text-[11px] text-[#0047FF] tracking-widest uppercase mb-3">New Post</p>
          <input
            type="text"
            placeholder="Post title..."
            className="w-full border-none outline-none font-display font-bold text-xl text-[#0D0D0D] mb-3 placeholder:text-[#D0D0D0]"
          />
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Write your post..."
            rows={4}
            className="w-full border-none outline-none font-sans text-sm text-[#0D0D0D] resize-none placeholder:text-[#D0D0D0] mb-4"
          />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-[#6B6B6B]">{draft.length} characters</span>
            <div className="flex gap-2">
              <button onClick={() => setComposing(false)} className="px-4 py-2 border border-[#E2E2E2] font-mono text-xs tracking-widest uppercase hover:border-[#0D0D0D] transition-colors">
                Cancel
              </button>
              <button onClick={() => setComposing(false)} className="px-4 py-2 bg-[#0047FF] text-white font-mono text-xs tracking-widest uppercase hover:bg-[#0035CC] transition-colors">
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {blogPosts.map(post => <PostCard key={post.id} post={post} />)}
      </div>

      <div className="mt-8 bg-[#0D0D0D] p-6 flex items-center justify-between">
        <div>
          <p className="font-display font-bold text-white text-lg">Stay Updated with FGT Trading OPC</p>
          <p className="text-white/50 font-sans text-sm mt-1">Get early access to new arrivals, style tips, and exclusive discounts.</p>
        </div>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            className="bg-white/10 border border-white/20 text-white placeholder:text-white/30 px-4 py-2.5 font-mono text-sm outline-none focus:border-white/50 transition-colors"
          />
          <button className="bg-[#0047FF] text-white px-5 py-2.5 font-mono text-xs tracking-widest uppercase hover:bg-[#0035CC] transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  )
}
