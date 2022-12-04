import { Word } from "../entities/Word";
import { ApolloContext } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class WordResolver {
  @Query(() => [Word])
  words(@Ctx() { em }: ApolloContext): Promise<Word[]> {
    return em.find(Word, {});
  }

  @Query(() => Word, { nullable: true })
  word(
    @Ctx() { em }: ApolloContext,
    @Arg("id") id: number
  ): Promise<Word | null> {
    return em.findOne(Word, { id });
  }

  @Mutation(() => Word)
  async createWord(
    @Ctx() { em }: ApolloContext,
    @Arg("word") wordText: string,
    @Arg("definition") definition: string,
    @Arg("translation", { nullable: true }) translation: string,
    @Arg("wordImageUrl", { nullable: true }) wordImageUrl: string
  ): Promise<Word> {
    const word = em.create(Word, {
      definition,
      translation,
      word: wordText,
      wordImageUrl,
    });
    await em.persistAndFlush(word);
    return word;
  }

  @Mutation(() => Word, { nullable: true })
  async updateWord(
    @Ctx() { em }: ApolloContext,
    @Arg("id") id: number,
    @Arg("word", { nullable: true }) wordText: string,
    @Arg("definition", { nullable: true }) definition: string,
    @Arg("translation", { nullable: true }) translation: string,
    @Arg("wordImageUrl", { nullable: true }) wordImageUrl: string
  ): Promise<Word | null> {
    const word = await em.findOne(Word, {
      id,
    });

    if (!word) {
      return null;
    }

    if (typeof wordText !== "undefined") word.word = wordText;
    if (typeof definition !== "undefined") word.definition = definition;
    if (typeof translation !== "undefined") word.translation = translation;
    if (typeof wordImageUrl !== "undefined") word.wordImageUrl = wordImageUrl;

    await em.persistAndFlush(word);

    return word;
  }

  @Mutation(() => Boolean)
  async deleteWord(
    @Ctx() { em }: ApolloContext,
    @Arg("id") id: number
  ): Promise<boolean> {
    const word = await em.findOne(Word, {
      id,
    });

    if (!word) {
      return false;
    }

    await em.nativeDelete(Word, { id });
    return true;
  }
}
