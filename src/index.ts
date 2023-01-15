import { createServer } from 'node:http';
import * as dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 5000;

const server = createServer(() => {});

server.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});
