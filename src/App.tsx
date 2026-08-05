import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { QuickEntry } from './components/QuickEntry'
import { Sidebar } from './components/Sidebar'
import { useHotkeys } from './lib/keyboard'
import { AreaDetail } from './routes/AreaDetail'
import { AreasView } from './routes/AreasView'
import { ProjectDetail } from './routes/ProjectDetail'
import { ProjectsView } from './routes/ProjectsView'
import { TodayView } from './routes/TodayView'
import { UpcomingView } from './routes/UpcomingView'
import { useAreaStore } from './store/useAreaStore'
import { useProjectStore } from './store/useProjectStore'
import { useTagStore } from './store/useTagStore'
import { useTaskStore } from './store/useTaskStore'

function App() {
  const [quickEntryOpen, setQuickEntryOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const hydrateTasks = useTaskStore((state) => state.hydrate)
  const hydrateProjects = useProjectStore((state) => state.hydrate)
  const hydrateAreas = useAreaStore((state) => state.hydrate)
  const hydrateTags = useTagStore((state) => state.hydrate)

  useEffect(() => {
    Promise.all([
      hydrateTasks(),
      hydrateProjects(),
      hydrateAreas(),
      hydrateTags(),
    ]).then(() => setHydrated(true))
  }, [hydrateTasks, hydrateProjects, hydrateAreas, hydrateTags])

  useHotkeys({
    'mod+n': () => setQuickEntryOpen(true),
  })

  return (
    <div className="app-shell">
      <Sidebar onNewTask={() => setQuickEntryOpen(true)} />
      <main className="app-content">
        {hydrated ? (
          <Routes>
            <Route path="/" element={<Navigate to="/today" replace />} />
            <Route path="/today" element={<TodayView />} />
            <Route path="/upcoming" element={<UpcomingView />} />
            <Route path="/projects" element={<ProjectsView />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/areas" element={<AreasView />} />
            <Route path="/areas/:id" element={<AreaDetail />} />
          </Routes>
        ) : (
          <p className="app-loading">Loading…</p>
        )}
      </main>
      <QuickEntry open={quickEntryOpen} onClose={() => setQuickEntryOpen(false)} />
    </div>
  )
}

export default App
