import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { FileText, CheckCircle, Phone, Mail, MapPin, ArrowLeft } from "lucide-react";
import { company, categories } from "../../data/companyInfo";

export default function QuoteRequestPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const prefillProduct = searchParams.get("product") || "";

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    category: "",
    items: prefillProduct ? `${prefillProduct} — ` : "",
    message: "",
  });

  const update = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-24 text-center">
        <div className="w-16 h-16 bg-[#00875A]/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-[#00875A]" />
        </div>
        <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-2">Request Received</p>
        <h1 className="font-display font-bold text-3xl text-[#0D0D0D] mb-3">Thank you, {form.name.split(" ")[0] || "there"}!</h1>
        <p className="text-[#6B6B6B] font-sans text-sm mb-8">
          Our team will review your request and reach out within 1–2 business days with a formal quotation.
          For urgent inquiries, call us at{" "}
          <a href={`tel:${company.contact.phone}`} className="text-[#856A00] font-mono">{company.contact.phone}</a>.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/store")}
            className="bg-[#EACD51] text-[#0D0D0D] px-6 py-3 font-mono text-sm tracking-widest uppercase hover:bg-[#D4B63A] transition-colors"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/store" className="inline-flex items-center gap-1.5 font-mono text-xs text-[#6B6B6B] hover:text-[#856A00] transition-colors mb-6">
        <ArrowLeft size={12} /> Back to store
      </Link>

      <div className="mb-8 max-w-2xl">
        <p className="font-mono text-[11px] text-[#856A00] tracking-widest uppercase mb-1">Request a Quote</p>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0D0D0D] tracking-tight mb-3">
          Tell us about your project
        </h1>
        <p className="text-[#6B6B6B] text-sm leading-relaxed">
          Whether it's a single unit or a citywide installation, give us the details and our team will prepare
          a formal quotation — including supply, delivery, and installation where needed.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white border border-[#E2E2E2] p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
                Full Name
              </label>
              <input
                required
                type="text"
                value={form.name}
                onChange={update("name")}
                placeholder="Juan Dela Cruz"
                className="w-full border border-[#E2E2E2] px-3 py-2.5 font-sans text-sm text-[#0D0D0D] outline-none focus:border-[#D4B63A] transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
                Company / Agency
              </label>
              <input
                type="text"
                value={form.organization}
                onChange={update("organization")}
                placeholder="LGU, office, or business name"
                className="w-full border border-[#E2E2E2] px-3 py-2.5 font-sans text-sm text-[#0D0D0D] outline-none focus:border-[#D4B63A] transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
                Email
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={update("email")}
                placeholder="you@organization.gov.ph"
                className="w-full border border-[#E2E2E2] px-3 py-2.5 font-sans text-sm text-[#0D0D0D] outline-none focus:border-[#D4B63A] transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
                Phone
              </label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={update("phone")}
                placeholder="09XX XXX XXXX"
                className="w-full border border-[#E2E2E2] px-3 py-2.5 font-sans text-sm text-[#0D0D0D] outline-none focus:border-[#D4B63A] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
              Solution Category
            </label>
            <select
              value={form.category}
              onChange={update("category")}
              className="w-full border border-[#E2E2E2] px-3 py-2.5 font-sans text-sm text-[#0D0D0D] outline-none focus:border-[#D4B63A] transition-colors bg-white"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.name}>{c.name}</option>
              ))}
              <option value="Other">Other / Not sure</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
              Items / Equipment Needed
            </label>
            <input
              type="text"
              value={form.items}
              onChange={update("items")}
              placeholder="e.g. 12x IP cameras for perimeter coverage"
              className="w-full border border-[#E2E2E2] px-3 py-2.5 font-sans text-sm text-[#0D0D0D] outline-none focus:border-[#D4B63A] transition-colors"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
              Project Details
            </label>
            <textarea
              value={form.message}
              onChange={update("message")}
              rows={5}
              placeholder="Site location, quantity, timeline, whether installation is needed, budget range, etc."
              className="w-full border border-[#E2E2E2] px-3 py-2.5 font-sans text-sm text-[#0D0D0D] outline-none focus:border-[#D4B63A] transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#EACD51] text-[#0D0D0D] py-3.5 font-mono text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#D4B63A] transition-colors"
          >
            <FileText size={15} /> Submit Request
          </button>
        </form>

        <div>
          <div className="bg-[#0D0D0D] p-6 mb-4">
            <p className="font-mono text-[10px] text-white/40 tracking-widest uppercase mb-3">Talk to us directly</p>
            <div className="space-y-3">
              <a href={`tel:${company.contact.phone}`} className="flex items-start gap-2.5 text-white/80 hover:text-white transition-colors">
                <Phone size={14} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">{company.contact.phone} / {company.contact.mobile}</span>
              </a>
              <a href={`mailto:${company.contact.email}`} className="flex items-start gap-2.5 text-white/80 hover:text-white transition-colors">
                <Mail size={14} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">{company.contact.email}</span>
              </a>
              <div className="flex items-start gap-2.5 text-white/60">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm leading-relaxed">{company.contact.address}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E2E2E2] p-6">
            <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-3">What happens next</p>
            <ol className="space-y-3 text-sm text-[#6B6B6B] leading-relaxed">
              <li><span className="font-display font-semibold text-[#0D0D0D]">1. Review —</span> our team checks requirements and availability.</li>
              <li><span className="font-display font-semibold text-[#0D0D0D]">2. Quotation —</span> we prepare pricing for supply, delivery, and installation.</li>
              <li><span className="font-display font-semibold text-[#0D0D0D]">3. Confirmation —</span> once approved, we schedule delivery or site work.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
