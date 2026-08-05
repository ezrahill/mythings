import { useState } from 'react'
import { TaskEditor } from '../components/TaskEditor'
import { TaskList } from '../components/TaskList'
import { formatLongDate, isOverdue, isToday, todayISO } from '../lib/dates'
import { useTaskStore } from '../store/useTaskStore'
import type { ID } from '../types/common'
import './View.css'

export function TodayView() {
  const tasks = useTaskStore((state) => state.tasks)
  const [selectedTaskId, setSelectedTaskId] = useState<ID | null>(null)
  const today = todayISO()

  const active = tasks.filter((task) => !task.completed)
  const overdue = active.filter((task) => isOverdue(task.when, today))
  const dueToday = active.filter(
    (task) => isToday(task.when, today) && !task.thisEvening,
  )
  const evening = active.filter((task) => task.thisEvening)

  return (
    <div className="view">
      <h1>Today</h1>
      <p className="view-subtitle">{formatLongDate(today)}</p>

      {overdue.length > 0 && (
        <section>
          <h2 className="group-header group-header-overdue">Overdue</h2>
          <TaskList tasks={overdue} onSelect={setSelectedTaskId} showContext />
        </section>
      )}

      {dueToday.length > 0 && (
        <section>
          <h2 className="group-header">Today</h2>
          <TaskList tasks={dueToday} onSelect={setSelectedTaskId} showContext />
        </section>
      )}

      {evening.length > 0 && (
        <section>
          <h2 className="group-header group-header-evening">This Evening</h2>
          <TaskList tasks={evening} onSelect={setSelectedTaskId} showContext />
        </section>
      )}

      <TaskEditor taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
    </div>
  )
}
