export class Thinglish {
    static GetInstance(CTOR) {
        return new CTOR();
    }
    static get isBrowser() {
        return (typeof window !== 'undefined' && typeof window.document !== 'undefined');
    }
    static get isNode() {
        return (typeof process !== 'undefined' &&
            process.versions != null &&
            process.versions.node != null);
    }
    static get isWebWorker() {
        return (typeof self === 'object' &&
            self.constructor &&
            self.constructor.name === 'DedicatedWorkerGlobalScope');
    }
}
