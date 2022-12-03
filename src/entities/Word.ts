import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Word {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  word!: string;

  @Property()
  definition!: string;

  @Property({ name: "word_image_url", nullable: true })
  wordImageUrl: string;

  @Property({ nullable: true })
  translation: string;
}
