import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, CreditCard, Lock, Truck, ChevronRight } from 'lucide-react'
import { useCart } from '../../store/cartStore'
import { formatPHP } from '../../data/companyInfo'

type Step = 'shipping' | 'payment' | 'confirm'

const steps: { key: Step; label: string }[] = [
  { key: 'shipping', label: 'Shipping' },
  { key: 'payment', label: 'Payment' },
  { key: 'confirm', label: 'Confirm' },
]

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>('shipping')
  const [placed, setPlaced] = useState(false)
  const { cart, total, clearCart } = useCart()
  const navigate = useNavigate()

  const shipping = total > 20000 ? 0 : 850
  const tax = total * 0.12
  const orderTotal = total + shipping + tax

  const stepIndex = steps.findIndex(s => s.key === step)

  const placeOrder = () => {
    clearCart()
    setPlaced(true)
  }

  if (placed) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 bg-[#00875A]/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-[#00875A]" />
        </div>
        <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-2">Order Confirmed</p>
        <h1 className="font-display font-bold text-3xl text-[#0D0D0D] mb-3">Thank you!</h1>
        <p className="text-[#6B6B6B] font-sans text-sm mb-2">
          Your order <span className="font-mono text-[#0D0D0D]">ORD-20095</span> has been placed.
        </p>
        <p className="text-[#6B6B6B] font-sans text-sm mb-8">
          A confirmation has been sent to <span className="font-mono text-[#0D0D0D]">your email</span>.
          Our team will follow up to confirm delivery or installation schedule.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/store/orders')}
            className="bg-[#EACD51] text-[#0D0D0D] px-6 py-3 font-mono text-sm tracking-widest uppercase hover:bg-[#D4B63A] transition-colors"
          >
            Track Order
          </button>
          <button
            onClick={() => navigate('/store')}
            className="border border-[#E2E2E2] px-6 py-3 font-mono text-sm tracking-widest uppercase hover:border-[#0D0D0D] transition-colors"
          >
            Keep Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-1">Checkout — Service 02</p>
        <h1 className="font-display font-bold text-3xl text-[#0D0D0D] tracking-tight">Checkout</h1>
      </div>

      {/* Step progress */}
      <div className="flex items-center gap-0 mb-10">
        {steps.map(({ key, label }, i) => (
          <div key={key} className="flex items-center">
            <div className={`flex items-center gap-2 px-4 py-2 font-mono text-xs tracking-widest uppercase transition-colors ${
              i === stepIndex
                ? 'bg-[#EACD51] text-[#0D0D0D]'
                : i < stepIndex
                ? 'bg-[#0D0D0D] text-white'
                : 'bg-[#E4EBEB] text-[#6B6B6B]'
            }`}>
              <span className="w-4 h-4 flex items-center justify-center text-[10px]">{i + 1}</span>
              {label}
            </div>
            {i < steps.length - 1 && (
              <ChevronRight size={14} className="text-[#D0D0D0]" />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form area */}
        <div className="lg:col-span-2">
          {step === 'shipping' && (
            <div className="bg-white border border-[#E2E2E2] p-6">
              <div className="flex items-center gap-2 mb-5">
                <Truck size={16} className="text-[#856A00]" />
                <h2 className="font-display font-semibold text-[#0D0D0D]">Shipping Address</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Contact Person', placeholder: 'Juan Dela Cruz', span: 1 },
                  { label: 'Office / Department', placeholder: 'General Services Office', span: 1 },
                  { label: 'Email', placeholder: 'procurement@lgu.gov.ph', span: 2 },
                  { label: 'Delivery Address', placeholder: 'City Hall Compound, Brgy. Poblacion', span: 2 },
                  { label: 'City / Municipality', placeholder: 'Dasmariñas City', span: 1 },
                  { label: 'Province', placeholder: 'Cavite', span: 1 },
                  { label: 'Country', placeholder: 'Philippines', span: 2 },
                ].map(({ label, placeholder, span }) => (
                  <div key={label} className={span === 2 ? 'col-span-2' : ''}>
                    <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">{label}</label>
                    <input
                      type="text"
                      defaultValue={placeholder}
                      className="w-full border border-[#E2E2E2] px-3 py-2.5 font-sans text-sm text-[#0D0D0D] outline-none focus:border-[#D4B63A] transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <label className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-2 block">Shipping Method</label>
                <div className="space-y-2">
                  {[
                    { id: 'std', label: 'Standard Delivery — 5–7 business days', price: 'Free', selected: true },
                    { id: 'exp', label: 'Priority Delivery — 2–3 business days', price: formatPHP(650), selected: false },
                    { id: 'ins', label: 'Delivery + On-site Installation', price: formatPHP(1500), selected: false },
                  ].map(opt => (
                    <label key={opt.id} className="flex items-center gap-3 border border-[#E2E2E2] px-4 py-3 cursor-pointer hover:border-[#D4B63A] transition-colors">
                      <input type="radio" name="shipping" defaultChecked={opt.selected} className="accent-[#D4B63A]" />
                      <span className="flex-1 font-sans text-sm text-[#0D0D0D]">{opt.label}</span>
                      <span className={`font-display font-semibold text-sm ${opt.price === 'Free' ? 'text-[#00875A]' : 'text-[#0D0D0D]'}`}>{opt.price}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep('payment')} className="mt-6 bg-[#EACD51] text-[#0D0D0D] px-8 py-3 font-mono text-sm tracking-widest uppercase hover:bg-[#D4B63A] transition-colors flex items-center gap-2">
                Continue to Payment <ChevronRight size={14} />
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white border border-[#E2E2E2] p-6">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard size={16} className="text-[#856A00]" />
                <h2 className="font-display font-semibold text-[#0D0D0D]">Payment — Service 03</h2>
                <div className="ml-auto flex items-center gap-1 text-[#6B6B6B]">
                  <Lock size={12} />
                  <span className="font-mono text-[10px] tracking-wide">SSL Secured</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">Card Number</label>
                  <input
                    type="text"
                    defaultValue="4242 4242 4242 4242"
                    className="w-full border border-[#E2E2E2] px-3 py-2.5 font-mono text-sm text-[#0D0D0D] outline-none focus:border-[#D4B63A] transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">Expiry</label>
                  <input defaultValue="09/28" className="w-full border border-[#E2E2E2] px-3 py-2.5 font-mono text-sm text-[#0D0D0D] outline-none focus:border-[#D4B63A] transition-colors" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">CVV</label>
                  <input defaultValue="•••" className="w-full border border-[#E2E2E2] px-3 py-2.5 font-mono text-sm text-[#0D0D0D] outline-none focus:border-[#D4B63A] transition-colors" />
                </div>
                <div className="col-span-2">
                  <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">Name on Card</label>
                  <input defaultValue="Juan Dela Cruz" className="w-full border border-[#E2E2E2] px-3 py-2.5 font-sans text-sm text-[#0D0D0D] outline-none focus:border-[#D4B63A] transition-colors" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {["Card", "GCash", "Maya", "GrabPay"].map((method) => (
                  <div key={method} className="border border-[#E2E2E2] px-2 py-1.5 text-center">
                    <p className="font-mono text-[9px] text-[#6B6B6B] tracking-wide">{method}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-[#EBF0F0] px-4 py-3">
                <p className="font-mono text-[11px] text-[#6B6B6B]">Demo mode: no real payment is processed. Secured by PayMongo.</p>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep('shipping')} className="border border-[#E2E2E2] px-6 py-3 font-mono text-sm tracking-widest uppercase hover:border-[#0D0D0D] transition-colors">Back</button>
                <button onClick={() => setStep('confirm')} className="bg-[#EACD51] text-[#0D0D0D] px-8 py-3 font-mono text-sm tracking-widest uppercase hover:bg-[#D4B63A] transition-colors flex items-center gap-2">
                  Review Order <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="bg-white border border-[#E2E2E2] p-6">
              <h2 className="font-display font-semibold text-[#0D0D0D] mb-5">Order Review</h2>
              <div className="space-y-3 mb-6">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#EBF0F0] overflow-hidden flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-sans text-sm text-[#0D0D0D] font-medium">{product.name}</p>
                      <p className="font-mono text-[11px] text-[#6B6B6B]">Qty: {quantity}</p>
                    </div>
                    <span className="font-display font-semibold text-sm">{formatPHP(product.price * quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#E2E2E2] pt-4 space-y-2 mb-6 text-sm">
                <div className="flex justify-between"><span className="text-[#6B6B6B]">Subtotal</span><span className="font-display font-semibold">{formatPHP(total)}</span></div>
                <div className="flex justify-between"><span className="text-[#6B6B6B]">Shipping</span><span className="font-display font-semibold text-[#00875A]">{shipping === 0 ? 'Free' : formatPHP(shipping)}</span></div>
                <div className="flex justify-between"><span className="text-[#6B6B6B]">VAT (12%)</span><span className="font-display font-semibold">{formatPHP(Math.round(tax))}</span></div>
                <div className="flex justify-between pt-2 border-t border-[#E2E2E2]">
                  <span className="font-display font-bold">Total</span>
                  <span className="font-display font-bold text-lg text-[#856A00]">{formatPHP(Math.round(orderTotal))}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep('payment')} className="border border-[#E2E2E2] px-6 py-3 font-mono text-sm tracking-widest uppercase hover:border-[#0D0D0D] transition-colors">Back</button>
                <button onClick={placeOrder} className="flex-1 bg-[#EACD51] text-[#0D0D0D] py-3 font-mono text-sm tracking-widest uppercase hover:bg-[#D4B63A] transition-colors flex items-center justify-center gap-2">
                  <Lock size={14} /> Place Order — {formatPHP(Math.round(orderTotal))}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mini cart summary */}
        <div>
          <div className="bg-white border border-[#E2E2E2] p-5">
            <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-4">Order Summary</p>
            <div className="space-y-2 mb-4">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between items-center">
                  <span className="font-sans text-sm text-[#0D0D0D] truncate flex-1 mr-2">{product.name} ×{quantity}</span>
                  <span className="font-mono text-sm text-[#0D0D0D]">{formatPHP(product.price * quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E2E2E2] pt-3">
              <div className="flex justify-between">
                <span className="font-display font-bold text-sm">Total</span>
                <span className="font-display font-bold text-[#856A00]">{formatPHP(Math.round(orderTotal))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
