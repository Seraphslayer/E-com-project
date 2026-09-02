import { useState } from "react";
import { X } from "lucide-react";
import { Product } from "../../data/mockData";

const categories = [
  "Electronics",
  "Accessories",
  "Apparel",
  "Kitchen",
  "Sports",
];

interface ProductFormModalProps {
  product?: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export default function ProductFormModal({
  product,
  onClose,
  onSave,
}: ProductFormModalProps) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: product?.name ?? "",
    brand: product?.brand ?? "",
    category: product?.category ?? categories[0],
    price: product?.price?.toString() ?? "",
    originalPrice: product?.originalPrice?.toString() ?? "",
    sku: product?.sku ?? "",
    stock: product?.stock?.toString() ?? "",
    image: product?.image ?? "",
    description: product?.description ?? "",
    tags: product?.tags?.join(", ") ?? "",
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const saved: Product = {
      id: product?.id ?? `p${Date.now()}`,
      name: form.name,
      brand: form.brand,
      category: form.category,
      price: Number(form.price) || 0,
      originalPrice: form.originalPrice
        ? Number(form.originalPrice)
        : undefined,
      sku: form.sku,
      stock: Number(form.stock) || 0,
      rating: product?.rating ?? 0,
      reviews: product?.reviews ?? 0,
      image:
        form.image ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&auto=format",
      description: form.description,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    onSave(saved);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white border border-[#E2E2E2] w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E2E2] sticky top-0 bg-white">
          <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase">
            {isEdit ? "Edit Product" : "Add Product"}
          </p>
          <button
            onClick={onClose}
            className="text-[#6B6B6B] hover:text-[#0D0D0D] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
                Product Name
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full border border-[#E2E2E2] px-3 py-2.5 font-sans text-sm outline-none focus:border-[#0047FF] transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
                Brand
              </label>
              <input
                required
                value={form.brand}
                onChange={(e) => set("brand", e.target.value)}
                className="w-full border border-[#E2E2E2] px-3 py-2.5 font-sans text-sm outline-none focus:border-[#0047FF] transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full border border-[#E2E2E2] px-3 py-2.5 font-mono text-sm outline-none focus:border-[#0047FF] transition-colors bg-white"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
                Price ($)
              </label>
              <input
                required
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className="w-full border border-[#E2E2E2] px-3 py-2.5 font-mono text-sm outline-none focus:border-[#0047FF] transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
                Original Price (optional)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.originalPrice}
                onChange={(e) => set("originalPrice", e.target.value)}
                className="w-full border border-[#E2E2E2] px-3 py-2.5 font-mono text-sm outline-none focus:border-[#0047FF] transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
                SKU
              </label>
              <input
                required
                value={form.sku}
                onChange={(e) => set("sku", e.target.value)}
                className="w-full border border-[#E2E2E2] px-3 py-2.5 font-mono text-sm outline-none focus:border-[#0047FF] transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
                Stock
              </label>
              <input
                required
                type="number"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                className="w-full border border-[#E2E2E2] px-3 py-2.5 font-mono text-sm outline-none focus:border-[#0047FF] transition-colors"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
                Image URL
              </label>
              <input
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
                placeholder="https://…"
                className="w-full border border-[#E2E2E2] px-3 py-2.5 font-mono text-sm outline-none focus:border-[#0047FF] transition-colors"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                className="w-full border border-[#E2E2E2] px-3 py-2.5 font-sans text-sm outline-none focus:border-[#0047FF] transition-colors resize-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
                Tags (comma separated)
              </label>
              <input
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="wireless, premium, waterproof"
                className="w-full border border-[#E2E2E2] px-3 py-2.5 font-mono text-sm outline-none focus:border-[#0047FF] transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#E2E2E2] py-2.5 font-mono text-xs tracking-widest uppercase hover:border-[#0D0D0D] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#0047FF] text-white py-2.5 font-mono text-xs tracking-widest uppercase hover:bg-[#0035CC] transition-colors"
            >
              {isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
