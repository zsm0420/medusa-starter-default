'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Medusa } from '@medusajs/medusa-js'

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })

const MedusaContext = createContext<{ client: Medusa } | null>(null)

export function MedusaProvider({ children }: { children: React.ReactNode }) {
  return (
    <MedusaContext.Provider value={{ client: medusa }}>
      {children}
    </MedusaContext.Provider>
  )
}

export function useMedusa() {
  const context = useContext(MedusaContext)
  if (!context) {
    throw new Error('useMedusa must be used within a MedusaProvider')
  }
  return context.client
}
