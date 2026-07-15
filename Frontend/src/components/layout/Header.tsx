import { useDemoStore } from '../../hooks/useDemoStore'
import { Button } from '../ui/Button'

export function Header() {
  const { resetDemoState } = useDemoStore()

  function handleReset() {
    if (
      window.confirm(
        'Reset all AURA AI demo changes and restore the original seed data?',
      )
    ) {
      resetDemoState()
    }
  }

  return (
    <header className="workspace-header">
      <div>
        <p className="workspace-header__title">AURA AI Demo</p>
        <p className="workspace-header__label">AURA Technology</p>
      </div>
      <div className="workspace-header__actions">
        <span className="workspace-header__mode">Demo workspace</span>
        <Button variant="ghost" onClick={handleReset}>
          Reset Demo Data
        </Button>
      </div>
    </header>
  )
}
