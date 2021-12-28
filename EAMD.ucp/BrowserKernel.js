import { BaseKernel } from './BaseKernel.js';
export class BrowserKernel extends BaseKernel {
    constructor() {
        super(window);
    }
    async start() {
        console.log('running in browser');
        return this;
    }
}
