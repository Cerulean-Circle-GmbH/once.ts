import fs from 'fs'
import path from 'path'

// copy all files expect .ts
fs.cpSync('./src', './dist/EAMD.ucp', { recursive: true, filter: s => path.extname(s) !== '.ts' })
