import { IncomingMessage, ServerResponse } from 'http';
import { Errors } from '../../errors';
import User from '../../models/user';
import { isHttpError } from '../../models/user/helpers';
import { UserBody } from '../../types';
import extractPostData from './helpers';

function handleError(error: unknown, res: ServerResponse<IncomingMessage>) {
    res.writeHead(isHttpError(error) ? error.status : 500, {
        'Content-Type': 'application/json',
    });
    res.end(
        JSON.stringify({
            message: isHttpError(error)
                ? error.message
                : Errors.Internal.message,
        }),
    );

    // eslint-disable-next-line no-console
    console.error(error);
}

// @route   GET /api/users
async function getUsers(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
) {
    try {
        const users = await User.findAll();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    } catch (error) {
        handleError(error, res);
    }
}

// @route   GET /api/users/:id
async function getUser(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
) {
    try {
        const userId = req.url?.split('/')[3];
        if (!userId) throw Errors.InvalidId;

        const user = await User.findOne(userId);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
    } catch (error) {
        handleError(error, res);
    }
}

// @route   POST /api/users
async function createUser(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
) {
    try {
        const body = await extractPostData(req);
        if (typeof body !== 'string') throw Errors.Internal;

        const newUserBody = JSON.parse(body);
        const newProduct = await User.create(newUserBody);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newProduct));
    } catch (error) {
        handleError(error, res);
    }
}

// @route   PUT /api/users/:id
async function updateUser(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
) {
    try {
        const userId = req.url?.split('/')[3];
        if (!userId) throw Errors.InvalidId;

        const user = await User.findOne(userId);

        const body = await extractPostData(req);
        if (typeof body !== 'string') throw Errors.Internal;
        const { age, username, hobbies } = JSON.parse(body);

        const newUserBody: UserBody = {
            age: age ?? user.age,
            username: username ?? user.username,
            hobbies: hobbies ?? user.hobbies,
        };

        const updatedUser = await User.update(userId, newUserBody);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedUser));
    } catch (error) {
        handleError(error, res);
    }
}

// @route   DELETE /api/users/:id
async function deleteUser(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
) {
    try {
        const userId = req.url?.split('/')[3];
        if (!userId) throw Errors.InvalidId;

        await User.remove(userId);

        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end();
    } catch (error) {
        handleError(error, res);
    }
}

export { getUser, getUsers, createUser, updateUser, deleteUser };
