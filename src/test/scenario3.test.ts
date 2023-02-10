import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import server from '..';
import { Errors } from '../errors';
import { API_ROUTE, POST_DATA, PUT_DATA } from './testConstants';

describe('\nScenario 3: test bad requests', () => {
    const invalidId = `${uuidv4()}2`;

    it('GET with invalid id', async () => {
        const { status, message } = Errors.InvalidId;

        await request(server)
            .get(`${API_ROUTE}/${invalidId}`)
            .expect(status)
            .expect(({ body }) => {
                expect(body).toEqual({ message });
            });
    });

    it('POST new user but providing id', async () => {
        const { status, message } = Errors.NotFound;

        await request(server)
            .post(`${API_ROUTE}/${invalidId}`)
            .set('Content-type', 'application/json')
            .send(POST_DATA)
            .expect(status)
            .expect(({ body }) => {
                expect(body).toEqual({ message });
            });
    });

    it('PUT user with invalid id', async () => {
        const { status, message } = Errors.InvalidId;

        await request(server)
            .put(`${API_ROUTE}/${invalidId}`)
            .set('Content-type', 'application/json')
            .send(PUT_DATA)
            .expect(status)
            .expect(({ body }) => {
                expect(body).toEqual({ message });
            });
    });

    it('DELETE user with invalid id', async () => {
        const { status, message } = Errors.InvalidId;

        await request(server)
            .delete(`${API_ROUTE}/${invalidId}`)
            .expect(status)
            .expect(({ body }) => {
                expect(body).toEqual({ message });
            });
    });
});
