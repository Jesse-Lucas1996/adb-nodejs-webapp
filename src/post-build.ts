import fs from 'fs'
import * as path from 'path'
import { config } from './config'

function postBuild() {
  const fullPath = path.join(__dirname, './website/views/components/footer.pug')
  const footer = fs.readFileSync(fullPath).toString()
  const replaced = footer
    .replace('{{buildId}}', config.buildId)
    .replace('{{installId}}', config.installId)

  fs.writeFileSync(fullPath, replaced)
}

postBuild()
