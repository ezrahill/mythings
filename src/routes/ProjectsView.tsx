import { Link } from 'react-router-dom'
import { useProjectStore } from '../store/useProjectStore'
import { useTaskStore } from '../store/useTaskStore'
import './View.css'

export function ProjectsView() {
  const projects = useProjectStore((state) => state.projects)
  const tasks = useTaskStore((state) => state.tasks)

  return (
    <div className="view">
      <h1>Projects</h1>
      <ul className="card-grid">
        {projects
          .filter((project) => !project.completed)
          .map((project) => {
            const projectTasks = tasks.filter(
              (task) => task.projectId === project.id,
            )
            const completedCount = projectTasks.filter(
              (task) => task.completed,
            ).length
            return (
              <li key={project.id}>
                <Link to={`/projects/${project.id}`} className="card">
                  <span>{project.name}</span>
                  <span className="card-fraction">
                    {completedCount}/{projectTasks.length}
                  </span>
                </Link>
              </li>
            )
          })}
      </ul>
    </div>
  )
}
