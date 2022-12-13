import {
  Arg,
  Mutation,
  Resolver,
  InputType,
  Field,
  ObjectType,
  Ctx,
} from "type-graphql";
import bcrypt from "bcrypt";
import { User } from "../entities/User";
import { ApolloContext } from "src/types";

@InputType()
class UsernameAuthInput {
  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;
}

@ObjectType()
class Error {
  @Field(() => String)
  field: string;

  @Field(() => String)
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [Error], { nullable: true })
  errors?: Error[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") { username, password }: UsernameAuthInput
  ): Promise<UserResponse> {
    const candidateUser = await User.findOneBy({ username });

    if (candidateUser) {
      return {
        errors: [
          {
            field: "username",
            message: "user with this username already exists",
          },
        ],
      };
    }

    if (username.length < 3) {
      return {
        errors: [
          {
            field: "username",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    if (password.length < 3) {
      return {
        errors: [
          {
            field: "password",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    const hashedPass = await bcrypt.hash(password, 5);

    const user = await User.create({
      username,
      password: hashedPass,
    }).save();

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Ctx() { req }: ApolloContext,
    @Arg("options") { username, password }: UsernameAuthInput
  ): Promise<UserResponse> {
    const user = await User.findOneBy({ username });

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "invalid username or password",
          },
        ],
      };
    }

    const isValidPass = await bcrypt.compare(password, user.password);

    if (!isValidPass) {
      return {
        errors: [
          {
            field: "username",
            message: "invalid username or password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return { user };
  }
}
