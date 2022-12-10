import "reflect-metadata";
import { __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { WordResolver } from "./resolvers/word";
import { UserResolver } from "./resolvers/user";
import { AppDataSource } from "./AppDataSource";

const main = async () => {
  AppDataSource.initialize().then(() => {
    console.log("db connected");
  });

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [WordResolver, UserResolver],
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
