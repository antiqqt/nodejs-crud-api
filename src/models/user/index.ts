import { v4 as uuidv4 } from 'uuid';
import users from '../../data/db';
import { Errors, wrapInternalError } from '../../errors';
import { UserBody, UserData } from '../../types';
import { checkIsValidUUID, isValidUserBody } from './helpers';

let db = users;

async function findAll() {
    return db;
}

async function findOne(id: string) {
    if (!checkIsValidUUID(id)) {
        throw Errors.InvalidId;
    }

    const user = db.find((u) => u.id === id);
    if (!user) throw Errors.NoUser;

    return user;
}

async function create(newUserBody: UserBody) {
    if (!isValidUserBody(newUserBody)) {
        throw Errors.InvalidUserBody;
    }

    const newUser: UserData = { ...newUserBody, id: uuidv4() };

    db.push(newUser);
    return newUser;
}

async function update(id: string, newUserBody: UserBody) {
    if (!checkIsValidUUID(id)) throw Errors.InvalidId;

    const userIndex = db.findIndex((u) => u.id === id);
    if (userIndex === -1) throw Errors.NoUser;

    db[userIndex] = { ...newUserBody, id };

    return db[userIndex];
}

async function remove(id: string) {
    if (!checkIsValidUUID(id)) throw Errors.InvalidId;

    const user = db.find((u) => u.id === id);
    if (!user) throw Errors.NoUser;

    db = db.filter((u) => u.id !== id);

    return db;
}

export default {
    findAll: wrapInternalError(findAll),
    findOne: wrapInternalError(findOne),
    create: wrapInternalError(create),
    update: wrapInternalError(update),
    remove: wrapInternalError(remove),
};
