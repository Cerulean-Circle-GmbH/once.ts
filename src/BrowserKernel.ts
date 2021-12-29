import { BaseKernel } from './BaseKernel.js'
import { ServiceWorkerKernel } from './ServiceWorkerKernel.js'
import { Thinglish } from './Thinglish.js'

export class BrowserKernel extends BaseKernel {
  constructor () {
    super(window)
  }

  async start () {
    console.log('running in browser')
    document.body.innerText = 'ONCE for Browser LOADED'
    await Thinglish.getInstance(ServiceWorkerKernel).start()
    return this
  }
}
