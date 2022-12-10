import { ApolloContext } from "src/types";
import { Arg, Ctx, Mutation, Resolver, InputType, Field } from "type-graphql";
import bcrypt from "bcrypt";
import { User } from "../entities/User";

@InputType()
class UsernameAuthInput {
  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;
}

@Resolver()
export class UserResolver {
  // @Mutation(() => User)
  // async register(
  //   @Ctx() { em }: ApolloContext,
  //   @Arg("options") { username, password }: UsernameAuthInput
  // ): Promise<User> {
  //   const hashedPass = await bcrypt.hash(password, 5);
  //   const user = em.create(User, {
  //     username,
  //     password: hashedPass,
  //   });
  //   await em.persistAndFlush(user);
  //   return user;
  // }
}
