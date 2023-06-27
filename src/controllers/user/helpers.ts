import { IncomingMessage } from 'http';
import ServerErrors from '../../errors';

export default function extractPostData(req: IncomingMessage) {
    return new Promise((resolve, reject) => {
        try {
            let body = '';

            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', () => {
                resolve(body);
            });
        } catch {
            reject(ServerErrors.Internal);
        }
    });
}
