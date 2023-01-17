"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const User_1 = require("../entities/User");
const constants_1 = require("../constants");
const sendEmail_1 = require("../utils/sendEmail");
const register_1 = require("../validation/register");
let UsernameAuthInput = class UsernameAuthInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], UsernameAuthInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], UsernameAuthInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], UsernameAuthInput.prototype, "password", void 0);
UsernameAuthInput = __decorate([
    (0, type_graphql_1.InputType)()
], UsernameAuthInput);
let Error = class Error {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Error.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Error.prototype, "message", void 0);
Error = __decorate([
    (0, type_graphql_1.ObjectType)()
], Error);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Error], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let UserResolver = class UserResolver {
    async register({ email, username, password }) {
        const candidateEmail = await User_1.User.findOneBy({ email });
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
        const candidateUsername = await User_1.User.findOneBy({ username });
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
        const errors = (0, register_1.validateRegister)(email, username, password);
        if (errors) {
            return { errors };
        }
        const hashedPass = await bcrypt_1.default.hash(password, 5);
        const user = await User_1.User.create({
            email,
            username,
            password: hashedPass,
        }).save();
        return { user };
    }
    async login({ req }, emailOrUsername, password) {
        const user = await User_1.User.createQueryBuilder("user")
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
        const isValidPass = await bcrypt_1.default.compare(password, user.password);
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
    async me({ req }) {
        if (!req.session.userId) {
            return null;
        }
        const user = await User_1.User.findOneBy({ id: req.session.userId });
        return user;
    }
    logout({ req, res }) {
        return new Promise((resolve) => {
            req.session.destroy((err) => {
                res.clearCookie(constants_1.COOKIE_NAME);
                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    }
    async forgotPassword({ redisClient }, email) {
        const user = await User_1.User.findOneBy({ email });
        if (!user) {
            return true;
        }
        const token = (0, uuid_1.v4)();
        await redisClient.set(constants_1.CHANGE_PASS_PREFIX + token, user.id, "EX", 1000 * 60 * 60 * 24);
        await (0, sendEmail_1.sendEmail)(email, `http://localhost:3000/change-password/${token}`);
        return true;
    }
    async changePassword({ redisClient }, token, newPassword) {
        const key = constants_1.CHANGE_PASS_PREFIX + token;
        const userId = await redisClient.get(key);
        if (!userId) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "token expired",
                    },
                ],
            };
        }
        const user = await User_1.User.findOneBy({
            id: parseInt(userId),
        });
        if (!user) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "user no longer exists",
                    },
                ],
            };
        }
        if (newPassword.length < 3) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "length must be greater than 2",
                    },
                ],
            };
        }
        user.password = await bcrypt_1.default.hash(newPassword, 5);
        await user.save();
        await redisClient.del(key);
        return {
            user,
        };
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernameAuthInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("emailOrUsername")),
    __param(2, (0, type_graphql_1.Arg)("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("token")),
    __param(2, (0, type_graphql_1.Arg)("newPassword")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map