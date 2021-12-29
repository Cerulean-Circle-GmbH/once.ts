import { BaseKernel } from './BaseKernel.js'
import { Thinglish } from '../Thinglish/Thinglish.js'

/**
 * @module BrowserKernel
 *  test documentation
 */

/**
 * Browser kernel documentation
 */
export class BrowserKernel extends BaseKernel {
  constructor () {
    super(window)
  }
/**
 *  
 * @category  inherit methods
 * @returns 
 */
  async start () {
    console.log('running in browser')
    document.body.innerText = 'ONCE for Browser LOADED'
    //@ts-ignore
    await Thinglish.getInstance((await import('../ServiceWorker/ServiceWorkerKernel.js')).ServiceWorkerKernel).installServiceWorker(navigator)
    return this
  }
}
