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
                        field: "username",
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
                        field: "username",
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
    async forgotPassword(email) {
        const user = await User_1.User.findOneBy({ email });
        (0, sendEmail_1.sendEmail)(email, "");
        return true;
    }
    changePassword() { }
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
    __param(0, (0, type_graphql_1.Arg)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "changePassword", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map