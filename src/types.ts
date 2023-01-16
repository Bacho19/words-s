import { Request, Response } from "express";
import { Redis } from "ioredis";

export interface ApolloContext {
  req: Request;
  res: Response;
  redisClient: Redis;
}
