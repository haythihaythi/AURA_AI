import { BriefcaseBusiness } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand" aria-label="AURA AI admin workspace">
        <span className="sidebar__brand-mark">A</span>
        <span>AURA AI</span>
      </div>
      <nav className="sidebar__nav" aria-label="Admin navigation">
        <NavLink
          to="/jobs"
          className={({ isActive }) =>
            `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
          }
        >
          <BriefcaseBusiness size={18} aria-hidden="true" />
          Job Openings
        </NavLink>
      </nav>
    </aside>
  )
}
