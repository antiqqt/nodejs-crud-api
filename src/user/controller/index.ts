/* eslint-disable class-methods-use-this */
import { IncomingMessage, ServerResponse } from 'http';
import ServerErrors from '../../errors';
import UserMiddleware from '../middleware';
import { extractRequestBody, handleServerError } from './helpers';
import { UserDto } from '../types';

export default class UserController {
    constructor(private middleware: UserMiddleware) {}

    // @route  GET /api/users
    async getUsers(
        request: IncomingMessage,
        response: ServerResponse<IncomingMessage>,
    ) {
        try {
            const users = await this.middleware.findAll();

            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(users));
        } catch (error) {
            handleServerError(error, response);
        }
    }

    // @route   GET /api/users/:id
    async getUser(
        request: IncomingMessage,
        response: ServerResponse<IncomingMessage>,
    ) {
        try {
            const userId = request.url?.split('/')[3];
            if (!userId) throw ServerErrors.InvalidId;

            const user = await this.middleware.findOne(userId);

            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(user));
        } catch (error) {
            handleServerError(error, response);
        }
    }

    // @route   POST /api/users
    async createUser(
        request: IncomingMessage,
        response: ServerResponse<IncomingMessage>,
    ) {
        try {
            const body = await extractRequestBody(request);
            if (typeof body !== 'string') throw ServerErrors.Internal;

            const newUserBody = JSON.parse(body);
            const newProduct = await this.middleware.create(newUserBody);

            response.writeHead(201, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(newProduct));
        } catch (error) {
            handleServerError(error, response);
        }
    }

    // @route   PUT /api/users/:id
    async updateUser(
        request: IncomingMessage,
        response: ServerResponse<IncomingMessage>,
    ) {
        try {
            const userId = request.url?.split('/')[3];
            if (!userId) throw ServerErrors.InvalidId;

            const user = await this.middleware.findOne(userId);

            const body = await extractRequestBody(request);
            if (typeof body !== 'string') throw ServerErrors.Internal;
            const { age, username, hobbies } = JSON.parse(body);

            const newUserBody: UserDto = {
                age: age ?? user.age,
                username: username ?? user.username,
                hobbies: hobbies ?? user.hobbies,
            };

            const updatedUser = await this.middleware.update(
                userId,
                newUserBody,
            );

            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(updatedUser));
        } catch (error) {
            handleServerError(error, response);
        }
    }

    // @route   DELETE /api/users/:id
    async deleteUser(
        request: IncomingMessage,
        response: ServerResponse<IncomingMessage>,
    ) {
        try {
            const userId = request.url?.split('/')[3];
            if (!userId) throw ServerErrors.InvalidId;

            await this.middleware.delete(userId);

            response.writeHead(204, { 'Content-Type': 'application/json' });
            response.end();
        } catch (error) {
            handleServerError(error, response);
        }
    }
}
