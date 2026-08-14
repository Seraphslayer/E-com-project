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
  description: string
  tags: string[]
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

export const products: Product[] = [
  {
    id: 'p1', name: 'Merx Pro Wireless Headphones', brand: 'Merx Audio',
    price: 249, originalPrice: 329, category: 'Electronics', sku: 'MRX-HP-001',
    stock: 48, rating: 4.8, reviews: 312,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&auto=format',
    description: 'Studio-grade wireless headphones with 40hr battery life and active noise cancellation.',
    tags: ['wireless', 'noise-cancelling', 'premium']
  },
  {
    id: 'p2', name: 'Slim Leather Wallet', brand: 'Cardhaven',
    price: 89, category: 'Accessories', sku: 'CHV-WL-002',
    stock: 120, rating: 4.6, reviews: 88,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop&auto=format',
    description: 'Full-grain Italian leather, holds 8 cards and cash. Available in 4 colors.',
    tags: ['leather', 'minimalist', 'RFID']
  },
  {
    id: 'p3', name: 'Ceramic Pour-Over Set', brand: 'Brewcraft',
    price: 64, category: 'Kitchen', sku: 'BRW-PO-003',
    stock: 35, rating: 4.9, reviews: 204,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop&auto=format',
    description: 'Hand-thrown ceramic dripper and carafe with stainless filters. For the serious home barista.',
    tags: ['coffee', 'ceramic', 'handmade']
  },
  {
    id: 'p4', name: 'Mechanical Keyboard TKL', brand: 'KeyForge',
    price: 189, originalPrice: 219, category: 'Electronics', sku: 'KFG-KB-004',
    stock: 22, rating: 4.7, reviews: 156,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop&auto=format',
    description: 'Tenkeyless form factor, Cherry MX Brown switches, PBT keycaps, USB-C detachable cable.',
    tags: ['mechanical', 'tenkeyless', 'RGB']
  },
  {
    id: 'p5', name: 'Merino Wool Crew Sweater', brand: 'Arcfield',
    price: 145, category: 'Apparel', sku: 'ARC-SW-005',
    stock: 67, rating: 4.5, reviews: 73,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop&auto=format',
    description: '100% New Zealand merino wool. Naturally temperature-regulating, machine washable.',
    tags: ['merino', 'sustainable', 'unisex']
  },
  {
    id: 'p6', name: 'Portable Bluetooth Speaker', brand: 'Merx Audio',
    price: 119, category: 'Electronics', sku: 'MRX-SP-006',
    stock: 83, rating: 4.4, reviews: 97,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop&auto=format',
    description: 'IP67 waterproof, 24hr battery, 360° sound. Built for the outdoors.',
    tags: ['waterproof', 'outdoor', 'bluetooth']
  },
  {
    id: 'p7', name: 'Stainless Water Bottle 32oz', brand: 'HydroMerx',
    price: 42, category: 'Sports', sku: 'HYD-BT-007',
    stock: 200, rating: 4.8, reviews: 541,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop&auto=format',
    description: 'Double-wall vacuum insulation. Keeps drinks cold 24hr, hot 12hr. BPA-free lid.',
    tags: ['hydration', 'insulated', 'BPA-free']
  },
  {
    id: 'p8', name: 'Canvas Tote Bag', brand: 'Arcfield',
    price: 38, category: 'Accessories', sku: 'ARC-TT-008',
    stock: 300, rating: 4.3, reviews: 62,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&auto=format',
    description: 'Heavy-duty 12oz natural canvas with leather handles and brass hardware.',
    tags: ['canvas', 'eco', 'everyday']
  },
]

export const orders: Order[] = [
  { id: 'ORD-20094', date: '2026-08-06', customer: 'Elena Vasquez', email: 'elena.v@email.com', status: 'shipped', items: 2, total: 338, tracking: 'UPS1Z9999W01234567' },
  { id: 'ORD-20093', date: '2026-08-06', customer: 'James Thornton', email: 'j.thornton@email.com', status: 'processing', items: 1, total: 189 },
  { id: 'ORD-20092', date: '2026-08-05', customer: 'Aiko Nakamura', email: 'aiko.n@email.com', status: 'delivered', items: 3, total: 227, tracking: 'UPS1Z9999W09876543' },
  { id: 'ORD-20091', date: '2026-08-05', customer: 'Marcus Webb', email: 'm.webb@email.com', status: 'pending', items: 1, total: 64 },
  { id: 'ORD-20090', date: '2026-08-04', customer: 'Sofia Reyes', email: 's.reyes@email.com', status: 'delivered', items: 4, total: 495, tracking: 'UPS1Z9999W05554443' },
  { id: 'ORD-20089', date: '2026-08-04', customer: 'Omar Khalid', email: 'o.khalid@email.com', status: 'cancelled', items: 1, total: 249 },
  { id: 'ORD-20088', date: '2026-08-03', customer: 'Priya Sharma', email: 'p.sharma@email.com', status: 'delivered', items: 2, total: 164, tracking: 'UPS1Z9999W01111222' },
  { id: 'ORD-20087', date: '2026-08-03', customer: 'Tom Eriksen', email: 't.eriksen@email.com', status: 'shipped', items: 1, total: 89, tracking: 'UPS1Z9999W03334455' },
]

export const reviews: Review[] = [
  { id: 'r1', author: 'Elena Vasquez', avatar: 'EV', rating: 5, date: '2026-08-05', title: 'Best headphones I have owned', body: 'The noise cancellation is genuinely impressive. I use these daily on the subway and in open-plan offices. Battery life is exactly as advertised — I charged mine once last week.', verified: true, productId: 'p1', productName: 'Merx Pro Wireless Headphones', helpful: 42 },
  { id: 'r2', author: 'James Thornton', avatar: 'JT', rating: 4, date: '2026-08-04', title: 'Great keyboard, minor quibbles', body: 'Typing feel is excellent, keycaps are well-made. My only gripe is the RGB software is Windows-only. Otherwise this is a fantastic TKL for the price.', verified: true, productId: 'p4', productName: 'Mechanical Keyboard TKL', helpful: 28 },
  { id: 'r3', author: 'Aiko Nakamura', avatar: 'AN', rating: 5, date: '2026-08-03', title: 'Perfect pour-over set', body: 'I have had ceramic drippers crack on me before. This one is thick, well-glazed, and the carafe is beautifully designed. Coffee tastes cleaner than my old plastic dripper.', verified: true, productId: 'p3', productName: 'Ceramic Pour-Over Set', helpful: 19 },
  { id: 'r4', author: 'Marcus Webb', avatar: 'MW', rating: 4, date: '2026-08-02', title: 'Holds up well', body: 'Solid speaker for the price. Sound quality is above average for this size. Does get a little bassy in enclosed spaces but outdoors it sounds great.', verified: false, productId: 'p6', productName: 'Portable Bluetooth Speaker', helpful: 11 },
  { id: 'r5', author: 'Sofia Reyes', avatar: 'SR', rating: 5, date: '2026-08-01', title: 'Worth every penny', body: 'The merino is incredibly soft and the sizing is accurate. I bought the charcoal and the oatmeal. Already looking at the cardigan. Zero pilling after 3 washes.', verified: true, productId: 'p5', productName: 'Merino Wool Crew Sweater', helpful: 33 },
]

export const blogPosts: BlogPost[] = [
  { id: 'b1', author: 'Merx Team', avatar: 'MT', date: '2026-08-07', title: 'New SS26 Arrivals Are Here', body: 'Our summer–fall 2026 collection just landed. Featuring updated colorways in the Merino Wool line, a new collaboration with Brewcraft, and the most-requested restock: the Canvas Tote in Forest Green.', category: 'New Arrivals', likes: 87, comments: 12, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop&auto=format' },
  { id: 'b2', author: 'Elena Vasquez', avatar: 'EV', date: '2026-08-06', title: 'How I style the merino sweater for the office', body: 'The charcoal merino has been on heavy rotation since I got it. It pairs surprisingly well with tailored trousers but also works with raw denim. Here is my current favorite combination...', category: 'Style', likes: 54, comments: 8 },
  { id: 'b3', author: 'Brewcraft', avatar: 'BC', date: '2026-08-05', title: 'Dialing in your first pour-over — a beginner\'s guide', body: 'The ceramic dripper is designed to be forgiving, but a few variables matter a lot: grind size, water temperature, and pour rate. Let us walk through each one. Start with 25g of coffee to 400g of water...', category: 'Guide', likes: 121, comments: 24, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=400&fit=crop&auto=format' },
  { id: 'b4', author: 'Marcus Webb', avatar: 'MW', date: '2026-08-04', title: 'Comparing the Pro headphones to my old pair', body: 'I upgraded from a pair of over-ears I had used for 4 years. The difference in noise cancellation is significant — it is not even a contest. The Merx Pro handles airplane engine noise far better than anything in this price range.', category: 'Review', likes: 38, comments: 5 },
]

export const chatMessages: ChatMessage[] = [
  { id: 'cm1', sender: 'customer', name: 'Omar Khalid', message: 'Hi, I need to cancel my order ORD-20089. I ordered the wrong item.', time: '10:02 AM', read: true },
  { id: 'cm2', sender: 'support', name: 'Support Agent', message: 'Hi Omar! I can help with that. Let me pull up your order now.', time: '10:04 AM', read: true },
  { id: 'cm3', sender: 'support', name: 'Support Agent', message: 'I can see ORD-20089 for the Merx Pro Headphones. Since it has not shipped yet, I can cancel and issue a full refund. Shall I proceed?', time: '10:05 AM', read: true },
  { id: 'cm4', sender: 'customer', name: 'Omar Khalid', message: 'Yes please, and I actually wanted the Portable Speaker instead. Can I place a new order?', time: '10:06 AM', read: true },
  { id: 'cm5', sender: 'support', name: 'Support Agent', message: 'Absolutely. Your cancellation is confirmed and refund will appear in 3–5 business days. The Portable Bluetooth Speaker (MRX-SP-006) is in stock — you can order directly or I can create it for you here.', time: '10:07 AM', read: false },
]

export const revenueData = [
  { month: 'Mar', revenue: 42800, orders: 381 },
  { month: 'Apr', revenue: 51200, orders: 447 },
  { month: 'May', revenue: 48600, orders: 412 },
  { month: 'Jun', revenue: 63400, orders: 538 },
  { month: 'Jul', revenue: 71200, orders: 601 },
  { month: 'Aug', revenue: 38900, orders: 322 },
]

export const categoryData = [
  { name: 'Electronics', value: 41 },
  { name: 'Accessories', value: 22 },
  { name: 'Apparel', value: 19 },
  { name: 'Kitchen', value: 11 },
  { name: 'Sports', value: 7 },
]
