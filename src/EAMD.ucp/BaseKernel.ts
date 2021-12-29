/* eslint-disable no-unused-vars */
/* eslint-disable no-var */

declare global {
  var ONCE:BaseKernel
}

export abstract class BaseKernel {
  protected global: typeof globalThis;

  constructor (gt:typeof globalThis) {
    this.global = gt
    this.global.ONCE = this
  }

  abstract start (): Promise<BaseKernel>
}
