import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Phone, Mail, MapPin } from "lucide-react";
import { company, categories } from "../data/companyInfo";

const shopLinks = categories.map((c) => c.name);
const helpLinks = [
  "Contact Us",
  "Request a Quote",
  "Installation & Support",
  "Track Order",
];
const policyLinks = [
  "Privacy Policy",
  "Terms of Service",
  "Procurement & Bidding",
];

function SocialIcon({ path, label }: { path: string; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="text-[#6B6B6B] hover:text-[#0D0D0D] transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d={path} />
      </svg>
    </a>
  );
}

const socials = [
  {
    label: "Facebook",
    path: "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z",
  },
  {
    label: "Instagram",
    path: "M12 2c2.7 0 3.1 0 4.1.1 1.1 0 1.8.2 2.5.5.7.3 1.2.6 1.8 1.2.6.6.9 1.1 1.2 1.8.3.7.5 1.4.5 2.5.1 1 .1 1.4.1 4.1s0 3.1-.1 4.1c0 1.1-.2 1.8-.5 2.5-.3.7-.6 1.2-1.2 1.8-.6.6-1.1.9-1.8 1.2-.7.3-1.4.5-2.5.5-1 .1-1.4.1-4.1.1s-3.1 0-4.1-.1c-1.1 0-1.8-.2-2.5-.5-.7-.3-1.2-.6-1.8-1.2-.6-.6-.9-1.1-1.2-1.8-.3-.7-.5-1.4-.5-2.5C2 15.1 2 14.7 2 12s0-3.1.1-4.1c0-1.1.2-1.8.5-2.5.3-.7.6-1.2 1.2-1.8C4.4 3 4.9 2.7 5.6 2.4c.7-.3 1.4-.5 2.5-.5C9.1 2 9.5 2 12 2Zm0 1.8c-2.6 0-2.9 0-4 .1-.9 0-1.4.2-1.7.3-.4.2-.7.3-1 .6-.3.3-.5.6-.6 1-.1.3-.3.8-.3 1.7-.1 1-.1 1.4-.1 4s0 2.9.1 4c0 .9.2 1.4.3 1.7.2.4.3.7.6 1 .3.3.6.5 1 .6.3.1.8.3 1.7.3 1 .1 1.4.1 4 .1s2.9 0 4-.1c.9 0 1.4-.2 1.7-.3.4-.2.7-.3 1-.6.3-.3.5-.6.6-1 .1-.3.3-.8.3-1.7.1-1 .1-1.4.1-4s0-2.9-.1-4c0-.9-.2-1.4-.3-1.7-.2-.4-.3-.7-.6-1-.3-.3-.6-.5-1-.6-.3-.1-.8-.3-1.7-.3-1-.1-1.4-.1-4-.1Zm0 3.5a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4Zm0 1.8a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Zm5-2a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z",
  },
  {
    label: "YouTube",
    path: "M23 12s0-3.5-.4-5.1a3 3 0 0 0-2.1-2.1C18.9 4.4 12 4.4 12 4.4s-6.9 0-8.5.4A3 3 0 0 0 1.4 6.9C1 8.5 1 12 1 12s0 3.5.4 5.1a3 3 0 0 0 2.1 2.1c1.6.4 8.5.4 8.5.4s6.9 0 8.5-.4a3 3 0 0 0 2.1-2.1C23 15.5 23 12 23 12ZM9.8 15.5v-7l6 3.5-6 3.5Z",
  },
  {
    label: "X",
    path: "M18.9 2H22l-7.2 8.2L23 22h-6.6l-5.2-6.8L5.2 22H2l7.7-8.8L1 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.7L7.4 4H5.6l12.1 16Z",
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-[#EBF0F0] border-t border-[#E2E2E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-[#EACD51] flex items-center justify-center">
              <span className="font-display font-bold text-[#0D0D0D] text-xs">
                F
              </span>
            </div>
            <span className="font-display font-semibold text-[#0D0D0D] tracking-tight">
              {company.name}
            </span>
          </div>
          <p className="text-sm text-[#6B6B6B] leading-relaxed mb-4">
            {company.description}
          </p>
          <div className="space-y-2 mb-4">
            <a href={`tel:${company.contact.mobile.replace(/\s/g, "")}`} className="flex items-start gap-2 text-sm text-[#6B6B6B] hover:text-[#0D0D0D] transition-colors">
              <Phone size={13} className="mt-0.5 shrink-0" />
              {company.contact.mobile} · {company.contact.phone}
            </a>
            <a href={`mailto:${company.contact.email}`} className="flex items-start gap-2 text-sm text-[#6B6B6B] hover:text-[#0D0D0D] transition-colors">
              <Mail size={13} className="mt-0.5 shrink-0" />
              {company.contact.email}
            </a>
            <p className="flex items-start gap-2 text-sm text-[#6B6B6B]">
              <MapPin size={13} className="mt-0.5 shrink-0" />
              {company.contact.address}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <SocialIcon key={s.label} {...s} />
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-mono text-[11px] tracking-widest uppercase text-[#0D0D0D] mb-4">
            Shop
          </h4>
          <ul className="space-y-2.5">
            {shopLinks.map((link) => (
              <li key={link}>
                <Link
                  to={`/store/products?category=${encodeURIComponent(link)}`}
                  className="text-sm text-[#6B6B6B] hover:text-[#0D0D0D] transition-colors"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[11px] tracking-widest uppercase text-[#0D0D0D] mb-4">
            Help &amp; Support
          </h4>
          <ul className="space-y-2.5">
            {helpLinks.map((link) => (
              <li key={link}>
                <Link
                  to={link === "Request a Quote" ? "/store/quote" : "/store"}
                  className="text-sm text-[#6B6B6B] hover:text-[#0D0D0D] transition-colors"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[11px] tracking-widest uppercase text-[#0D0D0D] mb-4">
            Newsletter
          </h4>
          <p className="text-sm text-[#6B6B6B] mb-3">
            Get exclusive offers and new arrivals in your inbox.
          </p>
          {subscribed ? (
            <div className="flex items-center gap-2 text-sm text-[#00875A] font-mono">
              <Check size={14} /> Subscribed
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex items-center border border-[#D0D0D0] bg-white"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-3 py-2 text-sm bg-transparent outline-none min-w-0"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="px-3 py-2 text-[#0D0D0D] hover:text-[#856A00] transition-colors shrink-0"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-[#E2E2E2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[11px] text-[#6B6B6B]">
            © 2026 {company.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5 flex-wrap justify-center">
            {policyLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="font-mono text-[11px] text-[#6B6B6B] hover:text-[#0D0D0D] transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
