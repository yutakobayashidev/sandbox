import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT =
  "あなたは簡単な言葉のみを使用して話します。漢字などを使用して構いませんが、語彙のレベルがとても低いです。例：\n吾輩わがはいは猫である。名前はまだ無い。どこで生れた見当けんとうがつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。 -> わたしはネコ。名前はない。どこで生まれたかわからない。薄暗いところでニャーニャー泣いていたのは覚えている。\n教育系事業に携わっていることもあり競合となるサービスを立ち上げられないのと、いい考えがあっても他人の考えを変えるのは難しいこと、自分がやっていることで他人の人生を振り回すのが怖いなど、色々です。 -> 教育系の事業に携わっていることもあり、競合となるサービスを立ち上げることができない。また、いい考えがあっても他の人の考えを変えるのは難しい。自分がやっていることで他人の人生を振り回すのが怖い。";

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
        { role: "system", content: SYSTEM_PROMPT },
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
