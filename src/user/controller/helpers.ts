import { IncomingMessage, ServerResponse } from 'http';
import ServerErrors, { ServerError, isServerError } from '../../errors';
import { HTTPStatusCodes } from '../types';

export function extractBodyJSON(
    request: IncomingMessage,
): Promise<ServerError | unknown> {
    return new Promise((resolve, reject) => {
        const buffer: Uint8Array[] = [];

        request.on('data', (chunk) => {
            buffer.push(chunk);
        });

        request.on('end', () => {
            try {
                const bodyString = Buffer.concat(buffer).toString();
                const body = JSON.parse(bodyString);

                resolve(body);
            } catch (error) {
                reject(ServerErrors.Internal);
            }
        });

        request.on('end', () => {});

        request.on('error', () => {
            reject(ServerErrors.Internal);
        });
    });
}

export async function sendResponse<Data>(
    response: ServerResponse<IncomingMessage>,
    data: Data,
    statusCode: HTTPStatusCodes,
) {
    response.statusCode = statusCode;
    response.end(JSON.stringify(data));
}

export function handleServerError(
    error: unknown,
    response: ServerResponse<IncomingMessage>,
) {
    response.writeHead(isServerError(error) ? error.statusCode : 500, {
        'Content-Type': 'application/json',
    });
    response.end(
        JSON.stringify({
            message: isServerError(error)
                ? error.message
                : ServerErrors.Internal.message,
        }),
    );
}
