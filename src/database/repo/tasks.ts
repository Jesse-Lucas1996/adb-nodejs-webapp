import NeDB from 'nedb-promises'

const seededTasks: StoredTask[] = [
  {
    taskId: 'sendEmergency',
    description: 'Push and launch emergency app',
    unitsOfWork: [
      { cmd: 'input keyevent 224' },
      {
        cmd: 'am start -n com.emergencyreactnativeapp/com.emergencyreactnativeapp.MainActivity',
      },
      { cmd: 'service call audio 7 i32 3 i32 0 i32 i' },
    ],
  },
  {
    taskId: 'stopEmergency',
    description: 'Stop and exit emergency app',
    unitsOfWork: [{ cmd: 'am force-stop com.emergencyreactnativeapp' }],
  },
  {
    taskId: 'reset',
    description: 'Wipe user data',
    unitsOfWork: [{ cmd: 'wipe data' }],
  },
  {
    taskId: 'uptime',
    description: 'Show system uptime',
    unitsOfWork: [
      {
        cmd: 'uptime',
      },
    ],
  },
  {
    taskId: 'setWifiSleepPolicy',
    description: 'Set WiFi sleep policy to 1',
    unitsOfWork: [{ cmd: 'settings put global wifi_sleep_policy 1' }],
  },
]

type StoredTask = {
  taskId: string
  description: string
  unitsOfWork: { cmd: string }[]
}

export function createTasksRepo(path?: string) {
  const datastore = NeDB.create(path ?? './tasks.db')
  for (const task of seededTasks) {
    datastore.findOne<StoredTask>({ taskId: task.taskId }).then(t => {
      if (!t) {
        datastore.insert(task)
      }
    })
  }

  const update = async (task: StoredTask) => {
    await datastore.update<StoredTask>(
      { taskId: task.taskId },
      {
        taskId: task.taskId,
        description: task.description,
        unitsOfWork: task.unitsOfWork,
      },
      {
        upsert: true,
      }
    )
  }

  const get = async (taskId: string): Promise<StoredTask | undefined> => {
    return await datastore.findOne<StoredTask>({ taskId }, { _id: 0 })
  }

  const getAll = async (): Promise<StoredTask[]> => {
    return await datastore.find<StoredTask>({}, { _id: 0 })
  }

  return {
    update,
    get,
    getAll,
  }
}
