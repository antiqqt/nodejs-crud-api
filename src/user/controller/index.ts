/* eslint-disable class-methods-use-this */
import { IncomingMessage, ServerResponse } from 'http';
import ServerErrors from '../../errors';
import { handleError } from '../../errors/helpers';
import { UserBody } from '../../types';
import UserService from '../service';
import { extractRequestBody } from './helpers';

export default class UserController {
    constructor(private service: UserService) {}

    // @route   GET /api/users
    async getUsers(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
        try {
            const users = await this.service.findAll();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users));
        } catch (error) {
            handleError(error, res);
        }
    }

    // @route   GET /api/users/:id
    async getUser(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
        try {
            const userId = req.url?.split('/')[3];
            if (!userId) throw ServerErrors.InvalidId;

            const user = await this.service.findOne(userId);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
        } catch (error) {
            handleError(error, res);
        }
    }

    // @route   POST /api/users
    async createUser(
        req: IncomingMessage,
        res: ServerResponse<IncomingMessage>,
    ) {
        try {
            const body = await extractRequestBody(req);
            if (typeof body !== 'string') throw ServerErrors.Internal;

            const newUserBody = JSON.parse(body);
            const newProduct = await this.service.create(newUserBody);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newProduct));
        } catch (error) {
            handleError(error, res);
        }
    }

    // @route   PUT /api/users/:id
    async updateUser(
        req: IncomingMessage,
        res: ServerResponse<IncomingMessage>,
    ) {
        try {
            const userId = req.url?.split('/')[3];
            if (!userId) throw ServerErrors.InvalidId;

            const user = await this.service.findOne(userId);

            const body = await extractRequestBody(req);
            if (typeof body !== 'string') throw ServerErrors.Internal;
            const { age, username, hobbies } = JSON.parse(body);

            const newUserBody: UserBody = {
                age: age ?? user.age,
                username: username ?? user.username,
                hobbies: hobbies ?? user.hobbies,
            };

            const updatedUser = await this.service.update(userId, newUserBody);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updatedUser));
        } catch (error) {
            handleError(error, res);
        }
    }

    // @route   DELETE /api/users/:id
    async deleteUser(
        req: IncomingMessage,
        res: ServerResponse<IncomingMessage>,
    ) {
        try {
            const userId = req.url?.split('/')[3];
            if (!userId) throw ServerErrors.InvalidId;

            await this.service.delete(userId);

            res.writeHead(204, { 'Content-Type': 'application/json' });
            res.end();
        } catch (error) {
            handleError(error, res);
        }
    }
}
