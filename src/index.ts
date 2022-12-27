import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { WordResolver } from "./resolvers/word";
import { UserResolver } from "./resolvers/user";
import { AppDataSource } from "./AppDataSource";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { ApolloContext } from "./types";
import cors from "cors";
import { sendEmail } from "./utils/sendEmail";

declare module "express-session" {
  export interface SessionData {
    userId: number;
  }
}

const main = async () => {
  AppDataSource.initialize().then(() => {
    console.log("db connected");
  });

  sendEmail("bacho@bahcho.com", "<b>hello bro</b>");

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = new Redis();

  app.use(
    cors({
      origin: ["http://localhost:3000", "https://studio.apollographql.com"],
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__, // cookie only works in https on dev
      },
      saveUninitialized: false,
      secret: "sometestsecretkey",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [WordResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): ApolloContext => ({ req, res }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: ["http://localhost:3000", "https://studio.apollographql.com"],
      credentials: true,
    },
  });

  app.listen(4000, () => {
    console.log("server started");
  });
};

main();
