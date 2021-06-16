import express from 'express'
import path from 'path'
import fs from 'fs'
import { UploadedFile } from 'express-fileupload'

const asyncFs = fs.promises,
  rootPath = __dirname.replace('/website/routes', ''),
  fullApksPath = path.join(rootPath, './apks')

// TODO: Corresponding API handler

const router = express.Router()

router.get('/', async (_req, res) => {
  const files = await asyncFs.readdir(fullApksPath)

  const applications: {
    filename: string
    size: number
    created: string
    modified: string
  }[] = []

  for (const filename of files) {
    const filePath = path.join(fullApksPath, `./${filename}`)
    const metadata = await getFileMetadata(filePath)
    applications.push({ ...metadata, filename })
  }

  res.render('applications.pug', { apks: applications })
})

router.post('/', async (req, res) => {
  const apk = req.files?.apk as UploadedFile

  if (!apk) {
    return res.status(400).send()
  }

  const uploadPath = path.join(fullApksPath, `./${apk.name}`)

  try {
    await apk.mv(uploadPath)
  } catch (ex) {
    return res.status(500).send(ex.message)
  }

  return res.redirect('/applications')
})

async function getFileMetadata(filename: string) {
  const stats = await asyncFs.stat(filename)
  return {
    size: stats.size,
    created: stats.birthtime.toISOString(),
    modified: stats.mtime.toISOString(),
  }
}

export default router
