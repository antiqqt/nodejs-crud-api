import { IncomingMessage, ServerResponse } from 'http';
import {
    createUser,
    deleteUser,
    getUser,
    getUsers,
    updateUser,
} from '../controllers/user';

interface RequestRoute {
    url: string;
    method: string;
}

type AppRouteNames = 'findAll' | 'findOne' | 'create' | 'update' | 'delete';

interface AppRoute {
    url: RegExp;
    method: string;
    controller?: (
        req: IncomingMessage,
        res: ServerResponse<IncomingMessage>,
    ) => void;
}

const Routes: Record<AppRouteNames, AppRoute> = {
    findAll: {
        url: /^\/api\/users$/,
        method: 'GET',
        controller: getUsers,
    },
    findOne: {
        url: /\/api\/users\/[\d | \w | -]+/,
        method: 'GET',
        controller: getUser,
    },
    create: {
        url: /^\/api\/users$/,
        method: 'POST',
        controller: createUser,
    },
    update: {
        url: /\/api\/users\/[\d | \w | -]+/,
        method: 'PUT',
        controller: updateUser,
    },
    delete: {
        url: /\/api\/users\/[\d | \w | -]+/,
        method: 'DELETE',
        controller: deleteUser,
    },
};

class Router {
    constructor(private routes: typeof Routes) {}

    private selectController(requestRoute: RequestRoute) {
        const currentRoute = Object.values(this.routes).find(
            (appRoute) =>
                appRoute.url.test(requestRoute.url) &&
                appRoute.method === requestRoute.method,
        );

        if (!currentRoute) return null;
        return currentRoute.controller;
    }

    public handleRequest(
        req: IncomingMessage,
        res: ServerResponse<IncomingMessage>,
    ) {
        const requestRoute = {
            url: req.url ?? '',
            method: req.method ?? '',
        };

        const controller = this.selectController(requestRoute);

        if (!controller) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(
                JSON.stringify({
                    message: 'Route Not Found: Please use the correct endpoint',
                }),
            );
            return;
        }

        controller(req, res);
    }
}

const router = new Router(Routes);
export default router;
