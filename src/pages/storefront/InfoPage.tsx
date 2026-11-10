import { Link, useParams, Navigate } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowLeft, FileText } from "lucide-react";
import { company, categories } from "../../data/companyInfo";

interface Section {
  heading: string;
  body: string;
}

interface Topic {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Section[];
  draft?: boolean;
}

// Policy topics are placeholders until FGT supplies its own wording (flagged with `draft`).
const topics: Record<string, Topic> = {
  contact: {
    eyebrow: "Contact",
    title: "Talk to FGT Trading OPC",
    intro:
      "Call, email, or visit us in Dasmariñas, Cavite. For project pricing, the fastest route is a quote request.",
    sections: [],
  },
  support: {
    eyebrow: "Installation & Support",
    title: "Installed properly, supported for the long run",
    intro:
      "FGT supplies and installs land mobile communication, CCTV, access control, audio-visual, and IT equipment, and stays on for after-sales support.",
    sections: [
      {
        heading: "What we install",
        body: categories.map((c) => c.name).join(", ") + ".",
      },
      {
        heading: "How it works",
        body: "Send a quote request with your site details. We review requirements, prepare a quotation covering supply, delivery, and installation, and schedule site work once approved.",
      },
      {
        heading: "After-sales",
        body: "Maintenance contracts and support are available for supplied equipment. Contact us with your order number or the equipment model.",
      },
    ],
  },
  procurement: {
    eyebrow: "Procurement & Bidding",
    title: "Supplying LGUs and government agencies",
    intro:
      "FGT has served local government units and agencies across Cavite and the Clark Freeport Zone for over 30 years.",
    sections: [
      {
        heading: "Quotations",
        body: "We prepare formal quotations for supply, delivery, and installation to support your purchase requests and bidding documents.",
      },
      {
        heading: "Documents",
        body: "For eligibility and registration documents, contact our team and we will send what your procurement office requires.",
      },
    ],
  },
  privacy: {
    eyebrow: "Privacy Policy",
    title: "Privacy Policy",
    intro:
      "We collect only the details you give us (name, organization, contact details, and project requirements) to respond to quotes and fulfil orders.",
    sections: [
      {
        heading: "How we use it",
        body: "To prepare quotations, process and deliver orders, and provide support. We do not sell personal information.",
      },
      {
        heading: "Questions",
        body: `Contact ${company.contact.email} about your personal data.`,
      },
    ],
    draft: true,
  },
  terms: {
    eyebrow: "Terms of Service",
    title: "Terms of Service",
    intro:
      "Prices and availability are subject to change and confirmation. Quotations state their own validity period.",
    sections: [
      {
        heading: "Orders and payment",
        body: "An order is confirmed once payment or an approved purchase order is received and stock is allocated.",
      },
      {
        heading: "Warranty and returns",
        body: "Warranty terms follow the equipment manufacturer's policy. Contact us for returns and warranty claims.",
      },
    ],
    draft: true,
  },
};

export default function InfoPage() {
  const { topic = "" } = useParams();
  const t = topics[topic];
  if (!t) return <Navigate to="/store/info/contact" replace />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link
        to="/store"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-[#6B6B6B] hover:text-[#856A00] transition-colors mb-6"
      >
        <ArrowLeft size={12} /> Back to store
      </Link>
      <p className="font-mono text-[11px] text-[#856A00] tracking-widest uppercase mb-1">
        {t.eyebrow}
      </p>
      <h1 className="font-display font-bold text-2xl sm:text-4xl text-[#0D0D0D] tracking-tight mb-3">
        {t.title}
      </h1>
      <p className="text-[#6B6B6B] text-sm sm:text-base leading-relaxed mb-8">{t.intro}</p>

      {t.draft && (
        <p className="border border-[#D4B63A] bg-[#FBF5D6] text-[#856A00] font-mono text-[11px] px-3 py-2 mb-8">
          Draft wording. To be reviewed and replaced by FGT before launch.
        </p>
      )}

      <div className="space-y-6 mb-10">
        {t.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display font-semibold text-[#0D0D0D] mb-1.5">{s.heading}</h2>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>

      <div className="bg-[#0D0D0D] p-6 space-y-3">
        <p className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
          {company.name}
        </p>
        <a href={`tel:${company.contact.phone}`} className="flex items-start gap-2.5 text-white/80 hover:text-white">
          <Phone size={14} className="mt-0.5 shrink-0" />
          <span className="text-sm">{company.contact.phone} / {company.contact.mobile}</span>
        </a>
        <a href={`mailto:${company.contact.email}`} className="flex items-start gap-2.5 text-white/80 hover:text-white">
          <Mail size={14} className="mt-0.5 shrink-0" />
          <span className="text-sm break-all">{company.contact.email}</span>
        </a>
        <div className="flex items-start gap-2.5 text-white/60">
          <MapPin size={14} className="mt-0.5 shrink-0" />
          <span className="text-sm leading-relaxed">{company.contact.address}</span>
        </div>
        <Link
          to="/store/quote"
          className="inline-flex items-center gap-2 bg-[#EACD51] text-[#0D0D0D] px-5 py-2.5 font-mono text-xs tracking-widest uppercase hover:bg-[#D4B63A] transition-colors mt-2"
        >
          <FileText size={13} /> Request a Quote
        </Link>
      </div>
    </div>
  );
}
