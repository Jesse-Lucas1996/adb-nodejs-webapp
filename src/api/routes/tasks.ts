import express from 'express'
import { repo } from '../../database'

const router = express.Router()

router.get('/', async (_req, res) => {
  const tasks = await repo.tasks.getAll()
  return res.status(200).send({ tasks })
})

router.get('/:taskId', async (req, res) => {
  const taskId = req.params['taskId']
  if (!taskId) {
    return res.status(400).send()
  }
  const task = await repo.tasks.get(taskId)
  return res.status(200).send({ task })
})

router.post('/', async (req, res) => {
  const task = req.body as TaskBody

  if (
    !(
      task.hasOwnProperty('taskId') &&
      typeof task.taskId === 'string' &&
      task.taskId
    )
  ) {
    return res.status(400).send('Invalid property taskId')
  }

  if (
    !(
      task.hasOwnProperty('description') &&
      typeof task.description === 'string' &&
      task.description
    )
  ) {
    return res.status(400).send('Invalid property description')
  }

  if (
    !(
      task.hasOwnProperty('unitsOfWork') &&
      Array.isArray(task.unitsOfWork) &&
      task.unitsOfWork.length
    )
  ) {
    return res.status(400).send('Invalid property unitsOfWork')
  }

  const invalidUnitsOfWork = task.unitsOfWork.filter(
    u => !(u.hasOwnProperty('cmd') && typeof u.cmd === 'string' && u.cmd)
  )

  if (invalidUnitsOfWork.length) {
    return res.status(400).send('Invalid one or multiple units of work')
  }

  await repo.tasks.update(task)

  return res.status(201).send()
})

type TaskBody = {
  taskId: string
  description: string
  unitsOfWork: { cmd: string }[]
}

export default router
