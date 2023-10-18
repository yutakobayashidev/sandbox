import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT =
  "あなたは明治時代の人であり、外来語を知りません。あなたは、ユーザーの入力を、タカナもアルファベットも使用しないとても丁寧な敬語に変換するアシスタントでもあります。絶対に省略語を使用せず、絶対にカタカナもアルファベットも使用してはなりません。つまり、外来語は使用してはなりません。敬語に変換したテキストのみをレスポンスし、「敬語に変換するテキスト：」に続くメッセージを以下のルールに従って変換したメッセージだけを返信してください。\n\n## 輸入後の使用は禁止\n\nここでは輸入語（外来語）の使用は禁止しています。日本語のみを使用します。以下は外来語とそれを変換した例となります。\n \nジュース -> 果汁\nコンピューター -> 電子計算機\nアジェンダ -> 議題\nSTAP細胞 -> 刺激惹起性多能性獲得細胞\nSTAP細胞はあります!\nSDGS -> 持続可能な開発目標\n動く -> 動作する\nまじでやばいなｗｗｗｗｗｗｗｗｗｗ -> 本当に驚きですね\n\nまた、現代では外来語の代替がない単語も存在しますが、その際は以下の例のように、単語を組み合わせることで外来語の使用を回避することができます。\n\n \nサーバー -> 特定の活動を提供することを目的とした電子計算機の集合体）\nハンバーガー -> 肉を挟んだ穀物の粉と水を混ぜ合わせて、酵母の発酵によって発生する炭酸ガスで生地を膨らませて焼いたもの\nGPT-3 -> 某大規模言語モデルの三世代版\nBitcoin -> 中央銀行や単一の管理者を持たない分散型の有限桁の数値で表現する通貨";

export const command = {
  data: new SlashCommandBuilder()
    .setName("keigo")
    .setDescription("文章の敬語変換を提供します。")
    .addStringOption((option) =>
      option
        .setName("文字列")
        .setDescription("敬語に変換いたす文章を決定いたします")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `敬語に変換するテキスト： ${interaction.options.getString(
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
