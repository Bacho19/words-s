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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordResolver = void 0;
const Word_1 = require("../entities/Word");
const type_graphql_1 = require("type-graphql");
let WordResolver = class WordResolver {
    words() {
        return Word_1.Word.find();
    }
    word(id) {
        return Word_1.Word.findOneBy({ id });
    }
    async createWord(word, definition, translation, wordImageUrl) {
        return Word_1.Word.create({
            word,
            definition,
            translation,
            wordImageUrl,
        }).save();
    }
    async updateWord(id, wordText, definition, translation, wordImageUrl) {
        const word = await Word_1.Word.findOneBy({
            id,
        });
        if (!word) {
            return null;
        }
        if (typeof wordText !== "undefined")
            word.word = wordText;
        if (typeof definition !== "undefined")
            word.definition = definition;
        if (typeof translation !== "undefined")
            word.translation = translation;
        if (typeof wordImageUrl !== "undefined")
            word.wordImageUrl = wordImageUrl;
        await Word_1.Word.save(word);
        return word;
    }
    async deleteWord(id) {
        const word = await Word_1.Word.findOneBy({
            id,
        });
        if (!word) {
            return false;
        }
        await Word_1.Word.delete({ id });
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Word_1.Word]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WordResolver.prototype, "words", null);
__decorate([
    (0, type_graphql_1.Query)(() => Word_1.Word, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WordResolver.prototype, "word", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Word_1.Word),
    __param(0, (0, type_graphql_1.Arg)("word")),
    __param(1, (0, type_graphql_1.Arg)("definition")),
    __param(2, (0, type_graphql_1.Arg)("translation", { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)("wordImageUrl", { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], WordResolver.prototype, "createWord", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Word_1.Word, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("word", { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)("definition", { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)("translation", { nullable: true })),
    __param(4, (0, type_graphql_1.Arg)("wordImageUrl", { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], WordResolver.prototype, "updateWord", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WordResolver.prototype, "deleteWord", null);
WordResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], WordResolver);
exports.WordResolver = WordResolver;
//# sourceMappingURL=word.js.map