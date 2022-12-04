import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

export interface ApolloContext {
  em: EntityManager<IDatabaseDriver<Connection>>;
}
