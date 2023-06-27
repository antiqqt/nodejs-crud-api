import request from 'supertest';
import server from '..';
import { API_ROUTE, POST_DATA, PUT_DATA, SuccessStatus } from './testConstants';
import ServerErrors from '../errors';

describe('\nScenario 1: test all CRUD operations', () => {
    let id: string;

    it('GET all users', async () => {
        await request(server)
            .get(API_ROUTE)
            .expect(SuccessStatus.GET)
            .expect(({ body }) => {
                expect(body).toHaveLength(0);
            });
    });

    it('POST create user', async () => {
        await request(server)
            .post(API_ROUTE)
            .set('Content-type', 'application/json')
            .send(POST_DATA)
            .expect(SuccessStatus.POST)
            .expect(({ body }) => {
                id = body.id;
                const expectedBody = { ...POST_DATA, id };
                expect(expectedBody).toEqual(expectedBody);
            });
    });

    it('GET previously created user', async () => {
        await request(server)
            .get(`${API_ROUTE}/${id}`)
            .expect(SuccessStatus.GET)
            .expect(({ body }) => {
                const expectedBody = { ...POST_DATA, id };
                expect(body).toEqual(expectedBody);
            });
    });

    it('PUT update previously created user', async () => {
        await request(server)
            .put(`${API_ROUTE}/${id}`)
            .set('Content-type', 'application/json')
            .send(PUT_DATA)
            .expect(SuccessStatus.PUT)
            .expect(({ body }) => {
                id = body.id;
                const expectedResult = { ...PUT_DATA, id };
                expect(body).toEqual(expectedResult);
            });
    });

    it('DELETE remove previously created user', async () => {
        await request(server)
            .delete(`${API_ROUTE}/${id}`)
            .expect(SuccessStatus.DELETE);
    });

    it('GET a deleted object by id', async () => {
        const { statusCode, message } = ServerErrors.NoUser;

        await request(server)
            .get(`${API_ROUTE}/${id}`)
            .expect(statusCode)
            .expect(({ body }) => {
                expect(body).toEqual({ message });
            });
    });
});
