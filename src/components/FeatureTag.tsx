import {
  Wifi,
  Volume2,
  ShieldCheck,
  Leaf,
  Droplets,
  BatteryFull,
  Sparkles,
  Tag as TagIcon,
} from "lucide-react";

// Small icon lookup for feature tags — falls back to a generic tag icon for
// anything not explicitly mapped. Reads directly from each product's own
// `tags` field, so it never invents data that isn't already there.
const tagIcons: Record<string, typeof TagIcon> = {
  wireless: Wifi,
  bluetooth: Wifi,
  "noise-cancelling": Volume2,
  premium: ShieldCheck,
  sustainable: Leaf,
  eco: Leaf,
  waterproof: Droplets,
  "BPA-free": Droplets,
  insulated: BatteryFull,
  handmade: Sparkles,
};

export default function FeatureTag({
  tag,
  size = "sm",
}: {
  tag: string;
  size?: "sm" | "md";
}) {
  const Icon = tagIcons[tag] ?? TagIcon;
  const textSize = size === "md" ? "text-[11px]" : "text-[9px]";
  const iconSize = size === "md" ? 13 : 11;
  return (
    <span
      className={`flex items-center gap-1 font-mono ${textSize} text-[#6B6B6B] tracking-wide uppercase`}
    >
      <Icon size={iconSize} />
      {tag}
    </span>
  );
}
