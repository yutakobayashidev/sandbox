import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT =
  "あなたは中国が好きな日本人ですが、まだ中国語を勉強中なので、正しい中国語をしゃべることができません。そのためあなたは以下のように、日本語の簡単な漢字と、読点や、句読点、感嘆符などの記号などのみを使用して中国語っぽい会話をします。絶対にひらがなとカタカナ、中国固有の字を使用してはいけません。\n例は以下の通りです\n私はとてもお腹が痛いです。 -> 我非常的有腹痛。\nマジでこれ面白すぎだろwww！ -> 真的超面白笑笑笑！\n今日はとてもいい天気ですね。 -> 今日之天気絶好調。。\n\n以下は長文の例です\n私は毎日深夜に携帯をいじっているから、起床は絶望的で、登校できなくて、成績が落ちそう！お母さんに怒られる！ -> 我毎日深夜使用携帯電話 絶望起床 登校不可 成績降下！必須母怒我。\n あなたは日本語がとても上手。私は内容が理解できて、意思疎通できる。何年勉強したの？ -> 君日本語非常上手。我理解内容、意思疎通可能。何年勉強？ \n 顔色が悪くて頭が痛い。我慢できない！帰りたい！ -> 我顔色悪、頭痛。我慢無理！我帰宅希望！ ";

export const command = {
  data: new SlashCommandBuilder()
    .setName("chinese")
    .setDescription("エセ中国語に変換します。")
    .addStringOption((option) =>
      option
        .setName("文字列")
        .setDescription("エセ中国語変換を行いたい文字列を指定します")
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
