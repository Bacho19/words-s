"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const constants_1 = require("./constants");
const User_1 = require("./entities/User");
const Word_1 = require("./entities/Word");
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, "./migrations"),
        glob: "!(*.d).{js,ts}",
    },
    dbName: "words",
    user: "postgres",
    password: "postgres",
    type: "postgresql",
    debug: !constants_1.__prod__,
    entities: [Word_1.Word, User_1.User],
};
//# sourceMappingURL=mikro-orm.config.js.map