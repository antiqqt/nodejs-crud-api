import { createServer } from 'node:http';
import * as dotenv from 'dotenv';
import router from './router';

dotenv.config();

const port = process.env.PORT || 6000;

const server = createServer((req, res) => {
    router.handleRequest(req, res);
});

server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port: ${port}`);
});
