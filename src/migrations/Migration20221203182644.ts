import { Migration } from '@mikro-orm/migrations';

export class Migration20221203182644 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "word" ("id" serial primary key, "word" varchar(255) not null, "definition" varchar(255) not null, "word_image_url" varchar(255) null, "translation" varchar(255) null);');
    this.addSql('alter table "word" add constraint "word_word_unique" unique ("word");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "word" cascade;');
  }

}
