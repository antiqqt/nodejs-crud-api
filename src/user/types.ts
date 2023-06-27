export const enum HTTPStatusCodes {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
}

export interface User {
    id: string;
    username: string;
    age: string;
    hobbies: string[];
}

export type UserDto = Omit<User, 'id'>;
