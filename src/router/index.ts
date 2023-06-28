import { IncomingMessage, ServerResponse } from 'http';

import db from '../data/db';
import ServerErrors from '../errors';
import { handleError } from '../errors/helpers';
import UserController from '../user/controller';
import UserModel from '../user/model';
import UserService from '../user/service';

interface RequestRoute {
    url: string;
    method: string;
}

enum HTTPMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

interface AppRoute {
    name: keyof UserController;
    url: RegExp;
    method: HTTPMethods;
}

const routes: AppRoute[] = [
    {
        name: 'getUsers',
        url: /^\/api\/users$/,
        method: HTTPMethods.GET,
    },
    {
        name: 'getUser',
        url: /^\/api\/users\/[\d | \w | -]+$/,
        method: HTTPMethods.GET,
    },
    {
        name: 'createUser',
        url: /^\/api\/users$/,
        method: HTTPMethods.POST,
    },
    {
        name: 'updateUser',
        url: /^\/api\/users\/[\d | \w | -]+$/,
        method: HTTPMethods.PUT,
    },
    {
        name: 'deleteUser',
        url: /^\/api\/users\/[\d | \w | -]+$/,
        method: HTTPMethods.DELETE,
    },
];

class Router {
    constructor(
        private appRoutes: typeof routes,
        private controller: UserController,
    ) {}

    private selectRoute(requestRoute: RequestRoute) {
        const currentRoute = this.appRoutes.find(
            (appRoute) =>
                appRoute.url.test(requestRoute.url) &&
                appRoute.method === requestRoute.method,
        );

        if (!currentRoute) return null;

        return currentRoute;
    }

    public async handleRequest(
        request: IncomingMessage,
        response: ServerResponse<IncomingMessage>,
    ) {
        try {
            const requestRoute = {
                url: request.url ?? '',
                method: request.method ?? '',
            };

            const route = this.selectRoute(requestRoute);

            if (!route) throw ServerErrors.NotFound;

            await this.controller[route.name](request, response);
        } catch (error) {
            handleError(error, response);
        }
    }
}

const controller = new UserController(new UserService(new UserModel(db)));
const router = new Router(routes, controller);
export default router;
