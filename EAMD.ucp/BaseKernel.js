/* eslint-disable no-unused-vars */
/* eslint-disable no-var */
export class BaseKernel {
    global;
    constructor(gt) {
        this.global = gt;
        this.global.ONCE = this;
    }
}
