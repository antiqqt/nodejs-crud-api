import { IncomingMessage, ServerResponse } from 'http';

interface RequestRoute {
    url: string;
    method: string;
}

type AppRouteNames = 'findAll' | 'findOne' | 'create' | 'update' | 'delete';

interface AppRoute {
    url: RegExp;
    method: string;
    controller: (
        req: IncomingMessage,
        res: ServerResponse<IncomingMessage>,
    ) => void;
}

const Routes: Record<AppRouteNames, AppRoute> = {
    findAll: {
        url: /\/api\/users/,
        method: 'GET',
    },
    findOne: {
        url: /\/api\/users\/\w+/,
        method: 'GET',
    },
    create: {
        url: /\/api\/users\/\w+/,
        method: 'POST',
    },
    update: {
        url: /\/api\/users\/\w+/,
        method: 'PUT',
    },
    delete: {
        url: /\/api\/users\/\w+/,
        method: 'DELETE',
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
