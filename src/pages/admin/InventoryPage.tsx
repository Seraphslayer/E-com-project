import { useState } from "react";
import {
  Search,
  Plus,
  AlertTriangle,
  Package,
  Pencil,
  Trash2,
} from "lucide-react";
import { products as initialProducts, Product } from "../../data/mockData";
import ProductFormModal from "../../components/admin/ProductFormModal";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = filter === "All" || p.category === filter;
    return matchSearch && matchCat;
  });

  const lowStock = products.filter((p) => p.stock < 30).length;
  const totalItems = products.reduce((s, p) => s + p.stock, 0);
  const totalSKUs = products.length;

  const openAdd = () => {
    setEditingProduct(null);
    setModalMode("add");
  };
  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setModalMode("edit");
  };
  const closeModal = () => {
    setModalMode(null);
    setEditingProduct(null);
  };

  const handleSave = (product: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      return exists
        ? prev.map((p) => (p.id === product.id ? product : p))
        : [product, ...prev];
    });
    closeModal();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Remove this product from inventory?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-1">
            Service 04
          </p>
          <h1 className="font-display font-bold text-3xl text-[#0D0D0D] tracking-tight">
            Inventory
          </h1>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#EACD51] text-[#0D0D0D] px-4 py-2.5 font-mono text-xs tracking-widest uppercase hover:bg-[#D4B63A] transition-colors"
        >
          <Plus size={13} /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Total SKUs",
            value: totalSKUs,
            icon: Package,
            color: "#D4B63A",
          },
          {
            label: "Total Units",
            value: totalItems.toLocaleString(),
            icon: Package,
            color: "#00875A",
          },
          {
            label: "Low Stock",
            value: lowStock,
            icon: AlertTriangle,
            color: "#FF8C00",
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
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 border border-[#E2E2E2] px-3 py-2 flex-1 max-w-xs bg-white">
          <Search size={13} className="text-[#6B6B6B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU..."
            className="flex-1 font-sans text-sm outline-none placeholder:text-[#D0D0D0]"
          />
        </div>
        <div className="flex gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-2 font-mono text-xs tracking-wide transition-colors ${
                filter === cat
                  ? "bg-[#0D0D0D] text-white"
                  : "bg-white border border-[#E2E2E2] text-[#6B6B6B] hover:border-[#0D0D0D]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E2E2E2]">
        <div className="grid grid-cols-12 gap-4 px-5 py-2.5 font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase border-b border-[#E2E2E2]">
          <span className="col-span-4">Product</span>
          <span className="col-span-2">SKU</span>
          <span className="col-span-1">Category</span>
          <span className="col-span-1 text-right">Price</span>
          <span className="col-span-2 text-right">Stock</span>
          <span className="col-span-1 text-right">Rating</span>
          <span className="col-span-1 text-right">Actions</span>
        </div>

        {filtered.map((product) => {
          const isLow = product.stock < 30;
          return (
            <div
              key={product.id}
              onClick={() => openEdit(product)}
              className="grid grid-cols-12 gap-4 px-5 py-3.5 border-b border-[#E2E2E2] last:border-0 hover:bg-[#F8F8F8] transition-colors items-center cursor-pointer"
            >
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-[#EBF0F0] overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-[#0D0D0D] leading-snug">
                    {product.name}
                  </p>
                  <p className="font-mono text-[10px] text-[#6B6B6B]">
                    {product.brand}
                  </p>
                </div>
              </div>
              <span className="col-span-2 font-mono text-xs text-[#6B6B6B]">
                {product.sku}
              </span>
              <span className="col-span-1 font-mono text-[11px] text-[#6B6B6B]">
                {product.category}
              </span>
              <div className="col-span-1 text-right">
                <span className="font-display font-semibold text-sm text-[#0D0D0D]">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <p className="font-mono text-[10px] text-[#B0B0B0] line-through">
                    ${product.originalPrice}
                  </p>
                )}
              </div>
              <div className="col-span-2 text-right">
                <div className="flex items-center justify-end gap-2">
                  {isLow && (
                    <AlertTriangle size={12} className="text-[#FF8C00]" />
                  )}
                  <span
                    className={`font-mono text-sm font-semibold ${isLow ? "text-[#FF8C00]" : "text-[#0D0D0D]"}`}
                  >
                    {product.stock}
                  </span>
                </div>
                <div className="mt-1 h-1 bg-[#E4EBEB] w-24 ml-auto">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${Math.min(100, (product.stock / 300) * 100)}%`,
                      background: isLow ? "#FF8C00" : "#00875A",
                    }}
                  />
                </div>
              </div>
              <div className="col-span-1 text-right">
                <span className="font-mono text-sm text-[#0D0D0D]">
                  {product.rating} ★
                </span>
                <p className="font-mono text-[10px] text-[#6B6B6B]">
                  {product.reviews} reviews
                </p>
              </div>
              <div className="col-span-1 flex items-center justify-end gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit(product);
                  }}
                  className="text-[#6B6B6B] hover:text-[#856A00] transition-colors"
                  aria-label="Edit product"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={(e) => handleDelete(product.id, e)}
                  className="text-[#6B6B6B] hover:text-[#DC2626] transition-colors"
                  aria-label="Delete product"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="font-mono text-sm text-[#6B6B6B]">
              No products match your filters.
            </p>
          </div>
        )}
      </div>

      <p className="font-mono text-[11px] text-[#6B6B6B] mt-3">
        {filtered.length} of {products.length} products shown
      </p>

      {modalMode && (
        <ProductFormModal
          product={modalMode === "edit" ? editingProduct : null}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
