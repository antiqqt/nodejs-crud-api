import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { createServer } from 'http';
import ServerErrors from '../errors';
import { API_ROUTE, POST_DATA, PUT_DATA } from './testConstants';
import { createUserRouter } from '../user/router';

import db from '../data/db';

describe('\nScenario 3: test bad requests', () => {
    const server = createServer((req, res) => {
        createUserRouter(db).handleRequest(req, res);
    });

    const invalidId = `${uuidv4()}2`;

    it('GET with invalid id', async () => {
        const { statusCode, message } = ServerErrors.InvalidId;

        await request(server)
            .get(`${API_ROUTE}/${invalidId}`)
            .expect(statusCode)
            .expect(({ body }) => {
                expect(body).toEqual({ message });
            });
    });

    it('POST new user but providing id', async () => {
        const { statusCode, message } = ServerErrors.NotFound;

        await request(server)
            .post(`${API_ROUTE}/${invalidId}`)
            .set('Content-type', 'application/json')
            .send(POST_DATA)
            .expect(statusCode)
            .expect(({ body }) => {
                expect(body).toEqual({ message });
            });
    });

    it('PUT user with invalid id', async () => {
        const { statusCode, message } = ServerErrors.InvalidId;

        await request(server)
            .put(`${API_ROUTE}/${invalidId}`)
            .set('Content-type', 'application/json')
            .send(PUT_DATA)
            .expect(statusCode)
            .expect(({ body }) => {
                expect(body).toEqual({ message });
            });
    });

    it('DELETE user with invalid id', async () => {
        const { statusCode, message } = ServerErrors.InvalidId;

        await request(server)
            .delete(`${API_ROUTE}/${invalidId}`)
            .expect(statusCode)
            .expect(({ body }) => {
                expect(body).toEqual({ message });
            });
    });
});
