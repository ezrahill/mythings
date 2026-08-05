import { NavLink } from 'react-router-dom'
import { isOverdue, isToday, todayISO } from '../lib/dates'
import { useAreaStore } from '../store/useAreaStore'
import { useProjectStore } from '../store/useProjectStore'
import { useTaskStore } from '../store/useTaskStore'
import './Sidebar.css'

// Round-robin colour set for areas/tags, per docs/design.md.
const SWATCH_COLORS = [
  '#2FB380',
  '#AF52DE',
  '#30B0C7',
  '#E5484D',
  '#F2A93B',
  '#5E5CE6',
  '#FF6B9D',
  '#8E8E93',
]

function swatchColor(index: number) {
  return SWATCH_COLORS[index % SWATCH_COLORS.length]
}

function navItemClass({ isActive }: { isActive: boolean }) {
  return `sidebar-nav-item${isActive ? ' active' : ''}`
}

export function Sidebar({ onNewTask }: { onNewTask: () => void }) {
  const areas = useAreaStore((state) => state.areas)
  const projects = useProjectStore((state) => state.projects)
  const tasks = useTaskStore((state) => state.tasks)

  const today = todayISO()
  const todayCount = tasks.filter(
    (task) =>
      !task.completed &&
      (isToday(task.when, today) ||
        isOverdue(task.when, today) ||
        task.thisEvening),
  ).length
  const upcomingCount = tasks.filter(
    (task) => !task.completed && task.when !== undefined && task.when > today,
  ).length
  const projectsCount = projects.filter((project) => !project.completed).length

  return (
    <nav className="sidebar" aria-label="Main">
      <button type="button" className="sidebar-new-todo" onClick={onNewTask}>
        <span>New To-Do</span>
        <kbd>⌘N</kbd>
      </button>

      <ul className="sidebar-nav">
        <li>
          <NavLink to="/today" className={navItemClass}>
            <span
              className="sidebar-dot sidebar-dot-today"
              aria-hidden="true"
            />
            <span className="sidebar-nav-label">Today</span>
            <span className="sidebar-count">{todayCount}</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/upcoming" className={navItemClass}>
            <span
              className="sidebar-dot sidebar-dot-upcoming"
              aria-hidden="true"
            />
            <span className="sidebar-nav-label">Upcoming</span>
            <span className="sidebar-count">{upcomingCount}</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects" className={navItemClass}>
            <span
              className="sidebar-dot sidebar-dot-projects"
              aria-hidden="true"
            />
            <span className="sidebar-nav-label">Projects</span>
            <span className="sidebar-count">{projectsCount}</span>
          </NavLink>
        </li>
      </ul>

      <div className="sidebar-section">
        <span className="sidebar-section-label">Areas</span>
        <ul className="sidebar-tree">
          {areas.map((area, index) => (
            <li key={area.id}>
              <NavLink to={`/areas/${area.id}`} className="sidebar-area">
                <span
                  className="sidebar-swatch"
                  style={{ background: swatchColor(index) }}
                  aria-hidden="true"
                />
                <span>{area.name}</span>
              </NavLink>
              <ul className="sidebar-tree-projects">
                {projects
                  .filter((project) => project.areaId === area.id)
                  .map((project) => (
                    <li key={project.id}>
                      <NavLink
                        to={`/projects/${project.id}`}
                        className="sidebar-project"
                      >
                        <span className="sidebar-bullet" aria-hidden="true" />
                        <span>{project.name}</span>
                      </NavLink>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
