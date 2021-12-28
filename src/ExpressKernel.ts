import { NodeJsKernel } from './NodeJsKernel.js'
import express from 'express'
import http from 'http'
import cors from 'cors'
import serveIndex from 'serve-index'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

export class ExpressKernel extends NodeJsKernel {
  protected express = express()
  private __filename = fileURLToPath(import.meta.url)
private __dirname = dirname(this.__filename)

async start (port = 8080) {
  console.log('running in node')
  this.express.use(cors())
  this.express.use('/EAMD.ucp', serveIndex('dist/EAMD.ucp', { icons: true }))
  this.express.use('/EAMD.ucp', express.static('dist/EAMD.ucp', {}))

  this.express.get('/', (req, res) => {
    res.send(this.__dirname)
  })
  await this.startServer(port)
  return this
}

protected async startServer (port:number) {
  const server = http.createServer(this.express)
  server.listen(port, () => {
    console.log(`HTTP server listening at http://localhost:${port}`)
  })
}
}
