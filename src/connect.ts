import adb, { Device } from '@devicefarmer/adbkit'
import bluebird from 'bluebird'

export async function doWork(ip: string) {
  const client = adb.createClient()
  client.connect(ip)
  const devices = await client.listDevices()
  const res = bluebird.map(devices, (device: Device) => {
    const d = client.getDevice(device.id)
    return d
      .shell(
        'am start -n com.emergencyreactnativeapp/com.emergencyreactnativeapp.MainActivity'
      )
      .then(adb.util.readAll)
      .then(function (output) {
        console.log('[%s] %s', device.id, output.toString().trim())
      })
  })
  return res
}
