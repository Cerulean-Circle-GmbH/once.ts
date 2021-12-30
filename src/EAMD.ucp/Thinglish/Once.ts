import { Thinglish } from './Thinglish.js'
//@ts-ignore
import {ServiceWorkerKernel} from '../ServiceWorker/ServiceWorkerKernel.js'

/**
 * 
 */
export  class Once {
    private static async getNodeKernel () {
        switch (process.env.NODE_ENV) {
          case 'localtunnel': return (await import('../Kernel/LocalTunnelKernel.js')).LocalTunnelKernel
          case 'development': return (await import('../Kernel/DevelopmentExpressKernel.js')).DevelopmentExpressKernel
          default: return (await import('../Kernel/ExpressKernel.js')).ExpressKernel
        }
    }

    static start() {
           if(Thinglish.isServiceWorker){
             // @ts-ignore
        Thinglish.getInstance(ServiceWorkerKernel).addEventListener(self)
      }
      else{

        this.startAsync()
      }
       
      }

     private static async startAsync(){
      if (Thinglish.isNode) {

        ONCE = Thinglish.getInstance(await this.getNodeKernel())
      } else if(Thinglish.isBrowser) {
        const browserKernel = (await import('../Kernel/BrowserKernel.js')).BrowserKernel
        ONCE = Thinglish.getInstance(browserKernel)
      }
      ONCE && ONCE.start && await ONCE.start()  
    }

}