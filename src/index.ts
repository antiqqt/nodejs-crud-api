import { createServer } from 'node:http';
import * as dotenv from 'dotenv';
import router from './router';
import clusterize from './cluster';

dotenv.config();

const port = Number(process.env.PORT) || 6000;

const server = createServer((request, response) => {
    router.handleRequest(request, response);
});

if (process.env.NODE_ENV !== 'test') {
    if (process.env.NODE_MULTI) {
        clusterize(port);
    } else {
        server.listen(port, () => {
            // eslint-disable-next-line no-console
            console.log(`Server is running on port: ${port}`);
        });
    }
}

export default server;
