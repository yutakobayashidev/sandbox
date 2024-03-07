import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import OpenAI from "openai";
import { WIRED_JAPANESE_SYSTEM_PROMPT } from "kotobade-asobou";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const command = {
  data: new SlashCommandBuilder()
    .setName("ayasii_jp")
    .setDescription("贵樣ゐ日本语を怪レい日本语に変换レまず")
    .addStringOption((option) =>
      option
        .setName("文字列")
        .setDescription("変换レだい日本语を入力レてくたちい")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: WIRED_JAPANESE_SYSTEM_PROMPT },
        {
          role: "user",
          content: `あやしい中国語に変換されたテキスト： ${interaction.options.getString(
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
        "問題が発生したため、生成できませんでした"
      }`
    );
  },
};
