import adb, { Device } from '@devicefarmer/adbkit'
import bluebird from 'bluebird'
import { Duplex } from 'node:stream'
import { pool } from './adb'

export function doWork(_ip: string, cmd: Command) {
  const client = pool.client
  const commands = adbCommandsLookup[cmd]

  client.listDevices().then(devices => {
    bluebird.map(devices, executeDeviceCommands)
  })

  // const devices = client.listDevices()

  function executeDeviceCommands(device: Device) {
    const d = client.getDevice(device.id)
    for (const command of commands) {
      d.shell(command)
        .then(readStream)
        .then(logOutput)
        .then(() => {
          // client.disconnect(ip.split(':')[0])
        })
    }
  }
}

function readStream(stream: Duplex) {
  const res = adb.util.readAll(stream)
  return res
}

function logOutput(output: Buffer) {
  console.log(':: OUTPUT: ', output.toString().trim())
}

const adbCommandsLookup: { [K in Command]: string[] } = {
  sendEmergency: [
    'input keyevent 224',
    'am start -n com.emergencyreactnativeapp/com.emergencyreactnativeapp.MainActivity',
    'service call audio 7 i32 3 i32 10 i32 i',
  ],
  reset: ['wipe data'],
  uptime: ['uptime'],
}

type Command = 'sendEmergency' | 'reset' | 'uptime'
