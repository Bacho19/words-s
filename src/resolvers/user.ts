import {
  Arg,
  Mutation,
  Resolver,
  InputType,
  Field,
  ObjectType,
  Ctx,
  Query,
} from "type-graphql";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { User } from "../entities/User";
import { ApolloContext } from "../types";
import { CHANGE_PASS_TOKEN, COOKIE_NAME } from "../constants";
import { sendEmail } from "../utils/sendEmail";
import { validateRegister } from "../validation/register";

@InputType()
class UsernameAuthInput {
  @Field(() => String)
  email: string;

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
    @Arg("options") { email, username, password }: UsernameAuthInput
  ): Promise<UserResponse> {
    const candidateEmail = await User.findOneBy({ email });

    if (candidateEmail) {
      return {
        errors: [
          {
            field: "username",
            message: "user with this email already exists",
          },
        ],
      };
    }

    const candidateUsername = await User.findOneBy({ username });

    if (candidateUsername) {
      return {
        errors: [
          {
            field: "username",
            message: "user with this username already exists",
          },
        ],
      };
    }

    const errors = validateRegister(email, username, password);

    if (errors) {
      return { errors };
    }

    const hashedPass = await bcrypt.hash(password, 5);

    const user = await User.create({
      email,
      username,
      password: hashedPass,
    }).save();

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Ctx() { req }: ApolloContext,
    @Arg("emailOrUsername") emailOrUsername: string,
    @Arg("password") password: string
  ): Promise<UserResponse> {
    const user = await User.createQueryBuilder("user")
      .where("user.email = :email or user.username = :username", {
        email: emailOrUsername,
        username: emailOrUsername,
      })
      .getOne();

    if (!user) {
      return {
        errors: [
          {
            field: "emailOrUsername",
            message: emailOrUsername.includes("@")
              ? "invalid email or password"
              : "invalid username or password",
          },
        ],
      };
    }

    const isValidPass = await bcrypt.compare(password, user.password);

    if (!isValidPass) {
      return {
        errors: [
          {
            field: "emailOrUsername",
            message: emailOrUsername.includes("@")
              ? "invalid email or password"
              : "invalid username or password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return { user };
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: ApolloContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }
    const user = await User.findOneBy({ id: req.session.userId });

    return user;
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: ApolloContext): Promise<boolean> {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      });
    });
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Ctx() { redisClient }: ApolloContext,
    @Arg("email") email: string
  ): Promise<boolean> {
    const user = await User.findOneBy({ email });

    if (!user) {
      return true;
    }

    const token = v4();

    sendEmail(email, `http://localhost:3000/change-password/${token}`);

    redisClient.set(CHANGE_PASS_TOKEN, token);

    return true;
  }

  @Mutation(() => Boolean)
  changePassword() {}
}
