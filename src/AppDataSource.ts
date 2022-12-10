import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Word } from "./entities/Word";

export const AppDataSource = new DataSource({
  type: "postgres",
  username: "postgres",
  password: "postgres",
  entities: [User, Word],
  database: "words2",
  synchronize: true,
  logging: true,
});
