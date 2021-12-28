import { BaseKernel } from './BaseKernel.js'

export class BrowserKernel extends BaseKernel {
  constructor () {
    super(window)
  }

  async start () {
    console.log('running in browser')
    document.body.innerText = 'ONCE for Browser LOADED'
    return this
  }
}
