import { IncomingMessage, ServerResponse } from 'http';
import ServerErrors, { ServerError } from '.';

export function isServerError(error: unknown): error is ServerError {
    return error instanceof ServerError;
}

function handleError(error: unknown, res: ServerResponse<IncomingMessage>) {
    res.writeHead(isServerError(error) ? error.status : 500, {
        'Content-Type': 'application/json',
    });
    res.end(
        JSON.stringify({
            message: isServerError(error)
                ? error.message
                : ServerErrors.Internal.message,
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
            if (!isServerError(error)) {
                throw ServerErrors.Internal;
            }
            throw error;
        }
    };
}

export { handleError, wrapInternalError };
