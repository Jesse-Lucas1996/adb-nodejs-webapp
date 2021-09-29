import Router from 'express-promise-router'
import path from 'path'
import fs from 'fs'
import { UploadedFile } from 'express-fileupload'
import { ApplicationError } from '../../types'

const asyncFs = fs.promises,
  rootPath = __dirname.replace('/website/routes', ''),
  fullApksPath = path.join(rootPath, './apks')

// TODO: Corresponding API handler

const router = Router()

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
    throw new ApplicationError('File does not exist')
  }

  const uploadPath = path.join(fullApksPath, `./${apk.name}`)
  await apk.mv(uploadPath)

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
