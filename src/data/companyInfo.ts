// Core company profile and catalog metadata for FGT Trading OPC.
// Sourced from the client's company profile (FGT Trading OPC Company Profile, A4 PDF).

export const company = {
  name: "FGT Trading OPC",
  shortName: "FGT",
  foundedNote: "30+ Years of Service",
  tagline: "Your bases, covered.",
  subtagline:
    "Supply, installation, and support for land mobile communication, surveillance, access control, audio-visual, and IT equipment — trusted by LGUs, government agencies, and businesses across Cavite and beyond.",
  description:
    "FGT Trading OPC is a Cavite, Philippines-based supplier and installer of IT, communications, surveillance, and audio-visual equipment, serving local government units, the Clark Freeport Zone, and private businesses for over 30 years.",
  mission:
    "To provide reliable, well-engineered communication, surveillance, and IT systems that keep public institutions and private businesses connected, secure, and productive — backed by honest service and dependable after-sales support.",
  vision:
    "To be the most trusted name in equipment supply and systems integration across Cavite and the wider Calabarzon region, known equally by government partners and private clients for quality, integrity, and follow-through.",
  promise:
    "Every project — big or small — is handled with the same standard: the right equipment, properly installed, and supported for the long run.",
  contact: {
    phone: "(046) 540-7647",
    mobile: "0919 069 8086",
    email: "fgttradingph@gmail.com",
    address:
      "Block 3 Lot 8 Almond St, Summerwind Village Phase 1, Salitran III, Dasmariñas City, Cavite",
  },
};

export interface CatalogCategory {
  slug: string;
  name: string;
  blurb: string;
  offerings: string[];
}

export const categories: CatalogCategory[] = [
  {
    slug: "land-mobile-communication",
    name: "Land Mobile Communication",
    blurb:
      "Two-way radios, repeaters, and base stations for coordinated field operations — handheld to vehicle-mounted.",
    offerings: [
      "Handheld & portable radios",
      "Mobile transceivers",
      "Repeaters & base stations",
      "Antennas & accessories",
      "Licensing & frequency coordination support",
    ],
  },
  {
    slug: "cctv-surveillance",
    name: "CCTV Surveillance",
    blurb:
      "IP and analog camera systems, NVRs, and monitoring setups for sites of any scale, from a single storefront to a city network.",
    offerings: [
      "IP & analog cameras",
      "NVRs & DVRs",
      "Video management software",
      "Storage & networking",
      "Remote monitoring setup",
    ],
  },
  {
    slug: "access-control",
    name: "Access Control",
    blurb:
      "Biometric, RFID, and turnstile systems to secure entry points and manage who goes where.",
    offerings: [
      "Biometric controllers",
      "RFID & card readers",
      "Turnstiles & gate barriers",
      "Visitor management",
      "Integration with existing security systems",
    ],
  },
  {
    slug: "audio-visual",
    name: "Audio & Visual",
    blurb:
      "Sound reinforcement, conferencing, and display systems for briefing rooms, events, and public announcements.",
    offerings: [
      "PA & sound systems",
      "Conference & meeting room AV",
      "LED walls & displays",
      "Cameras & streaming gear",
      "Installation & calibration",
    ],
  },
  {
    slug: "it-equipment-peripherals",
    name: "IT Equipment & Peripherals",
    blurb:
      "Computers, networking, printing, and power protection equipment for offices and government facilities.",
    offerings: [
      "Desktops, laptops & servers",
      "Networking equipment",
      "Printers & scanners",
      "UPS & power protection",
      "Maintenance contracts",
    ],
  },
];

export const brandsByGroup: { group: string; brands: string[] }[] = [
  {
    group: "Communication",
    brands: ["Kenwood", "Baofeng", "Hytera", "Motorola", "Cognus"],
  },
  {
    group: "Surveillance",
    brands: ["Hikvision", "Dahua"],
  },
  {
    group: "Networking",
    brands: ["Cisco", "TP-Link", "Ubiquiti", "Fortinet"],
  },
  {
    group: "Audio-Visual",
    brands: ["Sony", "DJI", "Insta360", "GoPro", "JBL", "Shure", "QSC", "Kevler"],
  },
  {
    group: "IT Equipment",
    brands: ["HP", "MSI", "Lenovo", "Acer", "Dell", "Asus", "Brother", "Canon", "Epson", "Apple", "CyberPower", "APC"],
  },
];

export const majorClients: string[] = [
  "Lungsod ng Bacoor",
  "Clark Freeport Philippines",
  "Lungsod ng Trece Martires",
  "Lungsod ng Imus",
  "Bayan ng Ternate",
  "Lalawigan ng Kabite",
  "Bayan ng Carmona",
  "La Trinidad Academy",
  "Bayan ng Magallanes",
  "Bayan ng Gen. E. Aguinaldo",
  "Bayan ng Indang",
  "Bayan ng Amadeo",
];

export function formatPHP(amount: number): string {
  return `₱${amount.toLocaleString("en-PH")}`;
}
