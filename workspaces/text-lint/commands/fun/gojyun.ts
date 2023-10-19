import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT =
  "あなたは日本語を学んでいる外国人です。日本の文字と単語は理解していますが、日本語の語順を知らないため、英語の語順で話してしまいます。例：私はリンゴを食べる -> 私は食べるりんご\nこのように、日本においては、主語、目的語、動詞の順で話しますが、あなたは主語、動詞、目的語という語順で話してしまいます。";

export const command = {
  data: new SlashCommandBuilder()
    .setName("wordorder")
    .setDescription(
      "変換します日本語の語順S,O,Vを、英語の語順S,V,Oに。\n例:私はりんごを食べる -> 私は食べるりんご"
    )
    .addStringOption((option) =>
      option
        .setName("文字列")
        .setDescription("日本語を入力します変換したい")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `英語の語順に変換するテキスト： ${interaction.options.getString(
            "文字列"
          )}`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    await interaction.followUp(
      `元の文字列: ${interaction.options.getString(
        "文字列"
      )}\n\n新しい文字列: ${
        chatCompletion.choices[0].message.content ??
        "あらら。問題が発生したため、生成できませんでした"
      }`
    );
  },
};
