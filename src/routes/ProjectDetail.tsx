import { useParams } from 'react-router-dom'
import { useProjectStore } from '../store/useProjectStore'

export function ProjectDetail() {
  const { id } = useParams()
  const project = useProjectStore((state) =>
    state.projects.find((p) => p.id === id),
  )

  return (
    <div>
      <h1>{project?.name ?? 'Project'}</h1>
    </div>
  )
}
