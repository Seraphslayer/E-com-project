import { useState } from 'react'
import { QrCode, Barcode, Download, Printer, Search, Package } from 'lucide-react'
import { useProducts } from '../../store/productStore'

function QRCodeDisplay({ value, size = 100 }: { value: string; size?: number }) {
  // SVG-based QR mock (3x3 finder pattern + data modules)
  const modules = []
  const hash = value.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const gridSize = 11
  const cellSize = size / gridSize

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const isFinderTL = (r < 3 && c < 3)
      const isFinderTR = (r < 3 && c >= gridSize - 3)
      const isFinderBL = (r >= gridSize - 3 && c < 3)
      const isFinder = isFinderTL || isFinderTR || isFinderBL
      const isFinderBorder = (r === 0 || r === 2 || c === 0 || c === 2) && isFinder
      const isFinderCenter = (r === 1 && c === 1) || (r === 1 && c === gridSize - 2) || (r === gridSize - 2 && c === 1)
      let filled = false
      if (isFinderBorder) filled = true
      else if (isFinderCenter) filled = true
      else if (!isFinder) {
        const bit = (hash * (r * gridSize + c + 7)) % 17
        filled = bit < 8
      }
      if (filled) {
        modules.push(<rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize} height={cellSize} fill="#0D0D0D" />)
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="bg-white">
      <rect width={size} height={size} fill="white" />
      {modules}
    </svg>
  )
}

function BarcodeDisplay({ value, width = 160, height = 50 }: { value: string; width?: number; height?: number }) {
  const bars = []
  const totalBars = 60
  const barWidth = width / totalBars
  const hash = value.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  for (let i = 0; i < totalBars; i++) {
    const filled = ((hash * (i + 3)) % 5) < 2
    if (filled) {
      bars.push(<rect key={i} x={i * barWidth} y={0} width={barWidth * 0.75} height={height} fill="#0D0D0D" />)
    }
  }
  return (
    <svg width={width} height={height + 16} viewBox={`0 0 ${width} ${height + 16}`}>
      {bars}
      <text x={width / 2} y={height + 12} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#0D0D0D">
        {value}
      </text>
    </svg>
  )
}

export default function QRPage() {
  const { products } = useProducts()
  const [tab, setTab] = useState<'generate' | 'scan'>('generate')
  const [selectedId, setSelectedId] = useState(products[0]?.id)
  const selected = products.find(p => p.id === selectedId) ?? products[0]
  const setSelected = (p: typeof products[number]) => setSelectedId(p.id)
  const [search, setSearch] = useState('')
  const [labelType, setLabelType] = useState<'qr' | 'barcode'>('qr')

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="mb-6">
        <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-1">Service 06</p>
        <h1 className="font-display font-bold text-3xl text-[#0D0D0D] tracking-tight">QR & Barcode Labels</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-6 border-b border-[#E2E2E2]">
        {(['generate', 'scan'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 font-mono text-xs tracking-widest uppercase transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-[#D4B63A] text-[#856A00]' : 'border-transparent text-[#6B6B6B] hover:text-[#0D0D0D]'
            }`}
          >
            {t === 'generate' ? (
              <span className="flex items-center gap-2"><QrCode size={12} /> Generate Labels</span>
            ) : (
              <span className="flex items-center gap-2"><Barcode size={12} /> Scan & Lookup</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'generate' && (
        <div className="grid grid-cols-3 gap-6">
          {/* Product picker */}
          <div className="bg-white border border-[#E2E2E2]">
            <div className="p-4 border-b border-[#E2E2E2]">
              <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-3">Select Product</p>
              <div className="flex items-center gap-2 border border-[#E2E2E2] px-2 py-1.5">
                <Search size={12} className="text-[#6B6B6B]" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search SKU or name..."
                  className="flex-1 font-sans text-xs outline-none placeholder:text-[#D0D0D0]"
                />
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto divide-y divide-[#E2E2E2]">
              {filtered.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    selected.id === p.id ? 'bg-[#FBF5D6]' : 'hover:bg-[#F8F8F8]'
                  }`}
                >
                  <div className="w-8 h-8 bg-[#EBF0F0] overflow-hidden flex-shrink-0">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-xs font-medium text-[#0D0D0D] truncate">{p.name}</p>
                    <p className="font-mono text-[10px] text-[#6B6B6B]">{p.sku}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Label preview */}
          <div className="col-span-2 bg-white border border-[#E2E2E2] p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase">Label Preview</p>
              <div className="flex gap-2">
                {(['qr', 'barcode'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setLabelType(t)}
                    className={`px-3 py-1.5 font-mono text-xs tracking-widest uppercase transition-colors ${
                      labelType === t ? 'bg-[#EACD51] text-[#0D0D0D]' : 'border border-[#E2E2E2] text-[#6B6B6B] hover:border-[#D4B63A]'
                    }`}
                  >
                    {t === 'qr' ? <QrCode size={10} className="inline mr-1" /> : <Barcode size={10} className="inline mr-1" />}
                    {t === 'qr' ? 'QR Code' : 'Barcode'}
                  </button>
                ))}
              </div>
            </div>

            {/* Label card */}
            <div className="border-2 border-dashed border-[#E2E2E2] p-6 flex items-center gap-6 max-w-md">
              {labelType === 'qr' ? (
                <QRCodeDisplay value={selected.sku} size={100} />
              ) : (
                <BarcodeDisplay value={selected.sku} />
              )}
              <div>
                <p className="font-display font-bold text-[#0D0D0D] text-sm leading-snug mb-1">{selected.name}</p>
                <p className="font-mono text-[10px] text-[#6B6B6B] mb-1">SKU: {selected.sku}</p>
                <p className="font-mono text-[10px] text-[#6B6B6B] mb-1">Brand: {selected.brand}</p>
                <p className="font-display font-bold text-[#856A00]">${selected.price}</p>
              </div>
            </div>

            {/* Print options */}
            <div className="mt-6">
              <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-3">Print Options</p>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 font-sans text-sm text-[#0D0D0D]">
                  <input type="number" defaultValue={1} min={1} max={999} className="w-16 border border-[#E2E2E2] px-2 py-1.5 font-mono text-sm text-center outline-none focus:border-[#D4B63A]" />
                  copies
                </label>
                <select className="border border-[#E2E2E2] px-3 py-1.5 font-mono text-xs text-[#0D0D0D] outline-none focus:border-[#D4B63A]">
                  <option>Label 4×2 in</option>
                  <option>Label 3×1 in</option>
                  <option>A4 Sheet (30 per page)</option>
                </select>
                <button className="flex items-center gap-2 bg-[#EACD51] text-[#0D0D0D] px-5 py-2 font-mono text-xs tracking-widest uppercase hover:bg-[#D4B63A] transition-colors">
                  <Printer size={13} /> Print
                </button>
                <button className="flex items-center gap-2 border border-[#E2E2E2] px-4 py-2 font-mono text-xs tracking-widest uppercase hover:border-[#0D0D0D] transition-colors">
                  <Download size={13} /> PDF
                </button>
              </div>
            </div>

            {/* Batch generate */}
            <div className="mt-5 bg-[#EBF0F0] p-4">
              <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-2">Batch Generate</p>
              <p className="font-sans text-sm text-[#6B6B6B] mb-3">Generate labels for all {products.length} products at once.</p>
              <button className="flex items-center gap-2 bg-[#0D0D0D] text-white px-5 py-2 font-mono text-xs tracking-widest uppercase hover:bg-[#333] transition-colors">
                <Package size={13} /> Generate All Labels
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'scan' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-[#E2E2E2] p-6">
            <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-4">Scan or Enter Code</p>
            <div className="border-2 border-dashed border-[#E2E2E2] h-48 flex flex-col items-center justify-center gap-3 mb-4">
              <QrCode size={32} className="text-[#D0D0D0]" />
              <p className="font-mono text-xs text-[#6B6B6B]">Camera scanner inactive in demo</p>
            </div>
            <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-2">Manual Entry</p>
            <div className="flex gap-2">
              <input
                type="text"
                defaultValue="MRX-HP-001"
                className="flex-1 border border-[#E2E2E2] px-3 py-2.5 font-mono text-sm outline-none focus:border-[#D4B63A] transition-colors"
                placeholder="Enter SKU or barcode..."
              />
              <button className="bg-[#EACD51] text-[#0D0D0D] px-5 py-2 font-mono text-xs tracking-widest uppercase hover:bg-[#D4B63A] transition-colors">
                Lookup
              </button>
            </div>
          </div>

          {/* Lookup result */}
          <div className="bg-white border border-[#E2E2E2] p-6">
            <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-4">Lookup Result</p>
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-[#EBF0F0] overflow-hidden flex-shrink-0">
                <img src={products[0].image} alt={products[0].name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-display font-bold text-[#0D0D0D] mb-1">{products[0].name}</p>
                <div className="space-y-1">
                  {[
                    ['SKU', products[0].sku],
                    ['Brand', products[0].brand],
                    ['Category', products[0].category],
                    ['Price', `$${products[0].price}`],
                    ['Stock', `${products[0].stock} units`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-4">
                      <span className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase w-20">{k}</span>
                      <span className="font-mono text-xs text-[#0D0D0D]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
