/* eslint-disable class-methods-use-this */
import { IncomingMessage, ServerResponse } from 'http';
import ServerErrors from '../../errors';
import { handleError } from '../../errors/helpers';
import { UserBody } from '../../types';
import UserService from '../service';
import { extractRequestBody } from './helpers';

export default class UserController {
    constructor(private service: UserService) {}

    // @route  GET /api/users
    async getUsers(
        request: IncomingMessage,
        response: ServerResponse<IncomingMessage>,
    ) {
        try {
            const users = await this.service.findAll();

            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(users));
        } catch (error) {
            handleError(error, response);
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

            const user = await this.service.findOne(userId);

            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(user));
        } catch (error) {
            handleError(error, response);
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
            const newProduct = await this.service.create(newUserBody);

            response.writeHead(201, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(newProduct));
        } catch (error) {
            handleError(error, response);
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

            const user = await this.service.findOne(userId);

            const body = await extractRequestBody(request);
            if (typeof body !== 'string') throw ServerErrors.Internal;
            const { age, username, hobbies } = JSON.parse(body);

            const newUserBody: UserBody = {
                age: age ?? user.age,
                username: username ?? user.username,
                hobbies: hobbies ?? user.hobbies,
            };

            const updatedUser = await this.service.update(userId, newUserBody);

            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(updatedUser));
        } catch (error) {
            handleError(error, response);
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

            await this.service.delete(userId);

            response.writeHead(204, { 'Content-Type': 'application/json' });
            response.end();
        } catch (error) {
            handleError(error, response);
        }
    }
}
