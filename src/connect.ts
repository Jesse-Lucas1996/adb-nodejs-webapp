import adb, { Device } from '@devicefarmer/adbkit'
import bluebird from 'bluebird'

export async function doWork(ip: string, cmd: Command) {
  const client = adb.createClient()
  const wtf = await client.connect(ip)
  wtf

  const t = await client.connection()
  t

  const devices = client.listDevices()
  const res = bluebird.map(devices, async (device: Device) => {
    const d = client.getDevice(device.id)
    const commands = adbCommandsLookup[cmd]
    for (const command of commands) {
      d.shell(command)
        .then(adb.util.readAll)
        .then(function (output) {
          console.log('[%s] %s', device.id, output.toString().trim())
        })
    }
  })

  return res
}

const emergencyCommands = [
  'input keyevent 224',
  'am start -n com.emergencyreactnativeapp/com.emergencyreactnativeapp.MainActivity',
  'service call audio 7 i32 3 i32 10 i32 i',
]
const resetCommands = ['wipe data']

type AdbCommands = {
  [K in Command]: string[]
}

const adbCommandsLookup: AdbCommands = {
  sendEmergency: emergencyCommands,
  reset: resetCommands,
}

type Command = 'sendEmergency' | 'reset'
