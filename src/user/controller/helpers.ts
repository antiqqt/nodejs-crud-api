import { IncomingMessage, ServerResponse } from 'http';
import ServerErrors from '../../errors';
import { HTTPStatusCodes } from '../types';

export function extractRequestBody(request: IncomingMessage) {
    return new Promise((resolve, reject) => {
        try {
            let body = '';

            request.on('data', (chunk) => {
                body += chunk.toString();
            });

            request.on('end', () => {
                resolve(body);
            });
        } catch {
            reject(ServerErrors.Internal);
        }
    });
}

export function sendResponse<Data>(
    response: ServerResponse<IncomingMessage>,
    data: Data,
    statusCode: HTTPStatusCodes,
) {
    response.statusCode = statusCode;
    response.end(JSON.stringify(data));
}
