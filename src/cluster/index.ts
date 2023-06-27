/* eslint-disable no-console */
import cluster from 'node:cluster';
import {
    createServer,
    IncomingMessage,
    request,
    ServerResponse,
} from 'node:http';
import { cpus } from 'node:os';
import process from 'node:process';
import ServerErrors from '../errors';
import router from '../router';

export class Counter {
    private count: number;

    constructor(private cpusCount: number) {
        this.count = 0;
    }

    increment() {
        const newCount = this.count + 1;

        if (newCount === this.cpusCount) {
            this.count = 0;
        } else {
            this.count = newCount;
        }
    }

    getCurrentCount() {
        return this.count;
    }
}

const numCPUs = cpus().length;
const workers: {
    port: number;
    worker: ReturnType<typeof cluster.fork>;
}[] = [];
const counter = new Counter(numCPUs);

export default function clusterize(port: number) {
    if (cluster.isPrimary) {
        for (let i = 0; i < numCPUs; i += 1) {
            const workerPort = port + i + 1;
            const worker = cluster.fork({ PORT: workerPort });

            workers.push({
                port: workerPort,
                worker,
            });
        }

        createServer((req, res) => {
            const currentWorker = workers[counter.getCurrentCount()];

            const options = {
                headers: req.headers,
                method: req.method,
                path: req.url,
                port: currentWorker.port,
            };

            console.log(
                `Request is handled by worker on port ${currentWorker.port}`,
            );

            const workerRequest = request(options, (workerResponse) => {
                let data = '';

                workerResponse.on('data', (chunk) => {
                    data += chunk.toString();
                });

                workerResponse.on('end', () => {
                    res.writeHead(
                        workerResponse.statusCode ??
                            ServerErrors.Internal.status,
                        { 'content-Type': 'application/json' },
                    );
                    res.end(data);
                });
            });

            let body = '';

            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                workerRequest.write(body);
                workerRequest.end();
            });

            counter.increment();
        }).listen(process.env.PORT, () =>
            console.log(`Balancer is running on port: ${port}`),
        );

        cluster.on('exit', (worker) => {
            console.log(`Worker ${worker.process.pid} died`);
        });
    }

    if (cluster.isWorker) {
        createServer((req: IncomingMessage, res: ServerResponse) => {
            router.handleRequest(req, res);
        }).listen(process.env.PORT);

        console.log(`Worker is running on port ${process.env.PORT}`);
    }
}
