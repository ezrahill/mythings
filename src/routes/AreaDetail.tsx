import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { TaskEditor } from '../components/TaskEditor'
import { TaskList } from '../components/TaskList'
import { useAreaStore } from '../store/useAreaStore'
import { useTaskStore } from '../store/useTaskStore'
import type { ID } from '../types/common'
import './View.css'

export function AreaDetail() {
  const { id } = useParams()
  const area = useAreaStore((state) => state.areas.find((a) => a.id === id))
  const allTasks = useTaskStore((state) => state.tasks)
  const tasks = allTasks.filter(
    (task) => task.areaId === id && !task.completed,
  )
  const [selectedTaskId, setSelectedTaskId] = useState<ID | null>(null)

  const unscheduled = tasks.filter((task) => !task.when)
  const scheduled = tasks.filter((task) => task.when)

  return (
    <div className="view">
      <h1>{area?.name ?? 'Area'}</h1>

      {unscheduled.length > 0 && (
        <section>
          <TaskList tasks={unscheduled} onSelect={setSelectedTaskId} />
        </section>
      )}

      {scheduled.length > 0 && (
        <section>
          <h2 className="group-header">Scheduled</h2>
          <TaskList tasks={scheduled} onSelect={setSelectedTaskId} />
        </section>
      )}

      <TaskEditor taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
    </div>
  )
}
