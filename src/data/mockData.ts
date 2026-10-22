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
