import { IncomingMessage, ServerResponse } from 'http';
import ServerErrors, { ServerError } from '.';

function isServerError(error: unknown): error is ServerError {
    return error instanceof ServerError;
}

function handleError(error: unknown, res: ServerResponse<IncomingMessage>) {
    res.writeHead(isServerError(error) ? error.statusCode : 500, {
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

export { handleError, isServerError };