"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20221203191849 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20221203191849 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "word" alter column "definition" type text using ("definition"::text);');
        this.addSql('alter table "word" alter column "word_image_url" type text using ("word_image_url"::text);');
    }
    async down() {
        this.addSql('alter table "word" alter column "definition" type varchar using ("definition"::varchar);');
        this.addSql('alter table "word" alter column "word_image_url" type varchar using ("word_image_url"::varchar);');
    }
}
exports.Migration20221203191849 = Migration20221203191849;
//# sourceMappingURL=Migration20221203191849.js.map