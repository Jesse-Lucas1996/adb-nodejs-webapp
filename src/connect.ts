import adb, { Device } from '@devicefarmer/adbkit'
import bluebird from 'bluebird'

export async function doWork() {
  const client = adb.createClient()
  const devices = await client.listDevices()
  client.connect('10.100.104.198', 5555)
  const res = bluebird.map(devices, (device: Device) => {
    const d = client.getDevice(device.id)
    return d
      .shell('echo $RANDOM')
      .then(adb.util.readAll)
      .then(function (output) {
        console.log('[%s] %s', device.id, output.toString().trim())
      })
  })
  return res
}
