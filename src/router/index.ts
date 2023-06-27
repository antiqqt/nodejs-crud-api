import { IncomingMessage, ServerResponse } from 'http';

import {
    createUser,
    deleteUser,
    getUser,
    getUsers,
    updateUser,
} from '../controllers/user';
import ServerErrors from '../errors';
import { handleError } from '../errors/helpers';

interface RouteDto {
    url: string;
    method: string;
}

enum HTTPMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

const Routes = {
    findAll: {
        url: /^\/api\/users$/,
        method: HTTPMethods.GET,
        controller: getUsers,
    },
    findOne: {
        url: /^\/api\/users\/[\d | \w | -]+$/,
        method: HTTPMethods.GET,
        controller: getUser,
    },
    create: {
        url: /^\/api\/users$/,
        method: HTTPMethods.POST,
        controller: createUser,
    },
    update: {
        url: /^\/api\/users\/[\d | \w | -]+$/,
        method: HTTPMethods.PUT,
        controller: updateUser,
    },
    delete: {
        url: /^\/api\/users\/[\d | \w | -]+$/,
        method: HTTPMethods.DELETE,
        controller: deleteUser,
    },
} as const;

class Router {
    constructor(private routes: typeof Routes) {}

    private selectController(routeDto: RouteDto) {
        const currentRoute = Object.values(this.routes).find(
            (appRoute) =>
                appRoute.url.test(routeDto.url) &&
                appRoute.method === routeDto.method,
        );

        if (!currentRoute) return null;
        return currentRoute.controller;
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

            const controller = this.selectController(requestRoute);

            if (!controller) throw ServerErrors.NotFound;

            controller(request, response);
        } catch (error) {
            handleError(error, response);
        }
    }
}

const router = new Router(Routes);
export default router;
