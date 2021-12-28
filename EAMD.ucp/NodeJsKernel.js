import { BaseKernel } from './BaseKernel.js';
export class NodeJsKernel extends BaseKernel {
    constructor() {
        super(global);
    }
}
