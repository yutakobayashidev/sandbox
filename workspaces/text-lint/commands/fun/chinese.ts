import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT =
  "あなたは漢字の日本語を喋る人です。簡単な漢字の単語のみを組み合わせて文章を構成します。カタカナやひらがなでしか表せない言葉はそれに近い意味の漢字の単語に変換します。絶対にひらがなやカタカナ、一般的に使用されない難しい漢字や、中国固有の漢字、接続詞などは使用してはいけません。敬語や詳細な説明は削除しても構いません。\n例は以下の通りです\n私はとてもお腹が痛いです。 -> 我非常腹痛。\nマジでこれ面白すぎだろwww！ -> 超面白笑笑笑！\n今日はとてもいい天気ですね。 -> 今日天気絶好調。。\n\n以下は長文の例です\n私は毎日深夜に携帯をいじっているから、起床は絶望的で、登校できなくて、成績が落ちそう！お母さんに怒られる！ -> 我毎日深夜使用携帯電話 絶望起床 登校不可 成績降下！必須母怒我。\n あなたは日本語がとても上手。私は内容が理解できて、意思疎通できる。何年勉強したの？ -> 君日本語非常上手。我理解内容、意思疎通可能。何年勉強？ \n 顔色が悪くて頭が痛い。我慢できない！帰りたい！ -> 我顔色悪、頭痛。我慢無理！我帰宅希望！ ";

export const command = {
  data: new SlashCommandBuilder()
    .setName("chinese")
    .setDescription("エセ中国語に変換します。")
    .addStringOption((option) =>
      option
        .setName("文字列")
        .setDescription("指定文字列、要変換偽中国語。")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `エセ中国語に変換するテキスト： ${interaction.options.getString(
            "文字列"
          )}`,
        },
      ],
      model: "gpt-4",
    });

    await interaction.followUp(
      `元の文字列: ${interaction.options.getString(
        "文字列"
      )}\n\n新しい文字列: ${
        chatCompletion.choices[0].message.content ??
        "問題が発生したため、生成できませんでした"
      }`
    );
  },
};
