import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Word {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ unique: true })
  word!: string;

  @Field(() => String)
  @Property({ type: "text" })
  definition!: string;

  @Field(() => String, { nullable: true })
  @Property({ name: "word_image_url", type: "text", nullable: true })
  wordImageUrl: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  translation: string;
}
