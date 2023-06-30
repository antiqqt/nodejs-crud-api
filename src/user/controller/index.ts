/* eslint-disable class-methods-use-this */
import { IncomingMessage, ServerResponse } from 'http';
import ServerErrors, { isServerError } from '../../errors';
import UserMiddleware from '../middleware';
import { extractBodyJSON, handleServerError } from './helpers';

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
            const newUserDto = await extractBodyJSON(request);
            if (isServerError(newUserDto)) throw newUserDto;

            const newProduct = await this.middleware.create(newUserDto);

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

            const newUserDto = await extractBodyJSON(request);
            if (isServerError(newUserDto)) throw newUserDto;

            const updatedUser = await this.middleware.update(
                userId,
                newUserDto,
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
