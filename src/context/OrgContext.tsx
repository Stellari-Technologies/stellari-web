import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface OrgContextType {
  orgId: string | null
  setOrgId: (id: string) => void
}

const OrgContext = createContext<OrgContextType | null>(null)

export function OrgProvider({ children }: { children: ReactNode }) {
  const [orgId, setOrgIdState] = useState<string | null>(
    localStorage.getItem('orgId')
  )

  const setOrgId = (id: string) => {
    localStorage.setItem('orgId', id)
    setOrgIdState(id)
  }

  return (
    <OrgContext.Provider value={{ orgId, setOrgId }}>
      {children}
    </OrgContext.Provider>
  )
}

export function useOrg() {
  const context = useContext(OrgContext)
  if (!context) throw new Error('useOrg must be used inside OrgProvider')
  return context
}