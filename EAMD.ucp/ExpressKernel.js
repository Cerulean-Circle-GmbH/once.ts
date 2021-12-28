import { NodeJsKernel } from './NodeJsKernel.js';
import express from 'express';
import http from 'http';
export class ExpressKernel extends NodeJsKernel {
    express = express();
    async start(port = 8080) {
        console.log('running in node');
        this.express.get('/', (req, res) => {
            res.send('Hello World!');
        });
        await this.startServer(port);
        return this;
    }
    async startServer(port) {
        const server = http.createServer(this.express);
        server.listen(port, () => {
            console.log(`HTTP server listening at http://localhost:${port}`);
        });
    }
}
