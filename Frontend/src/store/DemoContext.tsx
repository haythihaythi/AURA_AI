import {
  useCallback,
  createContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import {
  demoReducer,
  initialDemoState,
  type DemoAction,
  type DemoState,
} from './demoReducer'
import {
  clearPersistedDemoState,
  loadPersistedDemoState,
  savePersistedDemoState,
} from './demoPersistence'

export type DemoContextValue = {
  state: DemoState
  dispatch: Dispatch<DemoAction>
  resetDemoState: () => void
}

// oxlint-disable-next-line react/only-export-components
export const DemoContext = createContext<DemoContextValue | undefined>(
  undefined,
)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    demoReducer,
    initialDemoState,
    () => {
      const hydration = loadPersistedDemoState()

      if (import.meta.env.DEV && hydration.errors.length > 0) {
        console.warn('AURA AI demo state hydration warnings:', hydration.errors)
      }

      return hydration.state
    },
  )

  useEffect(() => {
    const result = savePersistedDemoState(state)

    if (import.meta.env.DEV && !result.success) {
      console.warn(result.error)
    }
  }, [state])

  const resetDemoState = useCallback(() => {
    const result = clearPersistedDemoState()

    if (import.meta.env.DEV && !result.success) {
      console.warn(result.error)
    }

    dispatch({ type: 'RESET_DEMO_STATE' })
  }, [])

  return (
    <DemoContext.Provider value={{ state, dispatch, resetDemoState }}>
      {children}
    </DemoContext.Provider>
  )
}
