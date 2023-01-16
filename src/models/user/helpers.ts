import { validate } from 'uuid';
import HttpRequestError, { Errors } from '../../errors';
import { UserBody } from '../../types';

export function checkIsValidUUID(id: string) {
    return validate(id);
}

export function isHttpError(obj: unknown): obj is HttpRequestError {
    return obj instanceof HttpRequestError;
}

export function isValidUserBody(obj: object): obj is UserBody {
    if (!('username' in obj) || typeof obj.username !== 'string') return false;
    if (!('age' in obj) || typeof obj.age !== 'string') return false;
    if (!('hobbies' in obj) || !Array.isArray(obj.hobbies)) return false;

    return true;
}

export function wrapInternalError<A extends Array<unknown>, R>(
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
