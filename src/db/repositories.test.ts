import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './db'
import {
  areaRepository,
  projectRepository,
  tagRepository,
  taskRepository,
} from './repositories'

beforeEach(async () => {
  await Promise.all([
    db.tasks.clear(),
    db.projects.clear(),
    db.areas.clear(),
    db.tags.clear(),
  ])
})

const baseTask = {
  tagIds: [] as string[],
  thisEvening: false,
  completed: false,
  order: 0,
  createdAt: '2026-08-05T00:00:00.000Z',
}

describe('taskRepository', () => {
  it('creates and retrieves a task', async () => {
    await taskRepository.create({ ...baseTask, id: 't1', title: 'Buy milk' })
    const task = await taskRepository.get('t1')
    expect(task?.title).toBe('Buy milk')
  })

  it('lists all tasks', async () => {
    await taskRepository.create({ ...baseTask, id: 't1', title: 'One' })
    await taskRepository.create({ ...baseTask, id: 't2', title: 'Two' })
    const tasks = await taskRepository.list()
    expect(tasks.map((t) => t.id).sort()).toEqual(['t1', 't2'])
  })

  it('updates a task', async () => {
    await taskRepository.create({ ...baseTask, id: 't1', title: 'Buy milk' })
    await taskRepository.update('t1', { completed: true })
    const task = await taskRepository.get('t1')
    expect(task?.completed).toBe(true)
  })

  it('removes a task', async () => {
    await taskRepository.create({ ...baseTask, id: 't1', title: 'Buy milk' })
    await taskRepository.remove('t1')
    const task = await taskRepository.get('t1')
    expect(task).toBeUndefined()
  })

  it('filters tasks by project', async () => {
    await taskRepository.create({
      ...baseTask,
      id: 't1',
      title: 'In project',
      projectId: 'p1',
    })
    await taskRepository.create({ ...baseTask, id: 't2', title: 'No project' })
    const tasks = await taskRepository.byProject('p1')
    expect(tasks.map((t) => t.id)).toEqual(['t1'])
  })

  it('filters tasks by area', async () => {
    await taskRepository.create({
      ...baseTask,
      id: 't1',
      title: 'In area',
      areaId: 'a1',
    })
    await taskRepository.create({ ...baseTask, id: 't2', title: 'No area' })
    const tasks = await taskRepository.byArea('a1')
    expect(tasks.map((t) => t.id)).toEqual(['t1'])
  })

  it('filters tasks by tag', async () => {
    await taskRepository.create({
      ...baseTask,
      id: 't1',
      title: 'Tagged',
      tagIds: ['tag-1'],
    })
    await taskRepository.create({ ...baseTask, id: 't2', title: 'Untagged' })
    const tasks = await taskRepository.byTag('tag-1')
    expect(tasks.map((t) => t.id)).toEqual(['t1'])
  })

  it('filters tasks by date range (inclusive)', async () => {
    await taskRepository.create({
      ...baseTask,
      id: 't1',
      title: 'Before range',
      when: '2026-08-04',
    })
    await taskRepository.create({
      ...baseTask,
      id: 't2',
      title: 'In range',
      when: '2026-08-06',
    })
    await taskRepository.create({
      ...baseTask,
      id: 't3',
      title: 'After range',
      when: '2026-08-10',
    })
    const tasks = await taskRepository.byDateRange('2026-08-05', '2026-08-07')
    expect(tasks.map((t) => t.id)).toEqual(['t2'])
  })
})

describe('projectRepository', () => {
  it('creates, updates and removes a project', async () => {
    await projectRepository.create({
      id: 'p1',
      name: 'Renovate kitchen',
      completed: false,
      order: 0,
    })
    let project = await projectRepository.get('p1')
    expect(project?.name).toBe('Renovate kitchen')

    await projectRepository.update('p1', { completed: true })
    project = await projectRepository.get('p1')
    expect(project?.completed).toBe(true)

    await projectRepository.remove('p1')
    project = await projectRepository.get('p1')
    expect(project).toBeUndefined()
  })

  it('filters projects by area', async () => {
    await projectRepository.create({
      id: 'p1',
      name: 'In area',
      areaId: 'a1',
      completed: false,
      order: 0,
    })
    await projectRepository.create({
      id: 'p2',
      name: 'No area',
      completed: false,
      order: 1,
    })
    const projects = await projectRepository.byArea('a1')
    expect(projects.map((p) => p.id)).toEqual(['p1'])
  })
})

describe('areaRepository', () => {
  it('creates, updates and removes an area', async () => {
    await areaRepository.create({ id: 'a1', name: 'Work', order: 0 })
    let area = await areaRepository.get('a1')
    expect(area?.name).toBe('Work')

    await areaRepository.update('a1', { name: 'Home' })
    area = await areaRepository.get('a1')
    expect(area?.name).toBe('Home')

    await areaRepository.remove('a1')
    area = await areaRepository.get('a1')
    expect(area).toBeUndefined()
  })
})

describe('tagRepository', () => {
  it('creates, updates and removes a tag', async () => {
    await tagRepository.create({ id: 'tag-1', name: 'errand' })
    let tag = await tagRepository.get('tag-1')
    expect(tag?.name).toBe('errand')

    await tagRepository.update('tag-1', { color: '#2FB380' })
    tag = await tagRepository.get('tag-1')
    expect(tag?.color).toBe('#2FB380')

    await tagRepository.remove('tag-1')
    tag = await tagRepository.get('tag-1')
    expect(tag).toBeUndefined()
  })
})
