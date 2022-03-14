import APIServer from "./APIServer";
import { Request, Response, Router } from "express";

const server = new APIServer();

class APIRoutes {

    //@logRoute()
    @route("get", "/")
    public indexRoute(req: Request, res: Response) {
        let x;
        const sql = "SELECT * FROM products";
        // const rows = await server.client.query(sql).then((rows) => {x = rows});
        // console.log(rows.rows);
        console.log(x);
        return {1: 1};
    }

    @logRoute()
    @route("get", "/people")
    @authenticate("123456")
    public peopleRoute(req: Request, res: Response) {
        return {
            people: [
                {
                    "firstName": "David",
                    "lastName": "Tucker"
                },
                {
                    "firstName": "Sammy",
                    "lastName": "Davis"
                }
            ]
        };
    }
}

function route(method: string, path: string): MethodDecorator {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        server.app[method](path, (req: Request, res: Response) => {
            res.status(200).send(descriptor.value(req, res));
        });
    }
}

function logRoute(): MethodDecorator {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        descriptor.value = function(...args: any[]) {
            let req = args[0] as Request;
            console.log(`${req.url} ${req.method} Called`);
            return original.apply(this, args);
        }
    };
}

function authenticate(key: string): MethodDecorator {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        descriptor.value = function(...args: any[]) {
            const req = args[0] as Request;
            const res = args[1] as Response;
            const headers = req.headers;
            if (headers.hasOwnProperty("apikey") && headers.apikey == key) {
                return original.apply(this, args);
            }
            res.status(403).json({error: "Not Authorized"});
        }
    }
}

server.start();