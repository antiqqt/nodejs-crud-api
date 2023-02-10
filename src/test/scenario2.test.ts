import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import server from '..';
import { Errors } from '../errors';
import { API_ROUTE, POST_INVALID_DATA, PUT_DATA } from './testConstants';

describe('\nScenario 2: test invalid CRUD operations', () => {
    it('GET user but with invalid id', async () => {
        const { status, message } = Errors.NoUser;
        const randomId = uuidv4();

        await request(server)
            .get(`${API_ROUTE}/${randomId}`)
            .expect(status)
            .expect(({ body }) => {
                expect(body).toEqual({ message });
            });
    });

    it('POST user with invalid body', async () => {
        const { status, message } = Errors.InvalidUserBody;

        await request(server)
            .post(API_ROUTE)
            .set('Content-type', 'application/json')
            .send(POST_INVALID_DATA)
            .expect(status)
            .expect(({ body }) => {
                expect(body).toEqual({
                    message,
                });
            });
    });

    it('PUT user without id', async () => {
        const { status, message } = Errors.NotFound;

        await request(server)
            .put(API_ROUTE)
            .set('Content-type', 'application/json')
            .send(PUT_DATA)
            .expect(status)
            .expect(({ body }) => {
                expect(body).toEqual({ message });
            });
    });

    it('DELETE user without providing id', async () => {
        const { status, message } = Errors.NotFound;

        await request(server)
            .delete(API_ROUTE)
            .expect(status)
            .expect(({ body }) => {
                expect(body).toEqual({ message });
            });
    });
});
