import { BaseKernel } from "./BaseKernel.js";

export abstract class NodeJsKernel extends BaseKernel {
  constructor () {
    super(global)
  }
}
