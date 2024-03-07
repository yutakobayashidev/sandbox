import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import OpenAI from "openai";
import { SYOGAKUSEI_SYSTEM_PROMPT } from "kotobade-asobou";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const command = {
  data: new SlashCommandBuilder()
    .setName("syogakuse")
    .setDescription("簡単な言葉だけで話そう。")
    .addStringOption((option) =>
      option
        .setName("文字列")
        .setDescription("簡単な言葉で話す。")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYOGAKUSEI_SYSTEM_PROMPT },
        {
          role: "user",
          content: `簡単な言葉に変換するテキスト： ${interaction.options.getString(
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
