import { Task, TaskType, UnitOfWork } from './types'

export function createTask(type: TaskType): Task {
  const lookup: { [K in TaskType]: UnitOfWork[] } = {
    sendEmergency: [
      { cmd: 'input keyevent 224' },
      {
        cmd:
          'am start -n com.emergencyreactnativeapp/com.emergencyreactnativeapp.MainActivity',
      },
      { cmd: 'service call audio 7 i32 3 i32 20 i32 i' },
    ],
    reset: [{ cmd: 'wipe data' }],
    uptime: [
      {
        cmd: 'uptime',
        validate: cmdOutput => {
          const isResultValid = cmdOutput.includes('load average')
          return {
            error: !isResultValid,
            message: isResultValid
              ? undefined
              : `Validation failed. Command output does not match expected output. Command output is: ${cmdOutput}`,
          }
        },
      },
    ],
  }

  return lookup[type]
}
