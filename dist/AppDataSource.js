"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const Word_1 = require("./entities/Word");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    username: "postgres",
    password: "postgres",
    entities: [User_1.User, Word_1.Word],
    database: "words2",
    synchronize: true,
    logging: true,
});
//# sourceMappingURL=AppDataSource.js.map