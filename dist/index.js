"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const word_1 = require("./resolvers/word");
const user_1 = require("./resolvers/user");
const AppDataSource_1 = require("./AppDataSource");
const main = async () => {
    AppDataSource_1.AppDataSource.initialize().then(() => {
        console.log("db connected");
    });
    const app = (0, express_1.default)();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [word_1.WordResolver, user_1.UserResolver],
            validate: false,
        }),
        context: () => ({}),
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
    app.listen(4000, () => {
        console.log("server started");
    });
};
main();
//# sourceMappingURL=index.js.map