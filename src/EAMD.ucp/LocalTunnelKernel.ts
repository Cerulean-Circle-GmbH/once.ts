import localtunnel from 'localtunnel'
import { ExpressKernel } from './ExpressKernel.js'
import os from 'os'

export class LocalTunnelKernel extends ExpressKernel {
  protected async startServer (port:number) {
    await super.startServer(port)
    try {
      const subdomain = `${encodeURI(os.userInfo().username)}-2cu-once`
      const tunnel = await localtunnel(port, { subdomain })
      this.logUrls(tunnel.url)
    } catch (e) {
      console.error('ERR', e)
    }
  }
}
