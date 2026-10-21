import { useState } from "react";
import { Plus, Heart, MessageCircle, Trash2, X, BookOpen } from "lucide-react";
import { blogPosts as initialPosts, BlogPost } from "../../data/mockData";

const categories = ["New Arrivals", "Style", "Guide", "Review"];

const categoryColors: Record<string, string> = {
  "New Arrivals": "#D4B63A",
  Style: "#7C3AED",
  Guide: "#00875A",
  Review: "#FF8C00",
};

export default function AdminContentPage() {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState(categories[0]);

  const publish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    const newPost: BlogPost = {
      id: `b${Date.now()}`,
      author: "Merx Team",
      avatar: "MT",
      date: new Date().toISOString().slice(0, 10),
      title: title.trim(),
      body: body.trim(),
      category,
      likes: 0,
      comments: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
    setTitle("");
    setBody("");
    setComposing(false);
  };

  const remove = (id: string) => {
    if (confirm("Delete this post?")) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-1">
            Service 08
          </p>
          <h1 className="font-display font-bold text-3xl text-[#0D0D0D] tracking-tight">
            Content
          </h1>
        </div>
        <button
          onClick={() => setComposing(!composing)}
          className="flex items-center gap-2 bg-[#EACD51] text-[#0D0D0D] px-4 py-2.5 font-mono text-xs tracking-widest uppercase hover:bg-[#D4B63A] transition-colors"
        >
          {composing ? <X size={13} /> : <Plus size={13} />}
          {composing ? "Cancel" : "New Post"}
        </button>
      </div>

      {composing && (
        <form
          onSubmit={publish}
          className="bg-white border border-[#D4B63A] p-5 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-[11px] text-[#856A00] tracking-widest uppercase">
              New Post
            </p>
            <div className="flex gap-1">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`px-2.5 py-1 font-mono text-[10px] tracking-wide transition-colors ${
                    category === c
                      ? "text-white"
                      : "border border-[#E2E2E2] text-[#6B6B6B]"
                  }`}
                  style={
                    category === c ? { background: categoryColors[c] } : {}
                  }
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="w-full border-none outline-none font-display font-bold text-xl text-[#0D0D0D] mb-3 placeholder:text-[#D0D0D0]"
          />
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your post..."
            rows={4}
            className="w-full border-none outline-none font-sans text-sm text-[#0D0D0D] resize-none placeholder:text-[#D0D0D0] mb-4"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setComposing(false)}
              className="px-4 py-2 border border-[#E2E2E2] font-mono text-xs tracking-widest uppercase hover:border-[#0D0D0D] transition-colors"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#EACD51] text-[#0D0D0D] font-mono text-xs tracking-widest uppercase hover:bg-[#D4B63A] transition-colors"
            >
              Publish
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-[#E2E2E2] divide-y divide-[#E2E2E2]">
        <div className="grid grid-cols-12 gap-4 px-5 py-2.5 font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase">
          <span className="col-span-5">Post</span>
          <span className="col-span-2">Category</span>
          <span className="col-span-2">Date</span>
          <span className="col-span-2">Engagement</span>
          <span className="col-span-1 text-right">Actions</span>
        </div>
        {posts.map((post) => (
          <div
            key={post.id}
            className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-[#F8F8F8] transition-colors"
          >
            <div className="col-span-5 flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 bg-[#E4EBEB] flex items-center justify-center font-mono text-[10px] font-semibold text-[#0D0D0D] flex-shrink-0">
                {post.avatar}
              </div>
              <div className="min-w-0">
                <p className="font-sans text-sm font-medium text-[#0D0D0D] truncate">
                  {post.title}
                </p>
                <p className="font-mono text-[10px] text-[#6B6B6B]">
                  by {post.author}
                </p>
              </div>
            </div>
            <span
              className="col-span-2 font-mono text-[10px] px-2 py-1 w-fit tracking-widest uppercase"
              style={{
                color: categoryColors[post.category] ?? "#6B6B6B",
                background: `${categoryColors[post.category] ?? "#6B6B6B"}15`,
              }}
            >
              {post.category}
            </span>
            <span className="col-span-2 font-mono text-xs text-[#6B6B6B]">
              {post.date}
            </span>
            <div className="col-span-2 flex items-center gap-3 font-mono text-xs text-[#6B6B6B]">
              <span className="flex items-center gap-1">
                <Heart size={11} /> {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={11} /> {post.comments}
              </span>
            </div>
            <div className="col-span-1 flex justify-end">
              <button
                onClick={() => remove(post.id)}
                className="text-[#D0D0D0] hover:text-[#DC2626] transition-colors"
                aria-label="Delete post"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="px-5 py-16 text-center">
            <BookOpen size={28} className="mx-auto text-[#D0D0D0] mb-3" />
            <p className="font-mono text-sm text-[#6B6B6B]">
              No posts yet. Create the first one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
