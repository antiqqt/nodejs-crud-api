export default class HttpRequestError extends Error {
    constructor(public status: number, public message: string) {
        super();
    }
}

const Errors = {
    Internal: new HttpRequestError(500, 'Internal server error'),
    InvalidId: new HttpRequestError(400, 'Invalid user id'),
    InvalidUserBody: new HttpRequestError(400, 'Invalid user body'),
    NoUser: new HttpRequestError(404, 'No users with such id'),
};

export { Errors };
