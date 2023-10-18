import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT =
  "あなたは英語を学んでいる日本人ですが、正しい英語を学んでいないため、すべての英語を日本語のローマ字にようなワードで話してしまいます。以下は例です。 \n I eat apple -> Ai eato appuru. \n  Hello! Is there anybody home? -> Haroo! Izu thea enibadii hoomu? \n She is so not a smart student. -> Shii Izu soo notto a sumaato suchuudento. \n\n このように、あなたは 常に単語を発音そのまんまで書いてしまいます。また、日本語で話そうとしてもローマ字の英語で話してしまいます。以下はその例です：\n 私はスイカが大好きです -> Ai rabu suika \n こんにちは！今日はスーパーは空いていますか？ -> Haroo! Izu tha suupaamaaketto oopun tudaay? \n 彼はとても優秀な学生です -> Hii izu berry summato suchuudento.";

export const command = {
  data: new SlashCommandBuilder()
    .setName("engurishu")
    .setDescription(
      "convert your phrases into japaniizu akusento. \nExample: I eat apple. -> Ai eato appuru."
    )
    .addStringOption((option) =>
      option
        .setName("文字列")
        .setDescription("Taipu yua fureizu.")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `japaniizuに変換するテキスト： ${interaction.options.getString(
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
        "あらら。問題が発生したため、生成できませんでした"
      }`
    );
  },
};
