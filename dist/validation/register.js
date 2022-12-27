"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (email, username, password) => {
    if (email.length < 5) {
        return [
            {
                field: "email",
                message: "length must be greater than 4",
            },
        ];
    }
    if (!email.includes("@")) {
        return [
            {
                field: "email",
                message: "invalid email",
            },
        ];
    }
    if (username.length < 3) {
        return [
            {
                field: "username",
                message: "length must be greater than 2",
            },
        ];
    }
    if (username.includes("@")) {
        return [
            {
                field: "username",
                message: "username must not contain an '@' symbol",
            },
        ];
    }
    if (password.length < 3) {
        return [
            {
                field: "password",
                message: "length must be greater than 2",
            },
        ];
    }
    return null;
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=register.js.map