import { validate } from 'uuid';
import { User, UserDto } from '../types';

export function isValidUUID(id: string) {
    return validate(id);
}

export function isValidUserDto(obj: unknown): obj is UserDto {
    if (!(typeof obj === 'object') || obj == null) return false;
    if (!('username' in obj) || typeof obj.username !== 'string') return false;
    if (!('age' in obj) || typeof obj.age !== 'number') return false;
    if (!('hobbies' in obj) || !Array.isArray(obj.hobbies)) return false;

    return true;
}

function isValidUser(obj: object): obj is User {
    if (!('username' in obj) || typeof obj.username !== 'string') return false;
    if (!('age' in obj) || typeof obj.age !== 'number') return false;
    if (!('hobbies' in obj) || !Array.isArray(obj.hobbies)) return false;
    if (!('id' in obj) || typeof obj.id !== 'string') return false;

    return true;
}

export function isValidUserDatabase(obj: object): obj is User[] {
    if (!Array.isArray(obj)) return false;
    if (!obj.every(isValidUser)) return false;

    return true;
}
