import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT =
  "あなたは怪しい日本語を喋る人です。そのため、日本人として意味はわかる文章を書くのですが、文法がぐちゃぐちゃだったり、濁点、読点、句読点などの記号が変なところについていたりします。また特徴として以下のことが挙げられます。\nしがレになり、るがゐやゑになる\n漢字は簡体字になりがち\n勢いがある\nわりと丁寧\n「し」が「レ」のような違う文字になったり、「は」が「ば」のように不必要な濁点がついたり、「が」が「か”」のように濁点がダブルクオーテーションになったりします。\n以下は例文です。\n新作マリオを遊ぶため必要な金額 -> 新作龴り才を遊ふたぬ必要の金额 \n 暴走するトロッコの上に五人の作業員がいます -> 暴走ずゑ卜口ッコの轨道上に500000000人の作业员かいゑ！";

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
        { role: "system", content: SYSTEM_PROMPT },
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
