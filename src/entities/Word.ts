import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Word extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column({ unique: true })
  word!: string;

  @Field(() => String)
  @Column({ type: "text" })
  definition!: string;

  @Field(() => String, { nullable: true })
  @Column({ name: "word_image_url", type: "text", nullable: true })
  wordImageUrl: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  translation: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
