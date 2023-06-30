import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { createServer } from 'http';
import ServerErrors from '../errors';
import { API_ROUTE, POST_INVALID_DATA, PUT_DATA } from './testConstants';
import { createUserRouter } from '../user/router';
import db from '../data/db';

describe('\nScenario 2: test invalid CRUD operations', () => {
    const server = createServer((req, res) => {
        createUserRouter(db).handleRequest(req, res);
    });

    it('GET user but with invalid id', async () => {
        const { statusCode, message } = ServerErrors.NoUser;
        const randomId = uuidv4();

        await request(server)
            .get(`${API_ROUTE}/${randomId}`)
            .expect(statusCode)
            .expect(({ body }) => {
                expect(body).toEqual({ message });
            });
    });

    it('POST user with invalid body', async () => {
        const { statusCode, message } = ServerErrors.InvalidUserBody;

        await request(server)
            .post(API_ROUTE)
            .set('Content-type', 'application/json')
            .send(POST_INVALID_DATA)
            .expect(statusCode)
            .expect(({ body }) => {
                expect(body).toEqual({
                    message,
                });
            });
    });

    it('PUT user without id', async () => {
        const { statusCode, message } = ServerErrors.NotFound;

        await request(server)
            .put(API_ROUTE)
            .set('Content-type', 'application/json')
            .send(PUT_DATA)
            .expect(statusCode)
            .expect(({ body }) => {
                expect(body).toEqual({ message });
            });
    });

    it('DELETE user without providing id', async () => {
        const { statusCode, message } = ServerErrors.NotFound;

        await request(server)
            .delete(API_ROUTE)
            .expect(statusCode)
            .expect(({ body }) => {
                expect(body).toEqual({ message });
            });
    });
});
