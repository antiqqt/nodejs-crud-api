enum ErrorStatuses {
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
    constructor(readonly status: number, public message: string) {
        super();
    }
}

const ServerErrors = {
    NotFound: new ServerError(ErrorStatuses.NOT_FOUND, ErrorMessages.NOT_FOUND),
    Internal: new ServerError(ErrorStatuses.INTERNAL, ErrorMessages.INTERNAL),
    InvalidId: new ServerError(
        ErrorStatuses.BAD_REQUEST,
        ErrorMessages.INVALID_USER_ID,
    ),
    InvalidUserBody: new ServerError(
        ErrorStatuses.BAD_REQUEST,
        ErrorMessages.INVALID_USER_BODY,
    ),
    NoUser: new ServerError(
        ErrorStatuses.NOT_FOUND,
        ErrorMessages.USER_NOT_FOUND,
    ),
} as const;

export default ServerErrors;
