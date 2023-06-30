/* eslint-disable no-console */
import cluster from 'node:cluster';
import {
    request as HTTPRequest,
    IncomingMessage,
    ServerResponse,
    createServer,
} from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';
import db from '../data/db';
import { handleServerError } from '../user/controller/helpers';
import { isValidUserDatabase } from '../user/middleware/helpers';
import { createUserRouter } from '../user/router';
import RoundRobinCounter from './counter';

const availableParalellism = availableParallelism();
const workers: {
    port: number;
    worker: ReturnType<typeof cluster.fork>;
}[] = [];
const counter = new RoundRobinCounter(availableParalellism);

export default function createLoadBalancer(port: number) {
    if (cluster.isPrimary) {
        for (let i = 0; i < availableParalellism; i += 1) {
            const workerPort = port + i + 1;
            const worker = cluster.fork({ PORT: workerPort });

            workers.push({
                port: workerPort,
                worker,
            });
        }

        let clusterDatabase = db;

        createServer(async (clusterRequest, clusterResponse) => {
            const currentWorker = workers[counter.increment()];

            console.log(
                `Request is handled by worker on port ${currentWorker.port}`,
            );

            cluster.on('exit', (worker) => {
                console.log(`Worker ${worker.process.pid} died`);
            });

            const options = {
                headers: clusterRequest.headers,
                method: clusterRequest.method,
                path: clusterRequest.url,
                port: currentWorker.port,
            };

            workers.forEach(({ worker }) => {
                worker.on('message', ({ workerDatabase }) => {
                    if (worker.id !== currentWorker.worker.id) return;
                    console.log('cluster received db');

                    clusterDatabase = workerDatabase;
                });
            });

            // Update worker database and
            // redirect the request to the worker router
            currentWorker.worker.send({ clusterDatabase });

            const workerRequest = HTTPRequest(
                options,
                async (workerResponse) => {
                    try {
                        // Handle request in worker and
                        // send worker response as the cluster response
                        console.log('cluster receives workerResponse');

                        clusterResponse.setHeader(
                            'Content-Type',
                            'application/json',
                        );
                        workerResponse.pipe(clusterResponse);
                    } catch (error) {
                        handleServerError(error, clusterResponse);
                    }
                },
            );

            clusterRequest.pipe(workerRequest);
        }).listen(process.env.PORT, () =>
            console.log(`Balancer is running on port: ${port}`),
        );
    }

    if (cluster.isWorker) {
        let workerDatabase = db;

        process.on('message', ({ clusterDatabase }) => {
            if (!isValidUserDatabase(clusterDatabase)) return;

            console.log('worker received db');
            workerDatabase = clusterDatabase;
        });

        createServer(
            async (request: IncomingMessage, response: ServerResponse) => {
                // Handle cluster request and
                // send the db state back to the cluster
                console.log('worker handles request');

                try {
                    const router = createUserRouter(workerDatabase);
                    await router.handleRequest(request, response);
                } catch (error) {
                    console.error(error);
                }

                process.send?.({ workerDatabase });
            },
        ).listen(process.env.PORT);

        console.log(`Worker is running on port ${process.env.PORT}`);
    }
}
