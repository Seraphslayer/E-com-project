import { useState, useCallback } from 'react'
import { Product } from '../data/mockData'

export interface CartItem {
  product: Product
  quantity: number
}

let globalCart: CartItem[] = []
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach(fn => fn())
}

export function useCart() {
  const [, setTick] = useState(0)

  const rerender = useCallback(() => setTick(t => t + 1), [])

  useState(() => {
    listeners.add(rerender)
    return () => { listeners.delete(rerender) }
  })

  const addToCart = (product: Product) => {
    const existing = globalCart.find(i => i.product.id === product.id)
    if (existing) {
      globalCart = globalCart.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
    } else {
      globalCart = [...globalCart, { product, quantity: 1 }]
    }
    notify()
  }

  const removeFromCart = (productId: string) => {
    globalCart = globalCart.filter(i => i.product.id !== productId)
    notify()
  }

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) { removeFromCart(productId); return }
    globalCart = globalCart.map(i => i.product.id === productId ? { ...i, quantity: qty } : i)
    notify()
  }

  const clearCart = () => {
    globalCart = []
    notify()
  }

  const total = globalCart.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const count = globalCart.reduce((sum, i) => sum + i.quantity, 0)

  return { cart: globalCart, addToCart, removeFromCart, updateQuantity, clearCart, total, count }
}
