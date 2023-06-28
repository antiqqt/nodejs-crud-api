enum ErrorStatusCodes {
    NOT_FOUND = 404,
    BAD_REQUEST = 400,
    INTERNAL = 500,
}

enum ErrorMessages {
    NOT_FOUND = 'Path not found',
    INTERNAL = 'Internal server error',
    INVALID_USER_ID = 'Invalid user id',
    INVALID_USER_BODY = 'Invalid user body',
    USER_NOT_FOUND = 'No users with such id',
}

export class ServerError extends Error {
    constructor(readonly statusCode: number, public message: string) {
        super();
    }
}

const ServerErrors = {
    NotFound: new ServerError(
        ErrorStatusCodes.NOT_FOUND,
        ErrorMessages.NOT_FOUND,
    ),
    Internal: new ServerError(
        ErrorStatusCodes.INTERNAL,
        ErrorMessages.INTERNAL,
    ),
    InvalidId: new ServerError(
        ErrorStatusCodes.BAD_REQUEST,
        ErrorMessages.INVALID_USER_ID,
    ),
    InvalidUserBody: new ServerError(
        ErrorStatusCodes.BAD_REQUEST,
        ErrorMessages.INVALID_USER_BODY,
    ),
    NoUser: new ServerError(
        ErrorStatusCodes.NOT_FOUND,
        ErrorMessages.USER_NOT_FOUND,
    ),
} as const;

export default ServerErrors;

export function isServerError(error: unknown): error is ServerError {
    return error instanceof ServerError;
}
