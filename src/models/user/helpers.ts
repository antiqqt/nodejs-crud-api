import { validate } from 'uuid';
import { UserBody } from '../../types';

export function checkIsValidUUID(id: string) {
    return validate(id);
}

export function isValidUserBody(obj: object): obj is UserBody {
    if (!('username' in obj) || typeof obj.username !== 'string') return false;
    if (!('age' in obj) || typeof obj.age !== 'string') return false;
    if (!('hobbies' in obj) || !Array.isArray(obj.hobbies)) return false;

    return true;
}
