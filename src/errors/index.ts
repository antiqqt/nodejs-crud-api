import { IncomingMessage, ServerResponse } from 'http';

export default class HttpRequestError extends Error {
    constructor(readonly status: number, public message: string) {
        super();
    }
}

const Errors = {
    NotFound: new HttpRequestError(404, 'Path not found'),
    Internal: new HttpRequestError(500, 'Internal server error'),
    InvalidId: new HttpRequestError(400, 'Invalid user id'),
    InvalidUserBody: new HttpRequestError(400, 'Invalid user body'),
    NoUser: new HttpRequestError(404, 'No users with such id'),
} as const;

export function isHttpError(obj: unknown): obj is HttpRequestError {
    return obj instanceof HttpRequestError;
}

function handleError(error: unknown, res: ServerResponse<IncomingMessage>) {
    res.writeHead(isHttpError(error) ? error.status : 500, {
        'Content-Type': 'application/json',
    });
    res.end(
        JSON.stringify({
            message: isHttpError(error)
                ? error.message
                : Errors.Internal.message,
        }),
    );
}

function wrapInternalError<A extends Array<unknown>, R>(
    handler: (...args: A) => Promise<R>,
) {
    return async (...args: A): Promise<R> => {
        try {
            return await handler(...args);
        } catch (error) {
            if (!isHttpError(error)) {
                throw Errors.Internal;
            }
            throw error;
        }
    };
}

export { Errors, handleError, wrapInternalError };
