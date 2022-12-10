import { Word } from "../entities/Word";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class WordResolver {
  @Query(() => [Word])
  words(): Promise<Word[]> {
    return Word.find();
  }

  @Query(() => Word, { nullable: true })
  word(@Arg("id") id: number): Promise<Word | null> {
    return Word.findOneBy({ id });
  }

  @Mutation(() => Word)
  async createWord(
    @Arg("word") word: string,
    @Arg("definition") definition: string,
    @Arg("translation", { nullable: true }) translation: string,
    @Arg("wordImageUrl", { nullable: true }) wordImageUrl: string
  ): Promise<Word> {
    return Word.create({
      word,
      definition,
      translation,
      wordImageUrl,
    }).save();
  }

  @Mutation(() => Word, { nullable: true })
  async updateWord(
    @Arg("id") id: number,
    @Arg("word", { nullable: true }) wordText: string,
    @Arg("definition", { nullable: true }) definition: string,
    @Arg("translation", { nullable: true }) translation: string,
    @Arg("wordImageUrl", { nullable: true }) wordImageUrl: string
  ): Promise<Word | null> {
    const word = await Word.findOneBy({
      id,
    });

    if (!word) {
      return null;
    }

    if (typeof wordText !== "undefined") word.word = wordText;
    if (typeof definition !== "undefined") word.definition = definition;
    if (typeof translation !== "undefined") word.translation = translation;
    if (typeof wordImageUrl !== "undefined") word.wordImageUrl = wordImageUrl;

    await Word.save(word);

    return word;
  }

  @Mutation(() => Boolean)
  async deleteWord(@Arg("id") id: number): Promise<boolean> {
    const word = await Word.findOneBy({
      id,
    });

    if (!word) {
      return false;
    }

    await Word.delete({ id });

    return true;
  }
}
