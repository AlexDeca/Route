"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const ts_postgres_1 = require("ts-postgres");
class APIServer {
    constructor() {
        this._app = (0, express_1.default)();
        this._client = new ts_postgres_1.Client({ "database": "projet", "user": "postgres", "password": "root" });
        this._client.connect();
        // Set port
        this._app.set("port", process.env.PORT || 3000);
        // Add Middleware
        this.configureMiddleware();
    }
    get app() {
        return this._app;
    }
    get server() {
        return this._server;
    }
    get client() {
        return this._client;
    }
    configureMiddleware() {
        // Setup body parsing - required for POST requests
        this._app.use(body_parser_1.default.json());
        this._app.use(body_parser_1.default.urlencoded({ extended: true }));
        // Setup CORS
        this.app.use(function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Credentials,Access-Control-Allow-Methods,Access-Control-Allow-Headers");
            next();
        });
    }
    start() {
        // Start the server instance
        this._server = this._app.listen(this._app.get("port"), () => {
            console.log("Server is running on port " + this._app.get("port"));
        });
    }
}
exports.default = APIServer;
//# sourceMappingURL=APIServer.js.map