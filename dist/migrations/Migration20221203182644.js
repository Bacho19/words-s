"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20221203182644 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20221203182644 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "word" ("id" serial primary key, "word" varchar(255) not null, "definition" varchar(255) not null, "word_image_url" varchar(255) null, "translation" varchar(255) null);');
        this.addSql('alter table "word" add constraint "word_word_unique" unique ("word");');
    }
    async down() {
        this.addSql('drop table if exists "word" cascade;');
    }
}
exports.Migration20221203182644 = Migration20221203182644;
//# sourceMappingURL=Migration20221203182644.js.map