'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useMedusa } from './MedusaProvider'

interface CartContextValue {
  cart: any
  createCart: () => Promise<void>
  addToCart: (variantId: string, quantity: number) => Promise<void>
  updateCart: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const client = useMedusa()
  const [cart, setCart] = useState<any>(null)

  useEffect(() => {
    const initCart = async () => {
      const existingCartId = localStorage.getItem('cart_id')
      if (existingCartId) {
        try {
          const { cart } = await client.carts.retrieve(existingCartId)
          setCart(cart)
        } catch (e) {
          localStorage.removeItem('cart_id')
        }
      }
    }
    initCart()
  }, [client])

  const createCart = async () => {
    const { cart } = await client.carts.create()
    localStorage.setItem('cart_id', cart.id)
    setCart(cart)
  }

  const addToCart = async (variantId: string, quantity: number) => {
    if (!cart) {
      await createCart()
    }
    const { cart: updatedCart } = await client.carts.lineItems.create(cart?.id || localStorage.getItem('cart_id'), {
      variant_id: variantId,
      quantity,
    })
    setCart(updatedCart)
  }

  const updateCart = async (itemId: string, quantity: number) => {
    const { cart: updatedCart } = await client.carts.lineItems.update(cart?.id || localStorage.getItem('cart_id'), itemId, { quantity })
    setCart(updatedCart)
  }

  const removeItem = async (itemId: string) => {
    const { cart: updatedCart } = await client.carts.lineItems.delete(cart?.id || localStorage.getItem('cart_id'), itemId)
    setCart(updatedCart)
  }

  const clearCart = async () => {
    if (!cart) return
    const { cart: updatedCart } = await client.carts.update(cart.id, { items: [] })
    setCart(updatedCart)
  }

  return (
    <CartContext.Provider value={{ cart, createCart, addToCart, updateCart, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
