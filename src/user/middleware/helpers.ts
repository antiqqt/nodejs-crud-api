import { validate } from 'uuid';
import { UserDto } from '../types';

export function isValidUUID(id: string) {
    return validate(id);
}

export function isValidUserDto(obj: object): obj is UserDto {
    if (!('username' in obj) || typeof obj.username !== 'string') return false;
    if (!('age' in obj) || typeof obj.age !== 'number') return false;
    if (!('hobbies' in obj) || !Array.isArray(obj.hobbies)) return false;

    return true;
}
