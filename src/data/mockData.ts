export interface Product {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  category: string
  sku: string
  stock: number
  rating: number
  reviews: number
  image: string
  /** Extra photos shown in the product gallery (the first one is also `image`). */
  images?: string[]
  /** Optional product video (uploaded file or link). */
  video?: string
  description: string
  tags: string[]
  quoteOnly?: boolean
}

export interface Order {
  id: string
  date: string
  customer: string
  email: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: number
  total: number
  tracking?: string
}

export interface Review {
  id: string
  author: string
  avatar: string
  rating: number
  date: string
  title: string
  body: string
  verified: boolean
  productId: string
  productName: string
  helpful: number
}

export interface BlogPost {
  id: string
  author: string
  avatar: string
  date: string
  title: string
  body: string
  category: string
  likes: number
  comments: number
  image?: string
}

export interface ChatMessage {
  id: string
  sender: 'customer' | 'support'
  name: string
  message: string
  time: string
  read: boolean
}

// Placeholder catalog for FGT Trading OPC — pricing and specs are
// illustrative pending the client's real price list and inventory feed.
// Neutral placeholder for products awaiting a real photo (upload one via Admin > Inventory).
const PLACEHOLDER_IMG = "data:image/svg+xml;utf8," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><rect width='600' height='600' fill='#EBF0F0'/><text x='300' y='310' font-family='monospace' font-size='22' fill='#6B6B6B' text-anchor='middle'>PHOTO COMING SOON</text></svg>")

export const products: Product[] = [
  {
    id: 'p1', name: 'NX-5700 VHF/UHF Portable Radio', brand: 'Kenwood',
    price: 8500, category: 'Land Mobile Communication', sku: 'KWD-NX5700',
    stock: 42, rating: 4.8, reviews: 31,
    image: 'https://images.unsplash.com/photo-1623961990059-28356d8fc3c0?w=600&h=600&fit=crop&auto=format',
    description: 'NXDN/analog dual-mode portable radio built for dispatch and field teams. IP67-rated housing, GPS, and long-range coverage for LGU and facility operations.',
    tags: ['two-way radio', 'IP67', 'GPS', 'NXDN'],
  },
  {
    id: 'p2', name: 'TC-620 Mobile Transceiver', brand: 'Hytera',
    price: 14200, category: 'Land Mobile Communication', sku: 'HYT-TC620',
    stock: 18, rating: 4.7, reviews: 14,
    image: 'https://images.unsplash.com/photo-1610298396099-98db4c9e5ab2?w=600&h=600&fit=crop&auto=format',
    description: 'Vehicle-mount base transceiver for dispatch consoles and repeater-linked networks. Supports trunked and conventional operation.',
    tags: ['base station', 'trunked', 'vehicle-mount'],
    quoteOnly: true,
  },
  {
    id: 'p3', name: 'DS-2CD2387 4K Turret Network Camera', brand: 'Hikvision',
    price: 6950, category: 'CCTV Surveillance', sku: 'HIK-2CD2387',
    stock: 65, rating: 4.9, reviews: 58,
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&h=600&fit=crop&auto=format',
    description: '8MP IP turret camera with WDR, smart motion detection, and IR night vision up to 30m. Common deployment for building and road monitoring systems.',
    tags: ['4K', 'night vision', 'IP camera', 'WDR'],
  },
  {
    id: 'p4', name: 'DH-NVR5232 32-Channel NVR', brand: 'Dahua',
    price: 24800, category: 'CCTV Surveillance', sku: 'DAH-NVR5232',
    stock: 9, rating: 4.6, reviews: 11,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=600&fit=crop&auto=format',
    description: '32-channel network video recorder with RAID support, built for citywide and multi-site surveillance deployments.',
    tags: ['NVR', '32-channel', 'RAID'],
    quoteOnly: true,
  },
  {
    id: 'p5', name: 'AC-200 Biometric Access Controller', brand: 'Hikvision',
    price: 11300, category: 'Access Control', sku: 'HIK-AC200',
    stock: 27, rating: 4.7, reviews: 22,
    image: 'https://images.unsplash.com/photo-1558002038-bb4237b50b3e?w=600&h=600&fit=crop&auto=format',
    description: 'Fingerprint and card-based access controller for office, factory, or residential-district entry points. Standalone or networked operation.',
    tags: ['biometric', 'card access', 'standalone'],
  },
  {
    id: 'p6', name: 'IC-Card Turnstile Gate', brand: 'Hikvision',
    price: 48500, category: 'Access Control', sku: 'HIK-TS100',
    stock: 6, rating: 4.5, reviews: 7,
    image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&h=600&fit=crop&auto=format',
    description: 'Tripod turnstile with IC-card and biometric integration, built for lobbies, factories, and secured facility entrances.',
    tags: ['turnstile', 'card system', 'facility'],
    quoteOnly: true,
  },
  {
    id: 'p7', name: 'QSC K10.2 Powered PA Speaker', brand: 'QSC',
    price: 42900, category: 'Audio & Visual', sku: 'QSC-K102',
    stock: 14, rating: 4.9, reviews: 19,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop&auto=format',
    description: '2000W powered loudspeaker for conferences, events, and public announcement systems. Integrated DSP tuning presets.',
    tags: ['PA system', 'powered speaker', 'DSP'],
  },
  {
    id: 'p8', name: 'P3 Indoor LED Video Wall Panel', brand: 'Kevler',
    price: 38500, category: 'Audio & Visual', sku: 'KVL-P3-IND',
    stock: 32, rating: 4.6, reviews: 16,
    image: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=600&h=600&fit=crop&auto=format',
    description: 'Fine-pitch indoor LED panel for digital signage and video wall installations, sold per module for custom-sized builds.',
    tags: ['LED wall', 'signage', 'modular'],
    quoteOnly: true,
  },
  {
    id: 'p9', name: 'Shure SM58 Wired Dynamic Mic', brand: 'Shure',
    price: 7200, category: 'Audio & Visual', sku: 'SHR-SM58',
    stock: 54, rating: 4.9, reviews: 44,
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&h=600&fit=crop&auto=format',
    description: 'Industry-standard dynamic vocal microphone for conferences, events, and public address systems.',
    tags: ['microphone', 'wired', 'conference'],
  },
  {
    id: 'p10', name: 'ProDesk 400 G9 Business Desktop', brand: 'HP',
    price: 32900, category: 'IT Equipment', sku: 'HP-PD400G9',
    stock: 38, rating: 4.7, reviews: 27,
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&h=600&fit=crop&auto=format',
    description: 'Business-class desktop for office and government workstation deployments. Configurable with Core i5/i7, SSD, and Windows 11 Pro.',
    tags: ['desktop', 'business', 'Windows 11'],
  },
  {
    id: 'p11', name: 'ThinkPad E14 Business Laptop', brand: 'Lenovo',
    price: 41500, category: 'IT Equipment', sku: 'LEN-E14G5',
    stock: 29, rating: 4.6, reviews: 33,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=600&fit=crop&auto=format',
    description: 'Durable business laptop with MIL-SPEC-tested chassis, suited for field offices and mobile government personnel.',
    tags: ['laptop', 'business', 'durable'],
  },
  {
    id: 'p12', name: 'PowerEdge T150 Tower Server', brand: 'Dell',
    price: 128000, category: 'IT Equipment', sku: 'DELL-T150',
    stock: 5, rating: 4.8, reviews: 9,
    image: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?w=600&h=600&fit=crop&auto=format',
    description: 'Entry-level tower server for small office or branch deployments — file sharing, local applications, and backup.',
    tags: ['server', 'tower', 'small office'],
    quoteOnly: true,
  },
  {
    id: 'p13', name: 'Back-UPS Pro 1500VA', brand: 'APC',
    price: 9800, category: 'IT Equipment', sku: 'APC-BRP1500',
    stock: 47, rating: 4.7, reviews: 38,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&h=600&fit=crop&auto=format',
    description: 'Line-interactive UPS with pure sine wave output, protecting servers, NVRs, and critical workstations from outages.',
    tags: ['UPS', 'power protection', '1500VA'],
  },  {
    id: 'p14', name: 'UV-5R Dual-Band Handheld Radio', brand: 'Baofeng',
    price: 1850, category: 'Land Mobile Communication', sku: 'BAO-UV5R',
    stock: 120, rating: 4.4, reviews: 63,
    image: PLACEHOLDER_IMG,
    description: 'Compact VHF/UHF dual-band handheld with dual display and FM radio. A budget-friendly option for security teams, events, and barangay patrols.',
    tags: ['handheld', 'VHF/UHF', 'dual-band'],
  },
  {
    id: 'p15', name: 'R7 Digital Portable Radio', brand: 'Motorola',
    price: 26500, category: 'Land Mobile Communication', sku: 'MOT-R7',
    stock: 15, rating: 4.8, reviews: 9,
    image: PLACEHOLDER_IMG,
    description: 'Full-keypad digital portable radio with Bluetooth and Wi-Fi, designed for demanding public-safety and enterprise fleets.',
    tags: ['digital', 'DMR', 'Bluetooth'],
    quoteOnly: true,
  },
  {
    id: 'p16', name: 'Catalyst C1200-8FP-2G Switch', brand: 'Cisco',
    price: 34900, category: 'IT Equipment', sku: 'CSC-C1200-8FP',
    stock: 22, rating: 4.7, reviews: 12,
    image: 'https://media.ldlc.com/r705/ld/products/00/06/11/92/LD0006119287.jpg',
    description: '8-port Gigabit PoE+ managed switch with 2 SFP uplinks, ideal for small branch offices and CCTV or access-point deployments.',
    tags: ['switch', 'PoE+', 'managed'],
  },
  {
    id: 'p17', name: 'Omada EAP670 Wi-Fi 6 Access Point', brand: 'TP-Link',
    price: 11900, category: 'IT Equipment', sku: 'TPL-EAP670',
    stock: 35, rating: 4.7, reviews: 21,
    image: 'https://media.ldlc.com/r705/ld/products/00/06/18/62/LD0006186202.jpg',
    description: 'AX5400 dual-band ceiling-mount access point with 2.5 GbE PoE port, MU-MIMO, and centralized Omada SDN management.',
    tags: ['Wi-Fi 6', 'AX5400', 'PoE', 'Omada'],
  },
  {
    id: 'p18', name: 'UniFi U6 Pro Access Point', brand: 'Ubiquiti',
    price: 8900, category: 'IT Equipment', sku: 'UBQ-U6PRO',
    stock: 28, rating: 4.7, reviews: 17,
    image: PLACEHOLDER_IMG,
    description: 'Wi-Fi 6 ceiling access point with 4x4 5 GHz streams and PoE, managed through the UniFi Network application.',
    tags: ['Wi-Fi 6', 'PoE', 'UniFi'],
  },
  {
    id: 'p19', name: 'FortiGate 60F Next-Generation Firewall', brand: 'Fortinet',
    price: 58000, category: 'IT Equipment', sku: 'FTN-FG60F',
    stock: 8, rating: 4.8, reviews: 6,
    image: 'https://media.ldlc.com/r705/ld/products/00/05/77/85/LD0005778526_1.jpg',
    description: 'Compact next-generation firewall with 10 Gigabit ports, SD-WAN, and VPN for branch and municipal office security. Licensing quoted separately.',
    tags: ['firewall', 'SD-WAN', 'VPN'],
    quoteOnly: true,
  },
  {
    id: 'p20', name: 'Alpha ZV-E10 II Mirrorless Camera', brand: 'Sony',
    price: 64000, category: 'Audio & Visual', sku: 'SNY-ZVE10M2',
    stock: 10, rating: 4.8, reviews: 14,
    image: PLACEHOLDER_IMG,
    description: 'APS-C mirrorless camera with 4K video, flip-out screen, and strong autofocus for content creation and event coverage.',
    tags: ['mirrorless', '4K', 'vlogging'],
  },
  {
    id: 'p21', name: 'Mini 4 Pro Drone', brand: 'DJI',
    price: 52000, category: 'Audio & Visual', sku: 'DJI-MINI4PRO',
    stock: 12, rating: 4.9, reviews: 26,
    image: 'https://www-cdn.djiits.com/cms/uploads/892e39b4b76dc5a83b267ed12ce69b97@374*374.png',
    description: 'Sub-250 g camera drone with 4K/60 HDR video, omnidirectional obstacle sensing, and long flight time for site surveys and aerial coverage.',
    tags: ['drone', '4K', 'survey'],
  },
  {
    id: 'p22', name: 'X4 360° Action Camera', brand: 'Insta360',
    price: 24500, category: 'Audio & Visual', sku: 'INS-X4',
    stock: 20, rating: 4.7, reviews: 18,
    image: 'https://res.insta360.com/static/090a8e529ad559cd3e6fccb0b83e52e3/X4.jpg',
    description: '8K 360° camera with 135-minute battery life and 10 m waterproofing. Great for virtual tours and event documentation.',
    tags: ['360', '8K', 'waterproof'],
  },
  {
    id: 'p23', name: 'HERO13 Black Action Camera', brand: 'GoPro',
    price: 23500, category: 'Audio & Visual', sku: 'GPR-HERO13',
    stock: 25, rating: 4.7, reviews: 22,
    image: PLACEHOLDER_IMG,
    description: 'Rugged waterproof action camera with 5.3K video and swappable lens mounts for field documentation and training footage.',
    tags: ['action camera', '5.3K', 'waterproof'],
  },
  {
    id: 'p24', name: 'PartyBox Portable Party Speaker', brand: 'JBL',
    price: 19500, category: 'Audio & Visual', sku: 'JBL-PARTYBOX',
    stock: 18, rating: 4.6, reviews: 29,
    image: PLACEHOLDER_IMG,
    description: 'High-output portable Bluetooth party speaker with light show, for events, programs, and small venues.',
    tags: ['speaker', 'Bluetooth', 'portable'],
  },
  {
    id: 'p25', name: 'Veriton Business Desktop', brand: 'Acer',
    price: 32000, category: 'IT Equipment', sku: 'ACR-VERITON',
    stock: 30, rating: 4.5, reviews: 11,
    image: PLACEHOLDER_IMG,
    description: 'Compact business desktop for government and office workstations, configurable to your processor and memory requirements.',
    tags: ['desktop', 'business', 'office'],
  },
  {
    id: 'p26', name: 'Modern 15 Business Laptop', brand: 'MSI',
    price: 42000, category: 'IT Equipment', sku: 'MSI-MODERN15',
    stock: 16, rating: 4.6, reviews: 13,
    image: 'https://media.ldlc.com/r705/ld/products/00/05/55/03/LD0005550379_2_0005550937_0005654796.jpg',
    description: 'Slim 15.6 in Full HD IPS laptop with NVMe SSD, backlit keyboard, and USB-C, built for office and fieldwork.',
    tags: ['laptop', '15.6 inch', 'SSD'],
  },
  {
    id: 'p27', name: 'ExpertBook B1 Business Laptop', brand: 'Asus',
    price: 54000, category: 'IT Equipment', sku: 'ASU-EXPERTB1',
    stock: 14, rating: 4.6, reviews: 10,
    image: 'https://media.ldlc.com/r705/ld/products/00/06/08/32/LD0006083258_0006083919.jpg',
    description: '15.6 in Full HD business laptop with Intel Core i7, 16 GB RAM, 512 GB SSD, fingerprint reader, and TPM 2.0.',
    tags: ['laptop', 'Core i7', 'TPM 2.0'],
  },
  {
    id: 'p28', name: 'HL-L2350DW Monochrome Laser Printer', brand: 'Brother',
    price: 8900, category: 'IT Equipment', sku: 'BRO-HLL2350DW',
    stock: 40, rating: 4.6, reviews: 34,
    image: PLACEHOLDER_IMG,
    description: 'Compact wireless monochrome laser printer with automatic duplex printing, suited to office document volumes.',
    tags: ['laser printer', 'duplex', 'Wi-Fi'],
  },
  {
    id: 'p29', name: 'PIXMA G3430 Ink Tank Printer', brand: 'Canon',
    price: 9800, category: 'IT Equipment', sku: 'CAN-G3430',
    stock: 33, rating: 4.5, reviews: 19,
    image: PLACEHOLDER_IMG,
    description: 'Refillable ink tank all-in-one (print, scan, copy) with Wi-Fi and very low cost per page.',
    tags: ['ink tank', 'all-in-one', 'Wi-Fi'],
  },
  {
    id: 'p30', name: 'EcoTank ET-2860 All-in-One Printer', brand: 'Epson',
    price: 11500, category: 'IT Equipment', sku: 'EPS-ET2860',
    stock: 38, rating: 4.7, reviews: 24,
    image: 'https://media.ldlc.com/r705/ld/products/00/06/09/93/LD0006099328.jpg',
    description: '3-in-1 Wi-Fi ink tank printer, 33 ppm black / 15 ppm color, with up to 4,500 black pages per refill set.',
    tags: ['ink tank', '3-in-1', 'Wi-Fi'],
  },
  {
    id: 'p31', name: 'MacBook Air 13 in (M3)', brand: 'Apple',
    price: 72000, category: 'IT Equipment', sku: 'APL-MBA13M3',
    stock: 9, rating: 4.9, reviews: 15,
    image: 'https://media.ldlc.com/r705/ld/products/00/06/11/44/LD0006114472.jpg',
    description: 'Apple M3 chip, 8 GB memory, 256 GB SSD, 13 in Liquid Retina display, and up to 18 hours of battery life.',
    tags: ['laptop', 'M3', 'macOS'],
  },
  {
    id: 'p32', name: 'Intelligent LCD 1500VA UPS', brand: 'CyberPower',
    price: 8200, category: 'IT Equipment', sku: 'CPW-1500LCD',
    stock: 44, rating: 4.6, reviews: 20,
    image: PLACEHOLDER_IMG,
    description: 'Line-interactive 1500VA UPS with LCD status panel and AVR, protecting workstations, NVRs, and network gear.',
    tags: ['UPS', '1500VA', 'AVR'],
  },
]

export const categoryData = [
  { name: 'Land Mobile Communication', value: 28 },
  { name: 'CCTV Surveillance', value: 26 },
  { name: 'Access Control', value: 14 },
  { name: 'Audio & Visual', value: 17 },
  { name: 'IT Equipment', value: 15 },
]

export const orders: Order[] = [
  { id: 'ORD-20094', date: '2026-08-06', customer: 'Lungsod ng Bacoor — General Services Office', email: 'procurement@bacoorcity.gov.ph', status: 'shipped', items: 6, total: 58400, tracking: 'LBC1Z9999W01234567' },
  { id: 'ORD-20093', date: '2026-08-06', customer: 'Lungsod ng Imus — IT Department', email: 'itdept@imuscity.gov.ph', status: 'processing', items: 2, total: 24800 },
  { id: 'ORD-20092', date: '2026-08-05', customer: 'Bayan ng Carmona', email: 'admin@carmona.gov.ph', status: 'delivered', items: 3, total: 33900, tracking: 'LBC1Z9999W09876543' },
  { id: 'ORD-20091', date: '2026-08-05', customer: 'La Trinidad Academy', email: 'facilities@ltacademy.edu.ph', status: 'pending', items: 1, total: 7200 },
  { id: 'ORD-20090', date: '2026-08-04', customer: 'Lungsod ng Trece Martires', email: 'procurement@trecemartires.gov.ph', status: 'delivered', items: 8, total: 94500, tracking: 'LBC1Z9999W05554443' },
  { id: 'ORD-20089', date: '2026-08-04', customer: 'Bayan ng Indang', email: 'admin@indang.gov.ph', status: 'cancelled', items: 1, total: 11300 },
  { id: 'ORD-20088', date: '2026-08-03', customer: 'Bayan ng Amadeo', email: 'procurement@amadeo.gov.ph', status: 'delivered', items: 2, total: 16900, tracking: 'LBC1Z9999W01111222' },
  { id: 'ORD-20087', date: '2026-08-03', customer: 'Bayan ng Magallanes', email: 'admin@magallanes.gov.ph', status: 'shipped', items: 1, total: 9800, tracking: 'LBC1Z9999W03334455' },
]

export const reviews: Review[] = [
  { id: 'r1', author: 'Engr. R. Santos', avatar: 'RS', rating: 5, date: '2026-08-05', title: 'Reliable radios for our dispatch team', body: 'FGT supplied and configured our NX-5700 units for the municipal dispatch center. Coverage has been solid even in low-signal barangays, and the IP67 rating has held up through the rainy season.', verified: true, productId: 'p1', productName: 'NX-5700 VHF/UHF Portable Radio', helpful: 18 },
  { id: 'r2', author: 'Maricel Dizon', avatar: 'MD', rating: 5, date: '2026-08-04', title: 'Clean installation, responsive support', body: 'The CCTV turret cameras were installed across our road monitoring points with minimal downtime. Night footage is noticeably sharper than our previous system.', verified: true, productId: 'p3', productName: 'DS-2CD2387 4K Turret Network Camera', helpful: 14 },
  { id: 'r3', author: 'Engr. J. Villanueva', avatar: 'JV', rating: 4, date: '2026-08-03', title: 'Good access control for our facility', body: 'Biometric + card access controllers work well for our factory entry points. Setup took a bit longer than expected but FGT\'s technicians saw it through.', verified: true, productId: 'p5', productName: 'AC-200 Biometric Access Controller', helpful: 9 },
  { id: 'r4', author: 'Clark Freeport Facilities', avatar: 'CF', rating: 5, date: '2026-08-01', title: 'Solid PA system for our events', body: 'The QSC speakers handled our outdoor event without a hitch — clear coverage across the grounds. FGT recommended the right pairing for our venue size.', verified: true, productId: 'p7', productName: 'QSC K10.2 Powered PA Speaker', helpful: 11 },
]

export const blogPosts: BlogPost[] = [
  { id: 'b1', author: 'FGT Trading OPC', avatar: 'FG', date: '2026-08-07', title: 'New stock: 4K turret cameras now available', body: 'We\'ve expanded our CCTV lineup with Hikvision\'s latest 4K turret cameras, now in stock for LGU and commercial deployments. WDR and smart motion detection come standard.', category: 'New Arrivals', likes: 24, comments: 3, image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&h=400&fit=crop&auto=format' },
  { id: 'b2', author: 'FGT Trading OPC', avatar: 'FG', date: '2026-08-05', title: 'Choosing the right two-way radio for field teams', body: 'VHF or UHF? Analog or digital? Here\'s how we help LGUs and facility managers choose the right radio system for their coverage area and team size.', category: 'Guide', likes: 31, comments: 6 },
  { id: 'b3', author: 'FGT Trading OPC', avatar: 'FG', date: '2026-08-02', title: 'Behind our road monitoring installation in Trece Martires', body: 'A look at our recent citywide road monitoring rollout — from site survey to NVR configuration and commissioning.', category: 'Case Study', likes: 19, comments: 2, image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=400&fit=crop&auto=format' },
]

export const chatMessages: ChatMessage[] = [
  { id: 'cm1', sender: 'customer', name: 'Engr. R. Santos', message: 'Hi, can you confirm the lead time on the NX-5700 units for our dispatch center?', time: '10:02 AM', read: true },
  { id: 'cm2', sender: 'support', name: 'FGT Support', message: 'Hi Engineer! Let me check our current stock for you.', time: '10:04 AM', read: true },
  { id: 'cm3', sender: 'support', name: 'FGT Support', message: 'We have 42 units in stock, so we can ship within 2–3 business days. Would you like a formal quotation as well?', time: '10:05 AM', read: true },
  { id: 'cm4', sender: 'customer', name: 'Engr. R. Santos', message: 'Yes please, for 12 units plus installation support.', time: '10:06 AM', read: true },
  { id: 'cm5', sender: 'support', name: 'FGT Support', message: 'Noted — I\'ll have our team prepare a quotation covering supply and installation and send it over today.', time: '10:07 AM', read: false },
]

export const revenueData = [
  { month: 'Mar', revenue: 412800, orders: 38 },
  { month: 'Apr', revenue: 521200, orders: 44 },
  { month: 'May', revenue: 486600, orders: 41 },
  { month: 'Jun', revenue: 634400, orders: 53 },
  { month: 'Jul', revenue: 712200, orders: 60 },
  { month: 'Aug', revenue: 389900, orders: 32 },
]
