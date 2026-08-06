import { useState } from 'react'
import { TaskEditor } from '../components/TaskEditor'
import { TaskList } from '../components/TaskList'
import { formatLongDate, groupByDate, todayISO } from '../lib/dates'
import { useTaskStore } from '../store/useTaskStore'
import type { ID } from '../types/common'
import './View.css'

export function UpcomingView() {
  const tasks = useTaskStore((state) => state.tasks)
  const [selectedTaskId, setSelectedTaskId] = useState<ID | null>(null)
  const today = todayISO()

  const upcoming = tasks.filter(
    (task) => !task.completed && task.when !== undefined && task.when > today,
  )
  const groups = groupByDate(upcoming)

  return (
    <div className="view">
      <h1>Upcoming</h1>

      {groups.map(([date, tasksForDate]) => (
        <section key={date}>
          <h2 className="group-header">{formatLongDate(date)}</h2>
          <TaskList tasks={tasksForDate} onSelect={setSelectedTaskId} showContext />
        </section>
      ))}

      <TaskEditor taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
    </div>
  )
}
