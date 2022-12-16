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
let UsernameAuthInput = class UsernameAuthInput {
};
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
    async register({ username, password }) {
        const candidateUser = await User_1.User.findOneBy({ username });
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
        const hashedPass = await bcrypt_1.default.hash(password, 5);
        const user = await User_1.User.create({
            username,
            password: hashedPass,
        }).save();
        return { user };
    }
    async login({ req }, { username, password }) {
        const user = await User_1.User.findOneBy({ username });
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
        const isValidPass = await bcrypt_1.default.compare(password, user.password);
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
    async me({ req }) {
        if (!req.session.userId) {
            return null;
        }
        const user = await User_1.User.findOneBy({ id: req.session.userId });
        return user;
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
    __param(1, (0, type_graphql_1.Arg)("options")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UsernameAuthInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map