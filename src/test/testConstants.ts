export const API_ROUTE = '/api/users';

export const SuccessStatus = {
    GET: 200,
    POST: 201,
    PUT: 200,
    DELETE: 204,
} as const;

export const POST_DATA = {
    username: 'Antiqqt',
    age: 24,
    hobbies: ['NodeJS', 'Typescript'],
};

export const PUT_DATA = {
    username: 'updated Antiqqt',
    age: 24,
    hobbies: ['NodeJS', 'Typescript', 'React'],
};

export const POST_INVALID_DATA = {
    age: '23',
    hobbies: [34953509353],
};
