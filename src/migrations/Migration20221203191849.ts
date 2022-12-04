import { Migration } from '@mikro-orm/migrations';

export class Migration20221203191849 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "word" alter column "definition" type text using ("definition"::text);');
    this.addSql('alter table "word" alter column "word_image_url" type text using ("word_image_url"::text);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "word" alter column "definition" type varchar using ("definition"::varchar);');
    this.addSql('alter table "word" alter column "word_image_url" type varchar using ("word_image_url"::varchar);');
  }

}
