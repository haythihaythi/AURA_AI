import { useContext } from 'react'
import {
  DemoContext,
  type DemoContextValue,
} from '../store/DemoContext'

export function useDemoStore(): DemoContextValue {
  const context = useContext(DemoContext)

  if (context === undefined) {
    throw new Error('useDemoStore must be used within a DemoProvider')
  }

  return context
}
