import * as dotenv from 'dotenv';
import { createServer } from 'node:http';
import createLoadBalancer from './cluster';
import db from './data/db';
import { createUserRouter } from './user/router';

dotenv.config();

const port = Number(process.env.PORT) || 6000;

if (process.env.NODE_MULTI) {
    createLoadBalancer(port);
} else {
    const UserRouter = createUserRouter(db);

    const server = createServer((request, response) => {
        UserRouter.handleRequest(request, response);
    });

    if (process.env.NODE_ENV !== 'test') {
        server.listen(port, () => {
            // eslint-disable-next-line no-console
            console.log(`Server is running on port: ${port}`);
        });
    }
}
